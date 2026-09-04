# موکیوب | استودیو خلاق

سایت فارسی و RTL استودیو خلاق موکیوب — ساخته‌شده با Next.js و MongoDB.

## پیش‌نیازها

- Node.js 20+
- MongoDB محلی یا Atlas

## راه‌اندازی

```bash
npm install
cp .env.example .env.local
# مقدار MONGODB_URI و AUTH_SECRET را تنظیم کنید
npm run seed
npm run create-admin -- --username admin --password 'رمز-حداقل-۸-کاراکتری'
npm run dev
```

سایت روی [http://localhost:3000](http://localhost:3000)، پنل مدیریت روی [http://localhost:3000/admin](http://localhost:3000/admin) و موکلندر روی [http://localhost:3000/calendar](http://localhost:3000/calendar).

### متغیرهای محیطی

| متغیر | توضیح |
|--------|--------|
| `MONGODB_URI` | آدرس اتصال MongoDB |
| `AUTH_SECRET` | کلید امضای نشست‌های Auth.js — با `openssl rand -base64 32` بسازید |
| `OPENAI_API_KEY` | کلید OpenAI برای ایده‌های موکلندر |
| `OPENAI_MODEL` | مدل؛ پیش‌فرض `gpt-4o-mini` |
| `OPENAI_BASE_URL` | آدرس API؛ برای پروکسی سازگار با OpenAI |

## اسکریپت‌ها

| دستور | توضیح |
|--------|--------|
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد تولید |
| `npm run start` | اجرای بیلد |
| `npm run seed` | پر کردن MongoDB با دادهٔ نمونه |
| `npm run seed-occasions` | افزودن کاتالوگ مناسبت‌های موکلندر (بدون پاک‌کردن) |
| `npm run verify-jalali` | تطبیق تقویم شمسی با ICU |
| `npm run create-admin` | ساخت یا تغییر رمز کاربر ادمین |
| `npm run lint` | بررسی Biome |

## محتوا

اشیاء در MongoDB:

- `services` — سرویس‌ها و سه پلن قیمتی
- `microServices` — میکروسرویس‌ها (متعلق به یک سرویس، اسلاگ یکتا)
- `customers` — مشتریان
- `projects` — پروژه‌ها با `serviceIds`، `microServiceIds` و `galleries` (هر گالری: `urls`، `microServiceIds`، `description?`)
- `siteSettings` — تلفن، اینستاگرام، تلگرام، بنر
- `users` — کاربران (`username`، `passwordHash`، `role`: admin یا business)
- `businesses` — حساب‌های موکلندر
- `occasions` — مناسبت‌های کاتالوگ
- `calendarEntries` — برنامهٔ روز و سفارش طراحی

ویرایش محتوا از طریق پنل مدیریت در `/admin` انجام می‌شود.

## صفحات

- `/` — خانه
- `/services` و `/services/[slug]` — سرویس‌ها
- `/microservices` و `/microservices/[slug]` — میکروسرویس‌ها و گالری‌های مرتبط
- `/projects` و `/projects/[slug]` — پروژه‌ها (فیلتر `?service=`، `?micro=` و `?customer=`)
- `/customers` و `/customers/[slug]` — مشتریان
- `/contact` — تماس
- `/admin` — پنل مدیریت (نیازمند ورود) و `/admin/login` — ورود
- `/calendar` — موکلندر؛ `/calendar/signup` ثبت‌نام، `/calendar/login` ورود
