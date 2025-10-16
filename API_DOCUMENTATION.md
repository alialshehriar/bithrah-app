# توثيق APIs - منصة بذرة
## نظام الوساطة الذكية المتكامل

---

## 🎯 نظرة عامة

منصة بذرة هي منصة وساطة ذكية (وليست تمويل جماعي) تربط بين:
1. **أصحاب الأفكار** - يعرضون أفكارهم ومشاريعهم
2. **الداعمون** - يدعمون المشاريع ويحصلون على باقات (منتجات/خدمات)
3. **المستثمرون** - يتفاوضون ويشاركون في النجاح
4. **المسوقون** - ينشرون الروابط ويحصلون على عمولة 0.5%

---

## 🔒 نظام حماية الملكية الفكرية (3 مستويات)

### المستوى 1: الزائر (Public)
**من:** غير مسجل في المنصة  
**يرى:**
- عنوان المشروع
- وصف مختصر جداً (`publicDescription`)
- الصورة الرئيسية
- المبلغ المطلوب
- المبلغ المحصّل
- عدد الداعمين
- الوقت المتبقي

### المستوى 2: المستخدم المسجل (Registered)
**من:** مسجل + وقّع اتفاقية عدم الإفشاء (NDA)  
**يرى:** كل ما في المستوى 1 +
- وصف تفصيلي (`registeredDescription`)
- الباقات والمكافآت
- خطة العمل العامة
- معلومات الفريق
- الأسئلة الشائعة
- التحديثات

### المستوى 3: المفاوض (Negotiator)
**من:** فتح بوابة التفاوض + دفع مبلغ الجدية  
**يرى:** كل ما في المستوى 2 +
- الوصف الكامل (`fullDescription`)
- المستندات السرية (`confidentialDocs`)
- الدراسات المالية التفصيلية
- خطة العمل الكاملة
- جميع التفاصيل الدقيقة

---

## 📡 APIs الرئيسية

### 1. اتفاقية عدم الإفشاء (NDA)

#### 1.1 الحصول على نص الاتفاقية
```http
GET /api/nda/text?type=platform
```

**Response:**
```json
{
  "success": true,
  "text": "# اتفاقية عدم الإفشاء...",
  "version": "1.0",
  "type": "platform"
}
```

#### 1.2 توقيع الاتفاقية
```http
POST /api/nda/sign
Content-Type: application/json

{
  "agreementType": "platform",
  "projectId": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم توقيع اتفاقية عدم الإفشاء بنجاح",
  "agreement": {
    "id": 1,
    "userId": 123,
    "agreementType": "platform",
    "signedAt": "2025-10-16T10:00:00Z",
    "status": "active"
  }
}
```

#### 1.3 عرض الاتفاقيات الموقعة
```http
GET /api/nda/sign
```

**Response:**
```json
{
  "success": true,
  "agreements": [...]
}
```

---

### 2. عرض المشاريع حسب مستوى الوصول

#### 2.1 عرض مشروع واحد
```http
GET /api/projects/[id]/view
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": 1,
    "title": "تطبيق توصيل طعام صحي",
    "publicDescription": "تطبيق مبتكر...",
    "registeredDescription": "...", // إذا كان مسجلاً
    "fullDescription": "...", // إذا كان مفاوضاً
    "fundingGoal": "100000.00",
    "currentFunding": "25000.00",
    "backersCount": 50
  },
  "accessLevel": "registered",
  "needsNDA": false,
  "canNegotiate": true
}
```

**Access Levels:**
- `public` - زائر غير مسجل
- `registered` - مستخدم مسجل ووقّع NDA
- `negotiator` - فتح بوابة التفاوض

---

### 3. نظام التفاوض

#### 3.1 فتح بوابة التفاوض
```http
POST /api/negotiations/open
Content-Type: application/json

{
  "projectId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء طلب التفاوض بنجاح",
  "negotiation": {
    "id": 10,
    "projectId": 1,
    "investorId": 123,
    "depositAmount": "1000.00",
    "status": "pending",
    "endDate": "2025-10-19T10:00:00Z"
  },
  "depositAmount": "1000.00",
  "paymentRequired": true,
  "expiresIn": "3 أيام"
}
```

#### 3.2 تأكيد دفع مبلغ الجدية
```http
PUT /api/negotiations/open
Content-Type: application/json

{
  "negotiationId": 10,
  "paymentConfirmed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تفعيل التفاوض بنجاح. يمكنك الآن الوصول إلى جميع التفاصيل السرية",
  "hasFullAccess": true
}
```

---

### 4. نظام الدعم والباقات

#### 4.1 دعم مشروع (اختيار باقة)
```http
POST /api/projects/[id]/back
Content-Type: application/json

{
  "packageId": "silver",
  "amount": 500,
  "referrerCode": "ABC123" // اختياري - كود المسوق
}
```

**Response:**
```json
{
  "success": true,
  "backing": {
    "id": 50,
    "projectId": 1,
    "userId": 123,
    "amount": "500.00",
    "packageId": "silver",
    "referrerId": 456, // إذا كان هناك مسوق
    "marketingCommission": "2.50", // 0.5% للمسوق
    "status": "pending"
  },
  "paymentRequired": true
}
```

---

### 5. نظام التسويق بالعمولة

#### 5.1 الحصول على رابط الإحالة
```http
GET /api/user/referral-link?projectId=1
```

**Response:**
```json
{
  "success": true,
  "referralCode": "ABC123",
  "referralLink": "https://bithrahapp.com/projects/1?ref=ABC123",
  "commission": "0.5%"
}
```

#### 5.2 إحصائيات المسوق
```http
GET /api/marketing/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalReferrals": 25,
    "totalCommissions": "1250.00",
    "pendingCommissions": "500.00",
    "paidCommissions": "750.00",
    "topProjects": [...]
  }
}
```

---

## 💰 نظام العمولات والرسوم

### باقة Basic (6.5%)

```javascript
// مثال: مشروع جمع 100,000 ريال
const amount = 100000;
const platformFee = amount * 0.065; // 6,500 ريال (6.5%)
const marketingCommission = amount * 0.005; // 500 ريال (0.5%)
const netPlatformFee = platformFee - marketingCommission; // 6,000 ريال (6%)
const creatorReceives = amount - platformFee; // 93,500 ريال (93.5%)
```

**التوزيع:**
- صاحب المشروع: 93,500 ريال (93.5%)
- المنصة: 6,000 ريال (6%)
- المسوقون: 500 ريال (0.5%)

### باقة Bithrah Plus (3% + 2% شراكة)

```javascript
// مثال: مشروع جمع 100,000 ريال
const amount = 100000;
const platformFee = amount * 0.03; // 3,000 ريال (3%)
const marketingCommission = amount * 0.005; // 500 ريال (0.5%)
const netPlatformFee = platformFee - marketingCommission; // 2,500 ريال (2.5%)
const partnershipShare = 0.02; // 2% من أرباح المشروع مستقبلاً
const creatorReceives = amount - platformFee; // 97,000 ريال (97%)
```

**التوزيع:**
- صاحب المشروع: 97,000 ريال (97%)
- المنصة (عمولة): 2,500 ريال (2.5%)
- المنصة (شراكة): 2% من الأرباح المستقبلية
- المسوقون: 500 ريال (0.5%)

---

## ⏱️ نظام الصندوق الزمني (60 يوم)

### القواعد:
1. **المدة الافتراضية:** 60 يوم من تاريخ النشر
2. **عند النجاح:** تحويل الأموال لصاحب المشروع
3. **عند الفشل:** استرداد 98% للداعمين (خصم 2% عمولة بوابة الدفع)

### API للتحقق من حالة الصندوق
```http
GET /api/projects/[id]/funding-status
```

**Response:**
```json
{
  "success": true,
  "status": "active",
  "fundingGoal": "100000.00",
  "currentFunding": "75000.00",
  "progress": 75,
  "backersCount": 150,
  "daysRemaining": 25,
  "fundingEndDate": "2025-11-15T23:59:59Z",
  "isExpired": false,
  "isComplete": false
}
```

### حساب الاسترداد عند الفشل
```javascript
// مثال: داعم دفع 1,000 ريال
const amount = 1000;
const paymentGatewayFee = amount * 0.02; // 20 ريال (2%)
const refundAmount = amount - paymentGatewayFee; // 980 ريال (98%)
```

---

## 🔐 المصادقة والأمان

### Headers المطلوبة
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### الحصول على Session
```javascript
import { getSession } from '@/lib/auth';

const session = await getSession();
if (!session?.user?.id) {
  // غير مصرح
}
```

---

## 📊 سجل الوصول (Access Logs)

يتم تسجيل كل وصول للمشاريع في جدول `project_access_logs`:

```javascript
{
  projectId: 1,
  userId: 123, // null للزوار
  accessLevel: 'registered',
  accessType: 'view',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  createdAt: '2025-10-16T10:00:00Z'
}
```

---

## 🎯 أمثلة الاستخدام

### مثال 1: رحلة الزائر → المستخدم المسجل

```javascript
// 1. الزائر يشاهد المشروع (وصول عام)
const response1 = await fetch('/api/projects/1/view');
// accessLevel: 'public'
// يرى: وصف مختصر فقط

// 2. يسجل حساب جديد
await fetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email, password, name })
});

// 3. يوقع على اتفاقية عدم الإفشاء
await fetch('/api/nda/sign', {
  method: 'POST',
  body: JSON.stringify({ agreementType: 'platform' })
});

// 4. يشاهد المشروع مرة أخرى (وصول مسجل)
const response2 = await fetch('/api/projects/1/view');
// accessLevel: 'registered'
// يرى: وصف تفصيلي + باقات + فريق
```

### مثال 2: فتح بوابة التفاوض

```javascript
// 1. طلب فتح التفاوض
const response1 = await fetch('/api/negotiations/open', {
  method: 'POST',
  body: JSON.stringify({ projectId: 1 })
});
// يحصل على: negotiationId, depositAmount

// 2. دفع مبلغ الجدية (عبر بوابة الدفع)
// ... payment gateway integration ...

// 3. تأكيد الدفع
const response2 = await fetch('/api/negotiations/open', {
  method: 'PUT',
  body: JSON.stringify({
    negotiationId: 10,
    paymentConfirmed: true
  })
});
// hasFullAccess: true

// 4. الآن يمكن الوصول لكل التفاصيل
const response3 = await fetch('/api/projects/1/view');
// accessLevel: 'negotiator'
// يرى: كل التفاصيل السرية
```

### مثال 3: التسويق بالعمولة

```javascript
// 1. المسوق يحصل على رابط الإحالة
const response1 = await fetch('/api/user/referral-link?projectId=1');
const { referralLink } = await response1.json();
// referralLink: "https://bithrahapp.com/projects/1?ref=ABC123"

// 2. المسوق ينشر الرابط

// 3. داعم يدخل عبر الرابط ويدعم المشروع
await fetch('/api/projects/1/back', {
  method: 'POST',
  body: JSON.stringify({
    packageId: 'gold',
    amount: 2000,
    referrerCode: 'ABC123'
  })
});

// 4. المسوق يحصل على عمولة 0.5%
// amount: 2000 SAR
// commission: 10 SAR (0.5%)
```

---

## ✅ الخلاصة

منصة بذرة توفر نظام وساطة ذكية متكامل مع:

1. ✅ **حماية الملكية الفكرية** (3 مستويات وصول)
2. ✅ **اتفاقيات عدم الإفشاء** (NDA)
3. ✅ **نظام التفاوض** (مبلغ جدية + 3 أيام)
4. ✅ **التسويق بالعمولة** (0.5%)
5. ✅ **الصندوق الزمني** (60 يوم + استرداد 98%)
6. ✅ **باقات المنصة** (Basic 6.5% / Bithrah Plus 3%+2%)

---

**تاريخ التحديث:** 16 أكتوبر 2025  
**الإصدار:** 2.0

