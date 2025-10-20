import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST() {
  try {
    // الاتصال بقاعدة البيانات
    const sql = neon(process.env.DATABASE_URL!);
    
    // قراءة سكريبت SQL
    const scriptPath = join(process.cwd(), 'scripts', 'phase1-cleanup-rebuild.sql');
    const sqlScript = await readFile(scriptPath, 'utf-8');
    
    // تنفيذ السكريبت
    const result = await sql(sqlScript);
    
    return NextResponse.json({
      success: true,
      message: 'تم تنظيف وإعادة بناء البيانات بنجاح',
      data: result
    });
  } catch (error: any) {
    console.error('Error rebuilding demo data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'فشل في تنظيف وإعادة بناء البيانات',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

