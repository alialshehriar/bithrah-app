import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

interface NDAData {
  agreementId: number;
  fullName: string;
  email: string;
  phone: string;
  signatureData: string;
  agreementText: string;
  agreementVersion: string;
  signedAt: Date;
  ipAddress: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

export async function generateNDAPDF(data: NDAData): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create PDFs directory if it doesn't exist
      const pdfDir = path.join(process.cwd(), 'public', 'pdfs', 'nda');
      await mkdir(pdfDir, { recursive: true });

      // Generate unique filename
      const filename = `NDA-${data.agreementId}-${Date.now()}.pdf`;
      const filepath = path.join(pdfDir, filename);
      const publicPath = `/pdfs/nda/${filename}`;

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: 'اتفاقية عدم الإفشاء والسرية - منصة بذرة',
          Author: 'bithrahapp.com',
          Subject: 'Non-Disclosure Agreement',
          Keywords: 'NDA, Confidentiality, Bithrah',
        },
      });

      // Pipe to file
      const stream = createWriteStream(filepath);
      doc.pipe(stream);

      // Add content
      await addPDFContent(doc, data);

      // Finalize PDF
      doc.end();

      // Wait for stream to finish
      stream.on('finish', () => {
        resolve(publicPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function addPDFContent(doc: PDFKit.PDFDocument, data: NDAData) {
  // Header with logo placeholder
  doc
    .fontSize(24)
    .fillColor('#6B46C1')
    .text('منصة بذرة', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(20)
    .fillColor('#1F2937')
    .text('اتفاقية عدم الإفشاء والسرية', { align: 'center' })
    .moveDown(0.3);

  doc
    .fontSize(10)
    .fillColor('#6B7280')
    .text(`الإصدار: ${data.agreementVersion}`, { align: 'center' })
    .moveDown(2);

  // Agreement content
  doc
    .fontSize(12)
    .fillColor('#1F2937')
    .text(data.agreementText, {
      align: 'right',
      lineGap: 5,
    })
    .moveDown(2);

  // Signature section
  doc
    .fontSize(14)
    .fillColor('#6B46C1')
    .text('معلومات الموقع', { align: 'right' })
    .moveDown(1);

  // Create a box for signature details
  const boxY = doc.y;
  doc
    .rect(50, boxY, doc.page.width - 100, 150)
    .fillAndStroke('#F3F4F6', '#E5E7EB');

  doc
    .fillColor('#1F2937')
    .fontSize(11)
    .text(`الاسم الكامل: ${data.fullName}`, 70, boxY + 20, { align: 'right' })
    .text(`البريد الإلكتروني: ${data.email}`, 70, boxY + 45, { align: 'right' })
    .text(`رقم الجوال: ${data.phone}`, 70, boxY + 70, { align: 'right' })
    .text(`التوقيع الإلكتروني: ${data.signatureData}`, 70, boxY + 95, {
      align: 'right',
    })
    .text(
      `تاريخ التوقيع: ${new Date(data.signedAt).toLocaleString('ar-SA')}`,
      70,
      boxY + 120,
      { align: 'right' }
    );

  doc.moveDown(10);

  // Technical details section
  doc
    .fontSize(14)
    .fillColor('#6B46C1')
    .text('التفاصيل التقنية', { align: 'right' })
    .moveDown(1);

  const techBoxY = doc.y;
  doc
    .rect(50, techBoxY, doc.page.width - 100, 100)
    .fillAndStroke('#F3F4F6', '#E5E7EB');

  doc
    .fillColor('#1F2937')
    .fontSize(10)
    .text(`عنوان IP: ${data.ipAddress}`, 70, techBoxY + 15, { align: 'right' })
    .text(`نوع الجهاز: ${data.deviceType || 'غير محدد'}`, 70, techBoxY + 35, {
      align: 'right',
    })
    .text(`المتصفح: ${data.browser || 'غير محدد'}`, 70, techBoxY + 55, {
      align: 'right',
    })
    .text(`نظام التشغيل: ${data.os || 'غير محدد'}`, 70, techBoxY + 75, {
      align: 'right',
    });

  // Footer
  doc
    .fontSize(8)
    .fillColor('#9CA3AF')
    .text(
      'هذه الوثيقة موقعة إلكترونيًا ومحمية بموجب قوانين المملكة العربية السعودية',
      50,
      doc.page.height - 80,
      { align: 'center' }
    )
    .text(`رقم الاتفاقية: ${data.agreementId}`, { align: 'center' })
    .text('bithrahapp.com', { align: 'center', link: 'https://bithrahapp.com' });
}

export async function generateNDAPDFBuffer(data: NDAData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const buffers: Buffer[] = [];

    doc.on('data', (buffer) => buffers.push(buffer));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    addPDFContent(doc, data);
    doc.end();
  });
}

