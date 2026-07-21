import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "MONGODB_URI is required. Copy .env.example to .env.local and set it.",
  );
  process.exit(1);
}

const brandingId = new ObjectId();
const illustrationId = new ObjectId();
const webId = new ObjectId();
const merchId = new ObjectId();

const customerIds = {
  noora: new ObjectId(),
  zest: new ObjectId(),
  kavir: new ObjectId(),
  pulse: new ObjectId(),
  shard: new ObjectId(),
};

const services = [
  {
    _id: brandingId,
    slug: "branding",
    name: "هویت برند",
    color: "orangey",
    shortDescription: "هویتی که برند را از دیگران جدا می‌کند",
    description:
      "از استراتژی نام تا سیستم بصری کامل — هویت برند موکیوب برای کسب‌وکارهایی ساخته می‌شود که می‌خواهند در ذهن بمانند.",
    sortOrder: 1,
    microServices: [
      {
        slug: "logo",
        name: "طراحی لوگو",
        description: "نشانه‌ای ساده، به‌یادماندنی و مقیاس‌پذیر",
      },
      {
        slug: "visual-identity",
        name: "سیستم هویت بصری",
        description: "پالت، تایپوگرافی، الگو و راهنمای کاربرد",
      },
      {
        slug: "brand-strategy",
        name: "استراتژی برند",
        description: "جایگاه‌یابی، لحن و روایت برند",
      },
      {
        slug: "brand-guidelines",
        name: "راهنمای برند",
        description: "سند اجرایی برای تیم‌ها و پیمانکاران",
      },
    ],
    pricingPlans: [
      {
        name: "شروع",
        priceLabel: "از ۱۲ میلیون تومان",
        features: ["طراحی لوگو", "پالت رنگی", "۲ دور بازبینی"],
        highlighted: false,
      },
      {
        name: "استاندارد",
        priceLabel: "از ۲۸ میلیون تومان",
        features: [
          "لوگو و هویت بصری",
          "راهنمای برند مختصر",
          "قالب شبکه اجتماعی",
          "۴ دور بازبینی",
        ],
        highlighted: true,
      },
      {
        name: "کامل",
        priceLabel: "از ۵۵ میلیون تومان",
        features: [
          "استراتژی برند",
          "سیستم هویت کامل",
          "راهنمای جامع",
          "پشتیبانی ۳۰ روزه",
        ],
        highlighted: false,
      },
    ],
  },
  {
    _id: illustrationId,
    slug: "illustration",
    name: "تصویرسازی",
    color: "pink",
    shortDescription: "تصاویری که حس و داستان را منتقل می‌کنند",
    description:
      "تصویرسازی سفارشی برای کمپین، محصول، وب و محتوای برند — از کاراکتر تا صحنه و الگوی گرافیکی.",
    sortOrder: 2,
    microServices: [
      {
        slug: "character",
        name: "طراحی کاراکتر",
        description: "شخصیت‌های برند برای روایت و کمپین",
      },
      {
        slug: "editorial",
        name: "تصویرسازی ادیتوریال",
        description: "تصاویر مفهومی برای مقاله و گزارش",
      },
      {
        slug: "pattern",
        name: "الگو و بافت",
        description: "پترن‌های تکرارشونده برای بسته‌بندی و وب",
      },
      {
        slug: "icon-set",
        name: "مجموعه آیکون",
        description: "آیکون‌های یکدست برای محصول و رابط",
      },
    ],
    pricingPlans: [
      {
        name: "تک تصویر",
        priceLabel: "از ۴ میلیون تومان",
        features: ["۱ تصویر اصلی", "۲ دور بازبینی", "خروجی وب و چاپ"],
        highlighted: false,
      },
      {
        name: "مجموعه",
        priceLabel: "از ۱۵ میلیون تومان",
        features: ["تا ۶ تصویر", "سبک یکدست", "فایل‌های لایه‌باز"],
        highlighted: true,
      },
      {
        name: "سیستم تصویری",
        priceLabel: "از ۳۵ میلیون تومان",
        features: [
          "کتابخانه تصویر",
          "کاراکتر و صحنه",
          "راهنمای سبک",
          "پشتیبانی ویرایش",
        ],
        highlighted: false,
      },
    ],
  },
  {
    _id: webId,
    slug: "web",
    name: "توسعه وب",
    color: "lilac",
    shortDescription: "وب‌سایت‌هایی سریع، زیبا و قابل گسترش",
    description:
      "از لندینگ مارکتینگ تا سایت برند و تجربه محصول — طراحی و توسعه وب با تمرکز بر عملکرد و هویت بصری.",
    sortOrder: 3,
    microServices: [
      {
        slug: "landing",
        name: "لندینگ پیج",
        description: "صفحه کمپین با تمرکز بر تبدیل",
      },
      {
        slug: "marketing-site",
        name: "سایت بازاریابی",
        description: "چندصفحه‌ای برای معرفی برند و خدمات",
      },
      {
        slug: "ui-design",
        name: "طراحی رابط کاربری",
        description: "وایرفریم تا UI نهایی در فیگما",
      },
      {
        slug: "frontend",
        name: "فرانت‌اند",
        description: "پیاده‌سازی واکنش‌گرا با Next.js",
      },
    ],
    pricingPlans: [
      {
        name: "لندینگ",
        priceLabel: "از ۱۸ میلیون تومان",
        features: ["۱ صفحه", "موبایل‌فرست", "فرم تماس"],
        highlighted: false,
      },
      {
        name: "سایت برند",
        priceLabel: "از ۴۵ میلیون تومان",
        features: ["تا ۸ صفحه", "سیستم کامپوننت", "بهینه‌سازی SEO پایه"],
        highlighted: true,
      },
      {
        name: "تجربه سفارشی",
        priceLabel: "بر اساس پروژه",
        features: [
          "طراحی و توسعه سفارشی",
          "انیمیشن و تعامل",
          "اتصال به CMS یا API",
        ],
        highlighted: false,
      },
    ],
  },
  {
    _id: merchId,
    slug: "merch",
    name: "مرچندایز",
    color: "blue",
    shortDescription: "مرچندایزی که برند را پوشیدنی می‌کند",
    description:
      "طراحی پوشاک، بسته‌بندی و محصولات تبلیغاتی هماهنگ با هویت برند — از ایده تا فایل آماده تولید.",
    sortOrder: 4,
    microServices: [
      {
        slug: "apparel",
        name: "پوشاک برند",
        description: "تی‌شرت، هودی و لباس تیم",
      },
      {
        slug: "packaging",
        name: "بسته‌بندی",
        description: "جعبه، لیبل و تجربه آنباکسینگ",
      },
      {
        slug: "promo",
        name: "هدایای تبلیغاتی",
        description: "ست‌های رویداد و گیفت سازمانی",
      },
      {
        slug: "print",
        name: "چاپ و کاربرد",
        description: "فایل آماده چاپ و مشخصات تولید",
      },
    ],
    pricingPlans: [
      {
        name: "تک محصول",
        priceLabel: "از ۳ میلیون تومان",
        features: ["طراحی ۱ آیتم", "موکاپ", "فایل چاپ"],
        highlighted: false,
      },
      {
        name: "کالکشن",
        priceLabel: "از ۱۲ میلیون تومان",
        features: ["تا ۵ آیتم", "سیستم گرافیک", "راهنمای کاربرد"],
        highlighted: true,
      },
      {
        name: "برند مرچ",
        priceLabel: "از ۳۰ میلیون تومان",
        features: ["استراتژی کالکشن", "طراحی خط محصول", "هماهنگی تولید"],
        highlighted: false,
      },
    ],
  },
];

const customers = [
  {
    _id: customerIds.noora,
    slug: "noora",
    name: "نورا",
    logoUrl: "#ff8709",
    shortDescription: "برند مراقبت پوست",
    description:
      "نورا یک برند مراقبت پوست است که روی فرمولاسیون مینیمال و تجربه لمسی تمرکز دارد.",
  },
  {
    _id: customerIds.zest,
    slug: "zest",
    name: "زست",
    logoUrl: "#fec5fb",
    shortDescription: "کافه تخصصی",
    description:
      "زست فضای سوم شهری برای قهوه اسپشیالیتی و رویدادهای کوچک فرهنگی است.",
  },
  {
    _id: customerIds.kavir,
    slug: "kavir",
    name: "کویر",
    logoUrl: "#9d95ff",
    shortDescription: "فین‌تک",
    description:
      "کویر ابزارهای مالی برای کسب‌وکارهای کوچک با رابط ساده و شفاف می‌سازد.",
  },
  {
    _id: customerIds.pulse,
    slug: "pulse",
    name: "پالس",
    logoUrl: "#00bae2",
    shortDescription: "برند ورزشی",
    description:
      "پالس تجهیزات و پوشاک تمرینی برای دونده‌های شهری طراحی و توزیع می‌کند.",
  },
  {
    _id: customerIds.shard,
    slug: "shard",
    name: "شارد",
    logoUrl: "#0ae448",
    shortDescription: "استودیو موسیقی",
    description:
      "شارد لیبل مستقل موسیقی الکترونیک با تمرکز بر هویت بصری قوی برای هر ریلیز است.",
  },
];

const projects = [
  {
    slug: "noora-identity",
    title: "هویت بصری نورا",
    coverUrl: "#ff8709",
    galleryUrls: ["#ff8709", "#ffc078", "#191919"],
    customerId: customerIds.noora,
    serviceIds: [brandingId],
    microServiceSlugs: ["logo", "visual-identity"],
    featured: true,
    description:
      "بازطراحی کامل هویت نورا با تمرکز بر حس پاکیزگی، گرما و سادگی.",
  },
  {
    slug: "noora-packaging",
    title: "بسته‌بندی سری مینیمال نورا",
    coverUrl: "#00bae2",
    galleryUrls: ["#00bae2", "#dfffd1"],
    customerId: customerIds.noora,
    serviceIds: [merchId, brandingId],
    microServiceSlugs: ["packaging"],
    featured: false,
    description: "سیستم بسته‌بندی هماهنگ با پالت جدید برند.",
  },
  {
    slug: "zest-mural",
    title: "عکس‌سازی فضای زست",
    coverUrl: "#fec5fb",
    galleryUrls: ["#fec5fb", "#9d95ff"],
    customerId: customerIds.zest,
    serviceIds: [illustrationId],
    microServiceSlugs: ["editorial", "pattern"],
    featured: true,
    description: "تصویرسازی دیواری و الگوی منو برای کافه زست.",
  },
  {
    slug: "zest-site",
    title: "وب‌سایت زست",
    coverUrl: "#9d95ff",
    galleryUrls: ["#9d95ff", "#0e100f"],
    customerId: customerIds.zest,
    serviceIds: [webId],
    microServiceSlugs: ["marketing-site", "frontend"],
    featured: false,
    description: "سایت معرفی شعب، منو و رویدادها با تجربه موبایل‌محور.",
  },
  {
    slug: "kavir-product",
    title: "رابط محصول کویر",
    coverUrl: "#9d95ff",
    galleryUrls: ["#9d95ff", "#abff84"],
    customerId: customerIds.kavir,
    serviceIds: [webId, brandingId],
    microServiceSlugs: ["ui-design", "frontend"],
    featured: true,
    description: "طراحی و پیاده‌سازی داشبورد سبک برای کاربران کسب‌وکار کوچک.",
  },
  {
    slug: "pulse-apparel",
    title: "کالکشن دویدن پالس",
    coverUrl: "#00bae2",
    galleryUrls: ["#00bae2", "#ff8709"],
    customerId: customerIds.pulse,
    serviceIds: [merchId, illustrationId],
    microServiceSlugs: ["apparel", "pattern"],
    featured: true,
    description: "گرافیک پوشاک و پترن آستین برای فصل بهار.",
  },
  {
    slug: "pulse-campaign",
    title: "کمپین تصویری پالس",
    coverUrl: "#fec5fb",
    galleryUrls: ["#fec5fb", "#00bae2"],
    customerId: customerIds.pulse,
    serviceIds: [illustrationId],
    microServiceSlugs: ["character", "editorial"],
    featured: false,
    description: "کاراکتر و صحنه برای کمپین شبکه‌های اجتماعی.",
  },
  {
    slug: "shard-covers",
    title: "کاور آلبوم‌های شارد",
    coverUrl: "#0ae448",
    galleryUrls: ["#0ae448", "#f100cb", "#9d95ff"],
    customerId: customerIds.shard,
    serviceIds: [illustrationId, brandingId],
    microServiceSlugs: ["editorial", "visual-identity"],
    featured: true,
    description: "سیستم کاور برای سه ریلیز متوالی با زبان بصری مشترک.",
  },
  {
    slug: "shard-merch",
    title: "مرچ تور شارد",
    coverUrl: "#00bae2",
    galleryUrls: ["#00bae2", "#191919"],
    customerId: customerIds.shard,
    serviceIds: [merchId],
    microServiceSlugs: ["apparel", "promo"],
    featured: false,
    description: "تی‌شرت و پوستر تور با گرافیک شب‌نمای کنتراست بالا.",
  },
  {
    slug: "kavir-brand",
    title: "ریبرندینگ کویر",
    coverUrl: "#ff8709",
    galleryUrls: ["#ff8709", "#9d95ff"],
    customerId: customerIds.kavir,
    serviceIds: [brandingId],
    microServiceSlugs: ["logo", "brand-guidelines"],
    featured: false,
    description: "لوگو و راهنمای برند برای ورود به بازار جدید.",
  },
];

const siteSettings = {
  phone: "09121234567",
  instagram: "mocube.studio",
  telegram: "mocube",
  announcement: "استودیو خلاق موکیوب — طراحی که دیده می‌شود",
};

async function seed() {
  const client = new MongoClient(uri as string);
  await client.connect();
  const db = client.db();

  console.log("Seeding MongoDB…");

  await Promise.all([
    db.collection("services").deleteMany({}),
    db.collection("customers").deleteMany({}),
    db.collection("projects").deleteMany({}),
    db.collection("siteSettings").deleteMany({}),
  ]);

  await db.collection("services").insertMany(services);
  await db.collection("customers").insertMany(customers);
  await db
    .collection("projects")
    .insertMany(projects.map((p) => ({ ...p, _id: new ObjectId() })));
  await db.collection("siteSettings").insertOne({
    phone: siteSettings.phone,
    instagram: siteSettings.instagram,
    telegram: siteSettings.telegram,
    announcement: siteSettings.announcement,
  });

  await Promise.all([
    db.collection("services").createIndex({ slug: 1 }, { unique: true }),
    db.collection("customers").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ customerId: 1 }),
    db.collection("projects").createIndex({ serviceIds: 1 }),
  ]);

  console.log(
    `Done: ${services.length} services, ${customers.length} customers, ${projects.length} projects.`,
  );
  await client.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
