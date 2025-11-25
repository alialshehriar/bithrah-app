import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailOptions {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail(options: SendVerificationEmailOptions) {
  try {
    const { to, name, verificationUrl } = options;

    const { data, error } = await resend.emails.send({
      from: 'بذرة Bithrah <info@bithrahapp.com>',
      to: [to],
      subject: 'تأكيد البريد الإلكتروني - منصة بذرة',
      html: generateVerificationEmailHTML(name, verificationUrl),
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    console.log('Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

function generateVerificationEmailHTML(name: string, verificationUrl: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد البريد الإلكتروني</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">مرحباً بك في بذرة! 🌱</h1>
              <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 14px;">بيئة الوساطة الذكية الأولى في السعودية</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-center;">
                  <span style="font-size: 40px;">✉️</span>
                </div>
                <h2 style="color: #1F2937; margin: 0 0 10px 0; font-size: 24px;">تأكيد البريد الإلكتروني</h2>
              </div>
              
              <div style="background-color: #F3F4F6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <p style="color: #1F2937; margin: 0 0 15px 0; font-size: 16px;">عزيزي/عزيزتي <strong>${name}</strong>،</p>
                <p style="color: #4B5563; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                  شكراً لتسجيلك في منصة بذرة! نحن متحمسون لوجودك معنا في رحلة دعم المشاريع الإبداعية.
                </p>
                <p style="color: #4B5563; margin: 0; font-size: 14px; line-height: 1.6;">
                  للبدء، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
                </p>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  تأكيد البريد الإلكتروني
                </a>
              </div>
              
              <div style="background-color: #FEF3C7; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="color: #92400E; margin: 0; font-size: 13px; line-height: 1.6;">
                  <strong>⚠️ ملاحظة:</strong> إذا لم تقم بإنشاء حساب على منصة بذرة، يرجى تجاهل هذا البريد الإلكتروني.
                </p>
              </div>
              
              <div style="background-color: #DBEAFE; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <p style="color: #1E40AF; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
                  🎁 مكافأة التسجيل المبكر
                </p>
                <p style="color: #1E40AF; margin: 0; font-size: 13px; line-height: 1.6;">
                  كونك من المستخدمين الأوائل، حصلت على <strong>اشتراك مستثمر مجاني لمدة سنة كاملة</strong>! استمتع بجميع المزايا الحصرية.
                </p>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; margin: 0 0 15px 0; font-size: 14px;">هل لديك أي استفسارات؟</p>
                <a href="mailto:info@bithrahapp.com" style="color: #a855f7; text-decoration: none; font-weight: bold; font-size: 14px;">info@bithrahapp.com</a>
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
                <a href="https://bithrahapp.com" style="color: #a855f7; text-decoration: none;">bithrahapp.com</a>
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

interface SendWelcomeEmailOptions {
  to: string;
  name: string;
  referralCode: string;
}

export async function sendWelcomeEmail(options: SendWelcomeEmailOptions) {
  try {
    const { to, name, referralCode } = options;

    const { data, error } = await resend.emails.send({
      from: 'بذرة Bithrah <info@bithrahapp.com>',
      to: [to],
      subject: 'مرحباً بك في بذرة! 🌱',
      html: generateWelcomeEmailHTML(name, referralCode),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

function generateWelcomeEmailHTML(name: string, referralCode: string): string {
  const referralUrl = `https://bithrahapp.com?ref=${referralCode}`;
  
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك في بذرة</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">🎉 أهلاً بك في بذرة!</h1>
              <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px;">رحلتك نحو دعم المشاريع الإبداعية تبدأ الآن</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; margin: 0 0 20px 0; font-size: 18px;">عزيزي/عزيزتي <strong>${name}</strong>،</p>
              
              <p style="color: #4B5563; margin: 0 0 20px 0; font-size: 15px; line-height: 1.8;">
                نرحب بك في <strong>منصة بذرة</strong> - بيئة الوساطة الذكية الأولى في السعودية لدعم المشاريع الإبداعية والمبتكرة! 🚀
              </p>
              
              <!-- Investor Subscription -->
              <div style="background: linear-gradient(135deg, #DBEAFE 0%, #E9D5FF 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 2px solid #a855f7;">
                <div style="text-align: center; margin-bottom: 15px;">
                  <span style="font-size: 48px;">👑</span>
                </div>
                <h3 style="color: #7C3AED; margin: 0 0 15px 0; font-size: 20px; text-align: center;">مكافأة التسجيل المبكر</h3>
                <p style="color: #5B21B6; margin: 0; font-size: 15px; line-height: 1.6; text-align: center;">
                  تهانينا! حصلت على <strong>اشتراك مستثمر مجاني لمدة سنة كاملة</strong> بقيمة 1,200 ريال! 🎁
                </p>
              </div>
              
              <!-- Referral Code -->
              <div style="background-color: #F3F4F6; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 18px;">🔗 كود الإحالة الخاص بك</h3>
                <div style="background-color: #ffffff; border: 2px dashed #a855f7; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 15px;">
                  <code style="font-size: 24px; font-weight: bold; color: #a855f7; letter-spacing: 2px;">${referralCode}</code>
                </div>
                <p style="color: #4B5563; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                  شارك هذا الكود مع أصدقائك واحصل على <strong>سنة إضافية مجانية</strong> لكل شخص يسجل عن طريقك! 🎯
                </p>
                <div style="text-align: center;">
                  <a href="${referralUrl}" style="display: inline-block; background-color: #a855f7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    نسخ رابط الإحالة
                  </a>
                </div>
              </div>
              
              <!-- What's Next -->
              <div style="background-color: #ECFDF5; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px;">✨ ماذا بعد؟</h3>
                <ul style="color: #065F46; margin: 0; padding: 0 0 0 20px; font-size: 14px; line-height: 1.8;">
                  <li>استكشف المشاريع الإبداعية وادعم ما يعجبك</li>
                  <li>أنشئ مشروعك الخاص واحصل على الدعم</li>
                  <li>انضم إلى المجتمعات وتواصل مع المبدعين</li>
                  <li>استخدم بوابة التفاوض للحصول على أفضل العروض</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://bithrahapp.com/home" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  ابدأ الاستكشاف الآن
                </a>
              </div>
              
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; margin: 0 0 15px 0; font-size: 14px;">هل لديك أي استفسارات؟</p>
                <a href="mailto:info@bithrahapp.com" style="color: #a855f7; text-decoration: none; font-weight: bold; font-size: 14px;">info@bithrahapp.com</a>
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
                <a href="https://bithrahapp.com" style="color: #a855f7; text-decoration: none;">bithrahapp.com</a>
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
