import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real implementation, delete from database
    // await db.delete(ideaEvaluations).where(eq(ideaEvaluations.id, id));
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف التقييم بنجاح',
    });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف التقييم' },
      { status: 500 }
    );
  }
}

