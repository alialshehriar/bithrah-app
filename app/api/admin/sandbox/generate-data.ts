import { neon } from '@neondatabase/serverless';

export async function generateComprehensiveSandboxData() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    // 1. Generate users with funded wallets
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const user = await sql`
        INSERT INTO users (name, email, password, role, bio, points, wallet_balance, is_sandbox)
        VALUES (
          ${`مستخدم تجريبي ${i}`},
          ${`test${i}@sandbox.com`},
          '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
          ${i <= 2 ? 'investor' : 'user'},
          ${`مستخدم تجريبي رقم ${i} للاختبار`},
          ${Math.floor(Math.random() * 1000)},
          ${Math.floor(Math.random() * 50000) + 10000},
          true
        )
        RETURNING id
      `;
      users.push(user[0].id);
    }

    // 2. Generate projects with different subscription packages
    const projects = [];
    for (let i = 1; i <= 5; i++) {
      const project = await sql`
        INSERT INTO projects (
          title, description, category, funding_goal, current_amount,
          end_date, owner_id, status, is_sandbox, subscription_package_id
        )
        VALUES (
          ${`مشروع تجريبي ${i}`},
          ${`وصف تفصيلي للمشروع التجريبي رقم ${i}`},
          'technology',
          ${Math.floor(Math.random() * 500000) + 100000},
          ${Math.floor(Math.random() * 50000)},
          NOW() + INTERVAL '60 days',
          ${users[i % users.length]},
          'active',
          true,
          ${i % 2 === 0 ? 1 : 2}
        )
        RETURNING id
      `;
      projects.push(project[0].id);
    }

    // 3. Generate negotiations between investors and project owners
    for (let i = 0; i < 8; i++) {
      const investorId = users[i % 2]; // First 2 users are investors
      const projectId = projects[i % projects.length];
      const ownerId = users[(i % projects.length) + 2];
      
      const statuses = ['pending', 'active', 'accepted', 'rejected'];
      const status = statuses[i % statuses.length];
      
      const negotiation = await sql`
        INSERT INTO negotiations (
          project_id, investor_id, owner_id, status,
          initial_offer, current_offer, equity_percentage
        )
        VALUES (
          ${projectId},
          ${investorId},
          ${ownerId},
          ${status},
          ${Math.floor(Math.random() * 100000) + 50000},
          ${Math.floor(Math.random() * 100000) + 50000},
          ${Math.floor(Math.random() * 20) + 5}
        )
        RETURNING id
      `;
      
      // Add negotiation messages
      for (let j = 0; j < 3; j++) {
        await sql`
          INSERT INTO negotiation_messages (
            negotiation_id, sender_id, message, offer_amount
          )
          VALUES (
            ${negotiation[0].id},
            ${j % 2 === 0 ? investorId : ownerId},
            ${`رسالة تفاوضية رقم ${j + 1}`},
            ${j > 0 ? Math.floor(Math.random() * 100000) + 50000 : null}
          )
        `;
      }
    }

    // 4. Generate AI evaluations
    for (const projectId of projects) {
      await sql`
        INSERT INTO project_evaluations (
          user_id, project_id, project_title, project_description,
          overall_score, innovation_score, market_viability_score,
          financial_viability_score, execution_feasibility_score,
          competitive_advantage_score, strengths, weaknesses, recommendations
        )
        VALUES (
          ${users[0]},
          ${projectId},
          'مشروع تجريبي',
          'وصف المشروع التجريبي',
          ${(Math.random() * 3 + 7).toFixed(1)},
          ${(Math.random() * 3 + 7).toFixed(1)},
          ${(Math.random() * 3 + 7).toFixed(1)},
          ${(Math.random() * 3 + 7).toFixed(1)},
          ${(Math.random() * 3 + 7).toFixed(1)},
          ${(Math.random() * 3 + 7).toFixed(1)},
          'فكرة مبتكرة، فريق قوي، سوق واعد',
          'منافسة شديدة، تحديات تقنية',
          'تحسين الخطة التسويقية، تعزيز الفريق'
        )
      `;
    }

    // 5. Generate communities
    for (let i = 1; i <= 3; i++) {
      await sql`
        INSERT INTO communities (
          name, description, category, creator_id, is_sandbox
        )
        VALUES (
          ${`مجتمع تجريبي ${i}`},
          ${`وصف المجتمع التجريبي رقم ${i}`},
          'technology',
          ${users[i]},
          true
        )
      `;
    }

    // 6. Generate user activities
    const activities = ['project_view', 'project_support', 'negotiation_start', 'evaluation_request', 'community_join'];
    for (let i = 0; i < 50; i++) {
      await sql`
        INSERT INTO user_activities (
          user_id, activity_type, metadata
        )
        VALUES (
          ${users[i % users.length]},
          ${activities[i % activities.length]},
          '{}'
        )
      `;
    }

    return {
      users: users.length,
      projects: projects.length,
      negotiations: 8,
      evaluations: projects.length,
      communities: 3,
      activities: 50
    };
  } catch (error) {
    console.error('Error generating sandbox data:', error);
    throw error;
  }
}
