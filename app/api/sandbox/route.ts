import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/sandbox - Get sandbox status
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get sandbox status from settings or database
    const settings = await query(
      `SELECT * FROM system_settings WHERE key = 'sandbox_enabled' LIMIT 1`
    );

    const sandboxEnabled = settings.length > 0 ? settings[0].value === 'true' : false;

    // Get sandbox stats
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_sandbox = true) as sandbox_users,
        (SELECT COUNT(*) FROM projects WHERE is_sandbox = true) as sandbox_projects,
        (SELECT COUNT(*) FROM negotiations WHERE is_sandbox = true) as sandbox_negotiations,
        (SELECT COUNT(*) FROM wallets WHERE is_sandbox = true) as sandbox_wallets
    `);

    return NextResponse.json({
      success: true,
      sandboxEnabled,
      stats: stats[0] || {}
    });
  } catch (error) {
    console.error('Error getting sandbox status:', error);
    return NextResponse.json({ success: false, error: 'Failed to get sandbox status' }, { status: 500 });
  }
}

// POST /api/sandbox - Toggle sandbox or perform sandbox actions
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'toggle':
        return await toggleSandbox(data?.enabled);
      
      case 'generate_data':
        return await generateSandboxData(data);
      
      case 'clear_data':
        return await clearSandboxData();
      
      case 'create_bot':
        return await createNegotiationBot(data);
      
      case 'activate_bot':
        return await activateBot(data?.botId, data?.negotiationId);
      
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in sandbox operation:', error);
    return NextResponse.json({ success: false, error: 'Failed to perform sandbox operation' }, { status: 500 });
  }
}

async function toggleSandbox(enabled: boolean) {
  await query(
    `INSERT INTO system_settings (key, value, updated_at)
     VALUES ('sandbox_enabled', $1, CURRENT_TIMESTAMP)
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
    [enabled.toString()]
  );

  return NextResponse.json({ success: true, sandboxEnabled: enabled });
}

async function generateSandboxData(options: any) {
  const { users = 10, projects = 20, negotiations = 15, wallets = true } = options || {};

  // Generate sandbox users
  const generatedUsers = [];
  for (let i = 0; i < users; i++) {
    const user = await query(
      `INSERT INTO users (
        email, password, name, username, role, is_sandbox, created_at
      ) VALUES ($1, $2, $3, $4, 'user', true, CURRENT_TIMESTAMP)
      RETURNING id, email, name`,
      [
        `sandbox_user_${i}@bithrah.test`,
        '$2b$10$dummyhashedpassword', // Dummy password
        `مستخدم تجريبي ${i + 1}`,
        `sandbox_${i + 1}`
      ]
    );
    generatedUsers.push(user[0]);
  }

  // Generate sandbox projects
  const categories = ['technology', 'health', 'education', 'finance', 'retail', 'services'];
  const generatedProjects = [];
  
  for (let i = 0; i < projects; i++) {
    const randomUser = generatedUsers[Math.floor(Math.random() * generatedUsers.length)];
    const project = await query(
      `INSERT INTO projects (
        creator_id, title, description, category, funding_goal, 
        current_funding, status, is_sandbox, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', true, CURRENT_TIMESTAMP)
      RETURNING id, title`,
      [
        randomUser.id,
        `مشروع تجريبي ${i + 1}`,
        `وصف تفصيلي للمشروع التجريبي رقم ${i + 1}. هذا مشروع للاختبار فقط.`,
        categories[Math.floor(Math.random() * categories.length)],
        (Math.floor(Math.random() * 900000) + 100000).toString(), // 100k - 1M
        (Math.floor(Math.random() * 50000)).toString()
      ]
    );
    generatedProjects.push(project[0]);
  }

  // Generate sandbox negotiations with bots
  for (let i = 0; i < negotiations; i++) {
    const randomUser = generatedUsers[Math.floor(Math.random() * generatedUsers.length)];
    const randomProject = generatedProjects[Math.floor(Math.random() * generatedProjects.length)];
    
    await query(
      `INSERT INTO negotiations (
        project_id, investor_id, status, deposit_amount, 
        deposit_status, is_sandbox, created_at, expires_at
      ) VALUES ($1, $2, 'active', $3, 'held', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 days')`,
      [
        randomProject.id,
        randomUser.id,
        (Math.floor(Math.random() * 9000) + 1000).toString() // 1k - 10k
      ]
    );
  }

  // Generate sandbox wallets with dummy balances
  if (wallets) {
    for (const user of generatedUsers) {
      await query(
        `INSERT INTO wallets (
          user_id, balance, currency, is_sandbox, created_at
        ) VALUES ($1, $2, 'SAR', true, CURRENT_TIMESTAMP)`,
        [
          user.id,
          (Math.floor(Math.random() * 90000) + 10000).toString() // 10k - 100k
        ]
      );
    }
  }

  return NextResponse.json({
    success: true,
    generated: {
      users: generatedUsers.length,
      projects: generatedProjects.length,
      negotiations,
      wallets: wallets ? generatedUsers.length : 0
    }
  });
}

async function clearSandboxData() {
  // Delete all sandbox data
  await query(`DELETE FROM wallets WHERE is_sandbox = true`);
  await query(`DELETE FROM negotiations WHERE is_sandbox = true`);
  await query(`DELETE FROM projects WHERE is_sandbox = true`);
  await query(`DELETE FROM users WHERE is_sandbox = true`);
  await query(`DELETE FROM negotiation_bots WHERE is_sandbox = true`);

  return NextResponse.json({ success: true, message: 'Sandbox data cleared' });
}

async function createNegotiationBot(data: any) {
  const {
    name,
    type = 'investor', // investor, project_owner, mediator
    personality = 'professional',
    responseDelay = 2000,
    strategies = []
  } = data;

  const bot = await query(
    `INSERT INTO negotiation_bots (
      name, type, personality, response_delay, strategies, 
      is_active, is_sandbox, created_at
    ) VALUES ($1, $2, $3, $4, $5, true, true, CURRENT_TIMESTAMP)
    RETURNING *`,
    [
      name,
      type,
      personality,
      responseDelay,
      JSON.stringify(strategies)
    ]
  );

  return NextResponse.json({ success: true, bot: bot[0] });
}

async function activateBot(botId: number, negotiationId: number) {
  // Assign bot to negotiation
  await query(
    `UPDATE negotiations SET bot_id = $1 WHERE id = $2`,
    [botId, negotiationId]
  );

  // Start bot conversation
  await query(
    `INSERT INTO negotiation_messages (
      negotiation_id, sender_id, message, is_bot_message, created_at
    ) VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)`,
    [
      negotiationId,
      botId,
      'مرحباً، أنا مساعد ذكي للتفاوض. كيف يمكنني مساعدتك اليوم؟'
    ]
  );

  return NextResponse.json({ success: true, message: 'Bot activated' });
}

