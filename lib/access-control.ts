/**
 * Access Control System for Bithrah Platform
 * 
 * This module handles the 3-level IP protection system:
 * Level 1: Public (Visitors - not logged in)
 * Level 2: Registered (Logged in users who signed NDA)
 * Level 3: Negotiator (Users who paid deposit and opened negotiation)
 */

export type AccessLevel = 'public' | 'registered' | 'negotiator';

export interface ProjectAccessData {
  // Level 1: Public (everyone can see)
  id: number;
  title: string;
  publicDescription: string | null;
  category: string | null;
  image: string | null;
  fundingGoal: string;
  currentFunding: string;
  backersCount: number;
  fundingEndDate: Date | null;
  creatorName: string;
  
  // Level 2: Registered users only
  registeredDescription?: string | null;
  packages?: any;
  teamMembers?: any;
  faq?: any;
  updates?: any;
  risks?: string | null;
  
  // Level 3: Negotiators only
  fullDescription?: string | null;
  confidentialDocs?: any;
  detailedFinancials?: any;
  businessPlan?: any;
}

/**
 * Determine user's access level for a project
 */
export async function getUserAccessLevel(
  userId: number | null,
  projectId: number,
  db: any
): Promise<AccessLevel> {
  // Not logged in = public access
  if (!userId) {
    return 'public';
  }
  
  // Check if user has active negotiation with full access
  const negotiation = await db.query.negotiations.findFirst({
    where: (negotiations: any, { and, eq }: any) =>
      and(
        eq(negotiations.projectId, projectId),
        eq(negotiations.investorId, userId),
        eq(negotiations.hasFullAccess, true),
        eq(negotiations.status, 'active')
      ),
  });
  
  if (negotiation) {
    return 'negotiator';
  }
  
  // Check if user signed NDA (platform-wide or project-specific)
  const nda = await db.query.ndaAgreements.findFirst({
    where: (ndaAgreements: any, { and, eq, or }: any) =>
      and(
        eq(ndaAgreements.userId, userId),
        eq(ndaAgreements.status, 'active'),
        or(
          eq(ndaAgreements.agreementType, 'platform'),
          and(
            eq(ndaAgreements.agreementType, 'project'),
            eq(ndaAgreements.projectId, projectId)
          )
        )
      ),
  });
  
  if (nda) {
    return 'registered';
  }
  
  // User is logged in but hasn't signed NDA = public access
  return 'public';
}

/**
 * Filter project data based on access level
 */
export function filterProjectByAccessLevel(
  project: any,
  accessLevel: AccessLevel
): ProjectAccessData {
  const baseData: ProjectAccessData = {
    id: project.id,
    title: project.title,
    publicDescription: project.publicDescription || project.shortDescription,
    category: project.category,
    image: project.image,
    fundingGoal: project.fundingGoal,
    currentFunding: project.currentFunding,
    backersCount: project.backersCount,
    fundingEndDate: project.fundingEndDate,
    creatorName: project.creator?.name || 'مجهول',
  };
  
  // Level 2: Add registered user data
  if (accessLevel === 'registered' || accessLevel === 'negotiator') {
    baseData.registeredDescription = project.registeredDescription || project.description;
    baseData.packages = project.packages;
    baseData.teamMembers = project.teamMembers;
    baseData.faq = project.faq;
    baseData.updates = project.updates;
    baseData.risks = project.risks;
  }
  
  // Level 3: Add negotiator-only data
  if (accessLevel === 'negotiator') {
    baseData.fullDescription = project.fullDescription || project.description;
    baseData.confidentialDocs = project.confidentialDocs;
    baseData.detailedFinancials = project.metadata?.financials;
    baseData.businessPlan = project.metadata?.businessPlan;
  }
  
  return baseData;
}

/**
 * Log project access for analytics and security
 */
export async function logProjectAccess(
  db: any,
  data: {
    projectId: number;
    userId: number | null;
    accessLevel: AccessLevel;
    accessType: 'view' | 'download' | 'share';
    contentType?: string;
    contentId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }
) {
  try {
    await db.insert(db.schema.projectAccessLogs).values({
      projectId: data.projectId,
      userId: data.userId,
      accessLevel: data.accessLevel,
      accessType: data.accessType,
      contentType: data.contentType,
      contentId: data.contentId,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referrer: data.referrer,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to log project access:', error);
    // Don't throw - logging shouldn't break the request
  }
}

/**
 * Check if user needs to sign NDA
 */
export async function needsNDASignature(
  userId: number,
  db: any
): Promise<boolean> {
  const nda = await db.query.ndaAgreements.findFirst({
    where: (ndaAgreements: any, { and, eq }: any) =>
      and(
        eq(ndaAgreements.userId, userId),
        eq(ndaAgreements.agreementType, 'platform'),
        eq(ndaAgreements.status, 'active')
      ),
  });
  
  return !nda;
}

/**
 * Get NDA agreement text
 */
export function getNDAText(type: 'platform' | 'project' = 'platform'): string {
  if (type === 'platform') {
    return `
# اتفاقية عدم الإفشاء - منصة بذرة

## 1. المقدمة
بموافقتك على هذه الاتفاقية، فإنك تقر وتوافق على الالتزام بشروط السرية التالية عند استخدام منصة بذرة.

## 2. التعريفات
- **المعلومات السرية**: تشمل جميع الأفكار والمشاريع والخطط والبيانات المالية والمعلومات التجارية المعروضة على المنصة.
- **المستخدم**: أي شخص يقوم بالتسجيل واستخدام منصة بذرة.

## 3. الالتزامات
أنت توافق على:
1. **عدم الإفشاء**: عدم الكشف عن أي معلومات سرية لأي طرف ثالث دون إذن كتابي مسبق من صاحب المشروع.
2. **عدم الاستخدام**: عدم استخدام المعلومات السرية لأي غرض خارج نطاق المنصة.
3. **الحماية**: اتخاذ جميع الإجراءات المعقولة لحماية سرية المعلومات.
4. **عدم النسخ**: عدم نسخ أو استنساخ أو تقليد أي فكرة أو مشروع معروض على المنصة.

## 4. الاستثناءات
لا تنطبق التزامات السرية على المعلومات التي:
- كانت معروفة للعامة قبل الإفشاء
- أصبحت معروفة للعامة دون خرق هذه الاتفاقية
- تم الحصول عليها بشكل قانوني من طرف ثالث

## 5. مدة الاتفاقية
تظل هذه الاتفاقية سارية المفعول طالما أنك مستخدم نشط على المنصة، ولمدة 5 سنوات بعد إنهاء استخدامك للمنصة.

## 6. العواقب القانونية
أي خرق لهذه الاتفاقية قد يؤدي إلى:
- إيقاف حسابك على المنصة
- اتخاذ إجراءات قانونية
- المطالبة بالتعويضات

## 7. القانون الساري
تخضع هذه الاتفاقية للقوانين السارية في المملكة العربية السعودية.

---

**بالموافقة على هذه الاتفاقية، فإنك تقر بأنك قرأت وفهمت وتوافق على الالتزام بجميع الشروط المذكورة أعلاه.**
    `.trim();
  }
  
  return 'اتفاقية عدم إفشاء خاصة بالمشروع';
}

/**
 * Calculate marketing commission (0.5% from platform fee)
 */
export function calculateMarketingCommission(amount: number): number {
  return Number((amount * 0.005).toFixed(2)); // 0.5%
}

/**
 * Calculate platform fees based on package type
 */
export function calculatePlatformFees(
  amount: number,
  packageType: 'basic' | 'bithrah_plus'
): {
  platformFee: number;
  platformFeePercentage: number;
  partnershipPercentage: number;
  marketingCommission: number;
  netToCreator: number;
} {
  const marketingCommission = calculateMarketingCommission(amount);
  
  if (packageType === 'basic') {
    const platformFee = Number((amount * 0.065).toFixed(2)); // 6.5%
    const netPlatformFee = platformFee - marketingCommission; // 6% after marketing commission
    
    return {
      platformFee: netPlatformFee,
      platformFeePercentage: 6.0,
      partnershipPercentage: 0,
      marketingCommission,
      netToCreator: amount - platformFee,
    };
  } else {
    // Bithrah Plus: 3% + 2% partnership
    const platformFee = Number((amount * 0.03).toFixed(2)); // 3%
    const netPlatformFee = platformFee - marketingCommission; // 2.5% after marketing commission
    
    return {
      platformFee: netPlatformFee,
      platformFeePercentage: 2.5,
      partnershipPercentage: 2.0,
      marketingCommission,
      netToCreator: amount - platformFee,
    };
  }
}

/**
 * Check if funding period has expired (60 days default)
 */
export function isFundingExpired(project: any): boolean {
  if (!project.fundingEndDate) return false;
  return new Date() > new Date(project.fundingEndDate);
}

/**
 * Check if project reached funding goal
 */
export function isFundingComplete(project: any): boolean {
  const current = Number(project.currentFunding || 0);
  const goal = Number(project.fundingGoal || 0);
  return current >= goal;
}

/**
 * Calculate refund amount (98% - 2% payment gateway fee)
 */
export function calculateRefundAmount(amount: number): number {
  const paymentGatewayFee = Number((amount * 0.02).toFixed(2)); // 2%
  return amount - paymentGatewayFee;
}

