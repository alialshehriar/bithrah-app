'use server';

import { db } from '@/lib/db';
import { ndaAgreements, ndaOtpVerifications, ndaTemplates } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NDA_CONTENT_AR, NDA_VERSION, NDA_TITLE_AR } from '@/lib/nda-content';
import crypto from 'crypto';
import { generateNDAPDF, generateNDAPDFBuffer } from '@/lib/pdf-generator';
import { sendNDAEmail, sendOTPEmail } from '@/lib/email-service';

// Helper to get client info
function getClientInfo(headers: Headers) {
  const userAgent = headers.get('user-agent') || '';
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown';
  
  return {
    userAgent,
    ipAddress: ip,
    deviceType: userAgent.includes('Mobile') ? 'mobile' : userAgent.includes('Tablet') ? 'tablet' : 'desktop',
    browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other',
    os: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Linux') ? 'Linux' : userAgent.includes('Android') ? 'Android' : userAgent.includes('iOS') ? 'iOS' : 'Other',
  };
}

// Generate OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP for storage
function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Check if user has signed NDA
export async function checkNDAStatus(userId: number) {
  try {
    const agreement = await db
      .select()
      .from(ndaAgreements)
      .where(
        and(
          eq(ndaAgreements.userId, userId),
          eq(ndaAgreements.status, 'active'),
          eq(ndaAgreements.isValid, true),
          eq(ndaAgreements.otpVerified, true)
        )
      )
      .limit(1);

    return {
      hasSigned: agreement.length > 0,
      agreement: agreement[0] || null,
    };
  } catch (error) {
    console.error('Error checking NDA status:', error);
    return { hasSigned: false, agreement: null };
  }
}

// Get active NDA template
export async function getActiveNDATemplate() {
  try {
    const template = await db
      .select()
      .from(ndaTemplates)
      .where(and(eq(ndaTemplates.isActive, true), eq(ndaTemplates.isDefault, true)))
      .limit(1);

    if (template.length > 0) {
      return template[0];
    }

    // Return default content if no template found
    return {
      version: NDA_VERSION,
      title: NDA_TITLE_AR,
      contentArabic: NDA_CONTENT_AR,
      contentEnglish: null,
    };
  } catch (error) {
    console.error('Error getting NDA template:', error);
    return {
      version: NDA_VERSION,
      title: NDA_TITLE_AR,
      contentArabic: NDA_CONTENT_AR,
      contentEnglish: null,
    };
  }
}

// Create initial NDA agreement (before OTP verification)
export async function createNDAAgreement(data: {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  signatureType: string;
  signatureData: string;
}) {
  try {
    const headers = new Headers();
    const clientInfo = getClientInfo(headers);
    const template = await getActiveNDATemplate();

    const [agreement] = await db
      .insert(ndaAgreements)
      .values({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        agreementType: 'platform',
        agreementVersion: template.version || NDA_VERSION,
        agreementText: template.contentArabic || NDA_CONTENT_AR,
        signatureType: data.signatureType,
        signatureData: data.signatureData,
        otpVerified: false,
        ...clientInfo,
        status: 'active',
        isValid: false, // Will be set to true after OTP verification
      } as any)
      .returning();

    return { success: true, agreementId: agreement.id };
  } catch (error) {
    console.error('Error creating NDA agreement:', error);
    return { success: false, error: 'Failed to create NDA agreement' };
  }
}

// Send OTP for verification
export async function sendNDAOTP(data: {
  agreementId: number;
  userId: number;
  email: string;
  phone: string;
  method: 'email' | 'sms' | 'both';
}) {
  try {
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const headers = new Headers();
    const clientInfo = getClientInfo(headers);

    await db.insert(ndaOtpVerifications).values({
      ndaAgreementId: data.agreementId,
      userId: data.userId,
      email: data.email,
      phone: data.phone,
      otpCode: hashedOTP,
      otpMethod: data.method,
      otpPurpose: 'nda_verification',
      status: 'pending',
      expiresAt,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    } as any);

    // Send OTP via email
    if (data.method === 'email' || data.method === 'both') {
      await sendOTPEmail({
        to: data.email,
        fullName: '', // Will be filled from user data
        otp,
      });
    }

    // TODO: Send OTP via SMS if method is 'sms' or 'both'
    // For now, return the OTP for testing (remove in production)
    console.log('OTP for testing:', otp);

    return { success: true, otp }; // Remove otp in production
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Failed to send OTP' };
  }
}

// Verify OTP
export async function verifyNDAOTP(data: {
  agreementId: number;
  userId: number;
  otp: string;
}) {
  try {
    const hashedOTP = hashOTP(data.otp);

    // Find pending OTP verification
    const [verification] = await db
      .select()
      .from(ndaOtpVerifications)
      .where(
        and(
          eq(ndaOtpVerifications.ndaAgreementId, data.agreementId),
          eq(ndaOtpVerifications.userId, data.userId),
          eq(ndaOtpVerifications.status, 'pending')
        )
      )
      .orderBy(desc(ndaOtpVerifications.createdAt))
      .limit(1);

    if (!verification) {
      return { success: false, error: 'لم يتم العثور على رمز التحقق' };
    }

    // Check if expired
    if (new Date() > verification.expiresAt) {
      await db
        .update(ndaOtpVerifications)
        .set({ status: 'expired' } as any)
        .where(eq(ndaOtpVerifications.id, verification.id));
      return { success: false, error: 'انتهت صلاحية رمز التحقق' };
    }

    // Check if max attempts exceeded
    if (verification.attempts >= verification.maxAttempts) {
      await db
        .update(ndaOtpVerifications)
        .set({ status: 'failed' } as any)
        .where(eq(ndaOtpVerifications.id, verification.id));
      return { success: false, error: 'تم تجاوز الحد الأقصى لمحاولات التحقق' };
    }

    // Verify OTP
    if (verification.otpCode !== hashedOTP) {
      await db
        .update(ndaOtpVerifications)
        .set({ attempts: verification.attempts + 1 } as any)
        .where(eq(ndaOtpVerifications.id, verification.id));
      return { success: false, error: 'رمز التحقق غير صحيح' };
    }

    // Mark OTP as verified
    await db
      .update(ndaOtpVerifications)
      .set({
        status: 'verified',
        verifiedAt: new Date(),
      } as any)
      .where(eq(ndaOtpVerifications.id, verification.id));

    // Get agreement details
    const [agreement] = await db
      .select()
      .from(ndaAgreements)
      .where(eq(ndaAgreements.id, data.agreementId))
      .limit(1);

    if (!agreement) {
      return { success: false, error: 'لم يتم العثور على الاتفاقية' };
    }

    // Generate PDF
    let pdfUrl = '';
    try {
      pdfUrl = await generateNDAPDF({
        agreementId: agreement.id,
        fullName: agreement.fullName || '',
        email: agreement.email || '',
        phone: agreement.phone || '',
        signatureData: agreement.signatureData || '',
        agreementText: agreement.agreementText || '',
        agreementVersion: agreement.agreementVersion || '',
        signedAt: agreement.signedAt || new Date(),
        ipAddress: agreement.ipAddress || '',
        deviceType: agreement.deviceType || undefined,
        browser: agreement.browser || undefined,
        os: agreement.os || undefined,
      });

      // Generate PDF buffer for email
      const pdfBuffer = await generateNDAPDFBuffer({
        agreementId: agreement.id,
        fullName: agreement.fullName || '',
        email: agreement.email || '',
        phone: agreement.phone || '',
        signatureData: agreement.signatureData || '',
        agreementText: agreement.agreementText || '',
        agreementVersion: agreement.agreementVersion || '',
        signedAt: agreement.signedAt || new Date(),
        ipAddress: agreement.ipAddress || '',
        deviceType: agreement.deviceType || undefined,
        browser: agreement.browser || undefined,
        os: agreement.os || undefined,
      });

      // Send email with PDF
      const emailRecipients = [agreement.email || ''];
      if (process.env.NDA_CC_EMAIL) {
        emailRecipients.push(process.env.NDA_CC_EMAIL);
      }

      await sendNDAEmail({
        to: emailRecipients,
        fullName: agreement.fullName || '',
        agreementId: agreement.id,
        pdfBuffer,
        pdfUrl,
      });

      // Update NDA agreement with PDF info
      await db
        .update(ndaAgreements)
        .set({
          otpVerified: true,
          otpMethod: verification.otpMethod,
          otpVerifiedAt: new Date(),
          isValid: true,
          pdfGenerated: true,
          pdfUrl,
          pdfStoragePath: pdfUrl,
          pdfGeneratedAt: new Date(),
          emailSent: true,
          emailSentAt: new Date(),
          emailSentTo: emailRecipients,
          updatedAt: new Date(),
        } as any)
        .where(eq(ndaAgreements.id, data.agreementId));
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      // Still mark as verified even if PDF fails
      await db
        .update(ndaAgreements)
        .set({
          otpVerified: true,
          otpMethod: verification.otpMethod,
          otpVerifiedAt: new Date(),
          isValid: true,
          updatedAt: new Date(),
        } as any)
        .where(eq(ndaAgreements.id, data.agreementId));
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: 'فشل التحقق من الرمز' };
  }
}

// Get user's NDA agreements
export async function getUserNDAgreements(userId: number) {
  try {
    const agreements = await db
      .select()
      .from(ndaAgreements)
      .where(eq(ndaAgreements.userId, userId))
      .orderBy(desc(ndaAgreements.createdAt));

    return { success: true, agreements };
  } catch (error) {
    console.error('Error getting user NDA agreements:', error);
    return { success: false, error: 'Failed to get agreements' };
  }
}

