'use server';

import { db } from '@/lib/db';
import { ndaAgreements, ndaOtpVerifications, ndaTemplates, users } from '@/lib/db/schema';
import { eq, desc, and, gte, lte, sql, count } from 'drizzle-orm';

// Get all NDA agreements with user info
export async function getAllNDAgreements(filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) {
  try {
    let query = db
      .select({
        agreement: ndaAgreements,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        },
      })
      .from(ndaAgreements)
      .leftJoin(users, eq(ndaAgreements.userId, users.id))
      .orderBy(desc(ndaAgreements.createdAt));

    const agreements = await query;

    return { success: true, agreements };
  } catch (error) {
    console.error('Error getting NDA agreements:', error);
    return { success: false, error: 'Failed to get agreements' };
  }
}

// Get NDA statistics
export async function getNDAStatistics() {
  try {
    // Total agreements
    const totalResult = await db
      .select({ count: count() })
      .from(ndaAgreements);
    const total = totalResult[0]?.count || 0;

    // Active agreements
    const activeResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(and(eq(ndaAgreements.status, 'active'), eq(ndaAgreements.isValid, true)));
    const active = activeResult[0]?.count || 0;

    // Verified agreements
    const verifiedResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(eq(ndaAgreements.otpVerified, true));
    const verified = verifiedResult[0]?.count || 0;

    // PDF generated
    const pdfResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(eq(ndaAgreements.pdfGenerated, true));
    const pdfGenerated = pdfResult[0]?.count || 0;

    // Email sent
    const emailResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(eq(ndaAgreements.emailSent, true));
    const emailSent = emailResult[0]?.count || 0;

    // Today's agreements
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(gte(ndaAgreements.createdAt, today));
    const todayCount = todayResult[0]?.count || 0;

    // This week's agreements
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(gte(ndaAgreements.createdAt, weekAgo));
    const weekCount = weekResult[0]?.count || 0;

    // This month's agreements
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthResult = await db
      .select({ count: count() })
      .from(ndaAgreements)
      .where(gte(ndaAgreements.createdAt, monthAgo));
    const monthCount = monthResult[0]?.count || 0;

    return {
      success: true,
      stats: {
        total,
        active,
        verified,
        pdfGenerated,
        emailSent,
        todayCount,
        weekCount,
        monthCount,
      },
    };
  } catch (error) {
    console.error('Error getting NDA statistics:', error);
    return { success: false, error: 'Failed to get statistics' };
  }
}

// Get NDA agreement by ID
export async function getNDAgreementById(id: number) {
  try {
    const [agreement] = await db
      .select({
        agreement: ndaAgreements,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        },
      })
      .from(ndaAgreements)
      .leftJoin(users, eq(ndaAgreements.userId, users.id))
      .where(eq(ndaAgreements.id, id))
      .limit(1);

    if (!agreement) {
      return { success: false, error: 'Agreement not found' };
    }

    // Get OTP verifications for this agreement
    const otpVerifications = await db
      .select()
      .from(ndaOtpVerifications)
      .where(eq(ndaOtpVerifications.ndaAgreementId, id))
      .orderBy(desc(ndaOtpVerifications.createdAt));

    return {
      success: true,
      agreement: agreement.agreement,
      user: agreement.user,
      otpVerifications,
    };
  } catch (error) {
    console.error('Error getting NDA agreement:', error);
    return { success: false, error: 'Failed to get agreement' };
  }
}

// Revoke NDA agreement
export async function revokeNDAgreement(id: number, adminId: number, reason: string) {
  try {
    await db
      .update(ndaAgreements)
      .set({
        isValid: false,
        status: 'revoked',
        revokedBy: adminId,
        revokedAt: new Date(),
        revokedReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(ndaAgreements.id, id));

    return { success: true };
  } catch (error) {
    console.error('Error revoking NDA agreement:', error);
    return { success: false, error: 'Failed to revoke agreement' };
  }
}

// Get all NDA templates
export async function getAllNDATemplates() {
  try {
    const templates = await db
      .select()
      .from(ndaTemplates)
      .orderBy(desc(ndaTemplates.createdAt));

    return { success: true, templates };
  } catch (error) {
    console.error('Error getting NDA templates:', error);
    return { success: false, error: 'Failed to get templates' };
  }
}

// Create NDA template
export async function createNDATemplate(data: {
  version: string;
  title: string;
  contentArabic: string;
  contentEnglish?: string;
  isActive: boolean;
  isDefault: boolean;
  createdBy: number;
  notes?: string;
}) {
  try {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await db
        .update(ndaTemplates)
        .set({ isDefault: false })
        .where(eq(ndaTemplates.isDefault, true));
    }

    // If this is set as active, optionally unset other actives
    if (data.isActive) {
      await db
        .update(ndaTemplates)
        .set({ isActive: false })
        .where(eq(ndaTemplates.isActive, true));
    }

    const [template] = await db
      .insert(ndaTemplates)
      .values({
        ...data,
        activatedAt: data.isActive ? new Date() : null,
      })
      .returning();

    return { success: true, template };
  } catch (error) {
    console.error('Error creating NDA template:', error);
    return { success: false, error: 'Failed to create template' };
  }
}

// Update NDA template
export async function updateNDATemplate(
  id: number,
  data: {
    title?: string;
    contentArabic?: string;
    contentEnglish?: string;
    isActive?: boolean;
    isDefault?: boolean;
    notes?: string;
  }
) {
  try {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await db
        .update(ndaTemplates)
        .set({ isDefault: false })
        .where(eq(ndaTemplates.isDefault, true));
    }

    // If this is set as active, optionally unset other actives
    if (data.isActive) {
      await db
        .update(ndaTemplates)
        .set({ isActive: false })
        .where(eq(ndaTemplates.isActive, true));
    }

    await db
      .update(ndaTemplates)
      .set({
        ...data,
        activatedAt: data.isActive ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(ndaTemplates.id, id));

    return { success: true };
  } catch (error) {
    console.error('Error updating NDA template:', error);
    return { success: false, error: 'Failed to update template' };
  }
}

// Delete NDA template
export async function deleteNDATemplate(id: number) {
  try {
    await db.delete(ndaTemplates).where(eq(ndaTemplates.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting NDA template:', error);
    return { success: false, error: 'Failed to delete template' };
  }
}

// Get NDA analytics
export async function getNDAAnalytics() {
  try {
    // Agreements by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const agreementsByDay = await db
      .select({
        date: sql<string>`DATE(${ndaAgreements.createdAt})`,
        count: count(),
      })
      .from(ndaAgreements)
      .where(gte(ndaAgreements.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${ndaAgreements.createdAt})`)
      .orderBy(sql`DATE(${ndaAgreements.createdAt})`);

    // Agreements by status
    const agreementsByStatus = await db
      .select({
        status: ndaAgreements.status,
        count: count(),
      })
      .from(ndaAgreements)
      .groupBy(ndaAgreements.status);

    // Agreements by device type
    const agreementsByDevice = await db
      .select({
        deviceType: ndaAgreements.deviceType,
        count: count(),
      })
      .from(ndaAgreements)
      .groupBy(ndaAgreements.deviceType);

    // Agreements by browser
    const agreementsByBrowser = await db
      .select({
        browser: ndaAgreements.browser,
        count: count(),
      })
      .from(ndaAgreements)
      .groupBy(ndaAgreements.browser);

    return {
      success: true,
      analytics: {
        agreementsByDay,
        agreementsByStatus,
        agreementsByDevice,
        agreementsByBrowser,
      },
    };
  } catch (error) {
    console.error('Error getting NDA analytics:', error);
    return { success: false, error: 'Failed to get analytics' };
  }
}

