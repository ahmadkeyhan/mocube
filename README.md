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

- `services` — خدمات، میکروسرویس‌ها، سه پلن قیمتی
- `customers` — مشتریان
- `projects` — پروژه‌ها (لینک به مشتری و خدمت)
- `siteSettings` — تلفن، اینستاگرام، تلگرام، بنر

ویرایش محتوا از طریق MongoDB Compass یا Atlas (بدون پنل ادمین در نسخهٔ فعلی).

## صفحات

- `/` — خانه
- `/services` و `/services/[slug]` — خدمات
- `/projects` و `/projects/[slug]` — نمونه‌کارها (فیلتر `?service=` و `?customer=`)
- `/customers` و `/customers/[slug]` — مشتریان
- `/contact` — تماس
