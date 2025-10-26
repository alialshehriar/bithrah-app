import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendNDAEmailOptions {
  to: string[];
  fullName: string;
  agreementId: number;
  pdfBuffer?: Buffer;
  pdfUrl?: string;
}

export async function sendNDAEmail(options: SendNDAEmailOptions) {
  try {
    const { to, fullName, agreementId, pdfBuffer, pdfUrl } = options;

    const mailOptions = {
      from: {
        name: 'منصة بذرة',
        address: process.env.SMTP_FROM || 'info@bithrahapp.com',
      },
      to: to.join(', '),
      subject: 'اتفاقية عدم الإفشاء والسرية - منصة بذرة',
      html: generateEmailHTML(fullName, agreementId, pdfUrl),
      attachments: pdfBuffer
        ? [
            {
              filename: `NDA-Agreement-${agreementId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

function generateEmailHTML(fullName: string, agreementId: number, pdfUrl?: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اتفاقية عدم الإفشاء والسرية</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">منصة بذرة</h1>
              <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 14px;">بيئة الوساطة الذكية الأولى في السعودية</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-center;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h2 style="color: #1F2937; margin: 0 0 10px 0; font-size: 24px;">تم توقيع الاتفاقية بنجاح</h2>
                <p style="color: #6B7280; margin: 0; font-size: 16px;">اتفاقية عدم الإفشاء والسرية</p>
              </div>
              
              <div style="background-color: #F3F4F6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <p style="color: #1F2937; margin: 0 0 15px 0; font-size: 16px;">عزيزي/عزيزتي <strong>${fullName}</strong>،</p>
                <p style="color: #4B5563; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                  نشكرك على توقيع اتفاقية عدم الإفشاء والسرية الخاصة بمنصة بذرة. نحن ملتزمون بحماية حقوقك الفكرية والقانونية على أعلى مستوى.
                </p>
                <p style="color: #4B5563; margin: 0; font-size: 14px; line-height: 1.6;">
                  تجد مرفقًا نسخة PDF من الاتفاقية الموقعة للرجوع إليها في أي وقت.
                </p>
              </div>
              
              <div style="background-color: #EEF2FF; border-right: 4px solid #6B46C1; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6B7280; font-size: 14px; text-align: right;">رقم الاتفاقية:</td>
                    <td style="color: #1F2937; font-size: 14px; font-weight: bold; text-align: left;">#${agreementId}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-size: 14px; text-align: right;">تاريخ التوقيع:</td>
                    <td style="color: #1F2937; font-size: 14px; font-weight: bold; text-align: left;">${new Date().toLocaleString('ar-SA')}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-size: 14px; text-align: right;">الحالة:</td>
                    <td style="color: #059669; font-size: 14px; font-weight: bold; text-align: left;">✓ نشطة</td>
                  </tr>
                </table>
              </div>
              
              ${pdfUrl ? `
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://bithrahapp.com${pdfUrl}" style="display: inline-block; background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  تحميل نسخة PDF
                </a>
              </div>
              ` : ''}
              
              <div style="background-color: #FEF3C7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="color: #92400E; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>⚠️ تنبيه مهم:</strong> هذه الاتفاقية ملزمة قانونيًا وفقًا لأنظمة المملكة العربية السعودية. يرجى الاحتفاظ بنسخة من هذا البريد الإلكتروني والملف المرفق للرجوع إليها.
                </p>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; margin: 0 0 15px 0; font-size: 14px;">هل لديك أي استفسارات؟</p>
                <a href="mailto:info@bithrahapp.com" style="color: #6B46C1; text-decoration: none; font-weight: bold; font-size: 14px;">info@bithrahapp.com</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #9CA3AF; margin: 0 0 10px 0; font-size: 12px;">
                © 2025 منصة بذرة. جميع الحقوق محفوظة.
              </p>
              <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
                <a href="https://bithrahapp.com" style="color: #6B46C1; text-decoration: none;">bithrahapp.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

interface SendOTPEmailOptions {
  to: string;
  fullName: string;
  otp: string;
}

export async function sendOTPEmail(options: SendOTPEmailOptions) {
  try {
    const { to, fullName, otp } = options;

    const mailOptions = {
      from: {
        name: 'منصة بذرة',
        address: process.env.SMTP_FROM || 'info@bithrahapp.com',
      },
      to,
      subject: 'رمز التحقق - منصة بذرة',
      html: generateOTPEmailHTML(fullName, otp),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
}

function generateOTPEmailHTML(fullName: string, otp: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>رمز التحقق</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">رمز التحقق</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="color: #1F2937; margin: 0 0 20px 0; font-size: 16px;">عزيزي/عزيزتي <strong>${fullName}</strong>،</p>
              <p style="color: #6B7280; margin: 0 0 30px 0; font-size: 14px;">استخدم الرمز التالي للتحقق من هويتك:</p>
              
              <div style="background: linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <div style="font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #6B7280; margin: 0 0 10px 0; font-size: 14px;">الرمز صالح لمدة <strong>10 دقائق</strong></p>
              <p style="color: #EF4444; margin: 0; font-size: 13px;">⚠️ لا تشارك هذا الرمز مع أي شخص</p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #9CA3AF; margin: 0; font-size: 12px;">© 2025 منصة بذرة</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

