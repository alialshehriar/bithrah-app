# خطة تنفيذ Demo Mode - منصة بذرة

## التاريخ: 20 أكتوبر 2025

---

## 🎯 الهدف
إلغاء نظام Sandbox تمامًا واستبداله بنظام Demo Mode رسمي يمثل النسخة التجريبية الكاملة للمستخدمين.

---

## 📋 المرحلة 1: إزالة Sandbox

### الملفات التي ستُحذف:
- ✅ `/app/api/admin/sandbox/route.ts`
- ✅ `/lib/sandbox/data.ts`
- ✅ `/lib/sandbox/comprehensive-data.ts`

### الملفات التي ستُعدّل (إزالة كود sandbox):
- ✅ `/app/admin/page.tsx`
- ✅ `/app/api/admin/communities/route.ts`
- ✅ `/app/api/admin/evaluations/route.ts`
- ✅ `/app/api/admin/projects/route.ts`
- ✅ `/app/api/admin/stats/route.ts`
- ✅ `/app/api/admin/users/route.ts`
- ✅ `/app/api/admin/wallets/route.ts`
- ✅ `/app/api/communities/[id]/route.ts`
- ✅ `/app/api/communities/route.ts`
- ✅ `/app/api/events/route.ts`
- ✅ `/app/api/leaderboard/route.ts`
- ✅ `/app/api/projects/[id]/route.ts`
- ✅ `/app/api/projects/route.ts`
- ✅ `/app/api/stats/platform/route.ts`

---

## 📋 المرحلة 2: تحديث قاعدة البيانات

### تحديثات جدول Users:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS demo_balance NUMERIC(12,2) DEFAULT 100000.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS demo_activated_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS walkthrough_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS walkthrough_step INTEGER DEFAULT 0;
```

### إنشاء جدول Demo Projects:
```sql
CREATE TABLE IF NOT EXISTS demo_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  funding_goal NUMERIC(12,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### إنشاء جدول Demo Communities:
```sql
CREATE TABLE IF NOT EXISTS demo_communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  members_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### إنشاء جدول Demo Events:
```sql
CREATE TABLE IF NOT EXISTS demo_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📋 المرحلة 3: إنشاء محتوى Demo

### 1. مشروع Demo رئيسي:
- **العنوان**: "مشروع تجريبي - اكتشف كيف تعمل بذرة"
- **الوصف**: شرح كامل للمنظومة (الدعم + التفاوض + التقييم + الاشتراكات)
- **الهدف التمويلي**: 500,000 ريال
- **التمويل الحالي**: 350,000 ريال
- **عدد الداعمين**: 127
- **الحالة**: نشط

### 2. مجتمع Demo:
- **الاسم**: "مجتمع بذرة التجريبي"
- **الوصف**: "تعرف على كيفية التفاعل مع المجتمعات"
- **عدد الأعضاء**: 1,234
- **المنشورات**: 5 منشورات تفاعلية
- **التعليقات**: 15 تعليق

### 3. فعالية Demo:
- **العنوان**: "ورشة عمل: كيف تطلق مشروعك على بذرة"
- **التاريخ**: بعد 7 أيام
- **المكان**: أونلاين
- **المسجلين**: 89

---

## 📋 المرحلة 4: تطوير Walkthrough

### الخطوات:
1. **الترحيب**: "مرحبًا بك في بذرة! 🌱"
2. **المشاريع**: "استكشف المشاريع ودعم الأفكار"
3. **المجتمعات**: "انضم للمجتمعات وتفاعل"
4. **التقييم**: "قيّم أفكارك بالذكاء الاصطناعي"
5. **المحفظة**: "إدارة رصيدك ومعاملاتك"
6. **الاشتراكات**: "اختر الباقة المناسبة لك"

### التخزين:
- حفظ `walkthrough_completed` في قاعدة البيانات
- حفظ `walkthrough_step` للمتابعة لاحقًا

---

## 📋 المرحلة 5: النصوص التوضيحية

### Banner رئيسي:
```
🎯 نسخة تجريبية كاملة - جرّب بذرة قبل الإطلاق الرسمي
جميع المعاملات افتراضية ولا تُخصم فعليًا
```

### في صفحة المحفظة:
```
💰 رصيدك التجريبي: 100,000 ريال
هذا رصيد افتراضي للتجربة فقط
```

### في صفحة الدفع:
```
✅ تمت العملية بنجاح (تجريبي)
تم خصم المبلغ من رصيدك التجريبي
```

---

## 🔧 الملفات الجديدة المطلوبة

### 1. `/lib/demo/config.ts`
- إعدادات Demo Mode
- الرصيد الافتراضي
- المحتوى التجريبي

### 2. `/lib/demo/data.ts`
- بيانات المشروع التجريبي
- بيانات المجتمع التجريبي
- بيانات الفعالية التجريبية

### 3. `/lib/demo/wallet.ts`
- إدارة المحفظة التجريبية
- معالجة المعاملات
- استرداد الرصيد

### 4. `/components/DemoWalkthrough.tsx`
- مكون الجولة التعريفية
- خطوات التوجيه
- حفظ التقدم

### 5. `/components/DemoBanner.tsx` (تحديث)
- تحديث النص والتصميم
- إضافة رابط للمساعدة

---

## ✅ معايير الإنجاز

- [ ] إزالة جميع أكواد Sandbox
- [ ] تحديث قاعدة البيانات
- [ ] إنشاء محتوى Demo كامل
- [ ] تطوير Walkthrough
- [ ] إضافة النصوص التوضيحية
- [ ] اختبار شامل
- [ ] النشر على GitHub
- [ ] النشر على Vercel

---

**آخر تحديث**: 20 أكتوبر 2025 - 09:20 GMT+3

