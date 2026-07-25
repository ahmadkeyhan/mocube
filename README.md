# موکیوب | استودیو خلاق

سایت فارسی و RTL استودیو خلاق موکیوب — ساخته‌شده با Next.js و MongoDB.

## پیش‌نیازها

- Node.js 20+
- MongoDB محلی یا Atlas

## راه‌اندازی

```bash
npm install
cp .env.example .env.local
# مقدار MONGODB_URI را تنظیم کنید
npm run seed
npm run dev
```

سایت روی [http://localhost:3000](http://localhost:3000) در دسترس است.

## اسکریپت‌ها

| دستور | توضیح |
|--------|--------|
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد تولید |
| `npm run start` | اجرای بیلد |
| `npm run seed` | پر کردن MongoDB با دادهٔ نمونه |
| `npm run lint` | بررسی Biome |

## محتوا

اشیاء در MongoDB:

- `services` — خدمات و سه پلن قیمتی
- `microServices` — میکروسرویس‌ها (متعلق به یک خدمت، اسلاگ یکتا)
- `customers` — مشتریان
- `projects` — پروژه‌ها با `serviceIds`، `microServiceIds` و `galleries` (هر گالری: `urls`، `microServiceIds`، `description?`)
- `siteSettings` — تلفن، اینستاگرام، تلگرام، بنر

ویرایش محتوا از طریق MongoDB Compass یا Atlas (بدون پنل ادمین در نسخهٔ فعلی).

## صفحات

- `/` — خانه
- `/services` و `/services/[slug]` — خدمات
- `/microservices` و `/microservices/[slug]` — نمونه‌کارها (میکروسرویس‌ها و گالری‌های مرتبط)
- `/projects` و `/projects/[slug]` — پروژه‌ها (فیلتر `?service=`، `?micro=` و `?customer=`)
- `/customers` و `/customers/[slug]` — مشتریان
- `/contact` — تماس
