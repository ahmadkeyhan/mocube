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

const microIds = {
  logo: new ObjectId(),
  visualIdentity: new ObjectId(),
  brandStrategy: new ObjectId(),
  brandGuidelines: new ObjectId(),
  character: new ObjectId(),
  editorial: new ObjectId(),
  pattern: new ObjectId(),
  iconSet: new ObjectId(),
  landing: new ObjectId(),
  marketingSite: new ObjectId(),
  uiDesign: new ObjectId(),
  frontend: new ObjectId(),
  apparel: new ObjectId(),
  packaging: new ObjectId(),
  promo: new ObjectId(),
  print: new ObjectId(),
};

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

const microServices = [
  {
    _id: microIds.logo,
    slug: "logo",
    name: "طراحی لوگو",
    shortDescription: "نشانه‌ای ساده، به‌یادماندنی و مقیاس‌پذیر",
    description: "نشانه‌ای ساده، به‌یادماندنی و مقیاس‌پذیر",
    serviceId: brandingId,
    sortOrder: 1,
  },
  {
    _id: microIds.visualIdentity,
    slug: "visual-identity",
    name: "سیستم هویت بصری",
    shortDescription: "پالت، تایپوگرافی، الگو و راهنمای کاربرد",
    description: "پالت، تایپوگرافی، الگو و راهنمای کاربرد",
    serviceId: brandingId,
    sortOrder: 2,
  },
  {
    _id: microIds.brandStrategy,
    slug: "brand-strategy",
    name: "استراتژی برند",
    shortDescription: "جایگاه‌یابی، لحن و روایت برند",
    description: "جایگاه‌یابی، لحن و روایت برند",
    serviceId: brandingId,
    sortOrder: 3,
  },
  {
    _id: microIds.brandGuidelines,
    slug: "brand-guidelines",
    name: "راهنمای برند",
    shortDescription: "سند اجرایی برای تیم‌ها و پیمانکاران",
    description: "سند اجرایی برای تیم‌ها و پیمانکاران",
    serviceId: brandingId,
    sortOrder: 4,
  },
  {
    _id: microIds.character,
    slug: "character",
    name: "طراحی کاراکتر",
    shortDescription: "شخصیت‌های برند برای روایت و کمپین",
    description: "شخصیت‌های برند برای روایت و کمپین",
    serviceId: illustrationId,
    sortOrder: 1,
  },
  {
    _id: microIds.editorial,
    slug: "editorial",
    name: "تصویرسازی ادیتوریال",
    shortDescription: "تصاویر مفهومی برای مقاله و گزارش",
    description: "تصاویر مفهومی برای مقاله و گزارش",
    serviceId: illustrationId,
    sortOrder: 2,
  },
  {
    _id: microIds.pattern,
    slug: "pattern",
    name: "الگو و بافت",
    shortDescription: "پترن‌های تکرارشونده برای بسته‌بندی و وب",
    description: "پترن‌های تکرارشونده برای بسته‌بندی و وب",
    serviceId: illustrationId,
    sortOrder: 3,
  },
  {
    _id: microIds.iconSet,
    slug: "icon-set",
    name: "مجموعه آیکون",
    shortDescription: "آیکون‌های یکدست برای محصول و رابط",
    description: "آیکون‌های یکدست برای محصول و رابط",
    serviceId: illustrationId,
    sortOrder: 4,
  },
  {
    _id: microIds.landing,
    slug: "landing",
    name: "لندینگ پیج",
    shortDescription: "صفحه کمپین با تمرکز بر تبدیل",
    description: "صفحه کمپین با تمرکز بر تبدیل",
    serviceId: webId,
    sortOrder: 1,
  },
  {
    _id: microIds.marketingSite,
    slug: "marketing-site",
    name: "سایت بازاریابی",
    shortDescription: "چندصفحه‌ای برای معرفی برند و سرویس‌ها",
    description: "چندصفحه‌ای برای معرفی برند و سرویس‌ها",
    serviceId: webId,
    sortOrder: 2,
  },
  {
    _id: microIds.uiDesign,
    slug: "ui-design",
    name: "طراحی رابط کاربری",
    shortDescription: "وایرفریم تا UI نهایی در فیگما",
    description: "وایرفریم تا UI نهایی در فیگما",
    serviceId: webId,
    sortOrder: 3,
  },
  {
    _id: microIds.frontend,
    slug: "frontend",
    name: "فرانت‌اند",
    shortDescription: "پیاده‌سازی واکنش‌گرا با Next.js",
    description: "پیاده‌سازی واکنش‌گرا با Next.js",
    serviceId: webId,
    sortOrder: 4,
  },
  {
    _id: microIds.apparel,
    slug: "apparel",
    name: "پوشاک برند",
    shortDescription: "تی‌شرت، هودی و لباس تیم",
    description: "تی‌شرت، هودی و لباس تیم",
    serviceId: merchId,
    sortOrder: 1,
  },
  {
    _id: microIds.packaging,
    slug: "packaging",
    name: "بسته‌بندی",
    shortDescription: "جعبه، لیبل و تجربه آنباکسینگ",
    description: "جعبه، لیبل و تجربه آنباکسینگ",
    serviceId: merchId,
    sortOrder: 2,
  },
  {
    _id: microIds.promo,
    slug: "promo",
    name: "هدایای تبلیغاتی",
    shortDescription: "ست‌های رویداد و گیفت سازمانی",
    description: "ست‌های رویداد و گیفت سازمانی",
    serviceId: merchId,
    sortOrder: 3,
  },
  {
    _id: microIds.print,
    slug: "print",
    name: "چاپ و کاربرد",
    shortDescription: "فایل آماده چاپ و مشخصات تولید",
    description: "فایل آماده چاپ و مشخصات تولید",
    serviceId: merchId,
    sortOrder: 4,
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

function gallery(
  urls: string[],
  microServiceIds: ObjectId[],
  description?: string,
) {
  return description
    ? { urls, microServiceIds, description }
    : { urls, microServiceIds };
}

const projects = [
  {
    slug: "noora-identity",
    title: "هویت بصری نورا",
    coverUrl: "#ff8709",
    galleries: [
      gallery(
        ["#ff8709", "#ffc078", "#191919"],
        [microIds.logo, microIds.visualIdentity],
      ),
    ],
    customerId: customerIds.noora,
    serviceIds: [brandingId],
    microServiceIds: [microIds.logo, microIds.visualIdentity],
    featured: true,
    description:
      "بازطراحی کامل هویت نورا با تمرکز بر حس پاکیزگی، گرما و سادگی.",
  },
  {
    slug: "noora-packaging",
    title: "بسته‌بندی سری مینیمال نورا",
    coverUrl: "#00bae2",
    galleries: [gallery(["#00bae2", "#dfffd1"], [microIds.packaging])],
    customerId: customerIds.noora,
    serviceIds: [merchId, brandingId],
    microServiceIds: [microIds.packaging],
    featured: false,
    description: "سیستم بسته‌بندی هماهنگ با پالت جدید برند.",
  },
  {
    slug: "zest-mural",
    title: "عکس‌سازی فضای زست",
    coverUrl: "#fec5fb",
    galleries: [
      gallery(["#fec5fb", "#9d95ff"], [microIds.editorial, microIds.pattern]),
    ],
    customerId: customerIds.zest,
    serviceIds: [illustrationId],
    microServiceIds: [microIds.editorial, microIds.pattern],
    featured: true,
    description: "تصویرسازی دیواری و الگوی منو برای کافه زست.",
  },
  {
    slug: "zest-site",
    title: "وب‌سایت زست",
    coverUrl: "#9d95ff",
    galleries: [
      gallery(
        ["#9d95ff", "#0e100f"],
        [microIds.marketingSite, microIds.frontend],
      ),
    ],
    customerId: customerIds.zest,
    serviceIds: [webId],
    microServiceIds: [microIds.marketingSite, microIds.frontend],
    featured: false,
    description: "سایت معرفی شعب، منو و رویدادها با تجربه موبایل‌محور.",
  },
  {
    slug: "kavir-product",
    title: "رابط محصول کویر",
    coverUrl: "#9d95ff",
    galleries: [
      gallery(["#9d95ff", "#abff84"], [microIds.uiDesign, microIds.frontend]),
    ],
    customerId: customerIds.kavir,
    serviceIds: [webId, brandingId],
    microServiceIds: [microIds.uiDesign, microIds.frontend],
    featured: true,
    description: "طراحی و پیاده‌سازی داشبورد سبک برای کاربران کسب‌وکار کوچک.",
  },
  {
    slug: "pulse-apparel",
    title: "کالکشن دویدن پالس",
    coverUrl: "#00bae2",
    galleries: [
      gallery(["#00bae2", "#ff8709"], [microIds.apparel, microIds.pattern]),
    ],
    customerId: customerIds.pulse,
    serviceIds: [merchId, illustrationId],
    microServiceIds: [microIds.apparel, microIds.pattern],
    featured: true,
    description: "گرافیک پوشاک و پترن آستین برای فصل بهار.",
  },
  {
    slug: "pulse-campaign",
    title: "کمپین تصویری پالس",
    coverUrl: "#fec5fb",
    galleries: [
      gallery(["#fec5fb", "#00bae2"], [microIds.character, microIds.editorial]),
    ],
    customerId: customerIds.pulse,
    serviceIds: [illustrationId],
    microServiceIds: [microIds.character, microIds.editorial],
    featured: false,
    description: "کاراکتر و صحنه برای کمپین شبکه‌های اجتماعی.",
  },
  {
    slug: "shard-covers",
    title: "کاور آلبوم‌های شارد",
    coverUrl: "#0ae448",
    galleries: [
      gallery(
        ["#0ae448", "#f100cb", "#9d95ff"],
        [microIds.editorial, microIds.visualIdentity],
      ),
    ],
    customerId: customerIds.shard,
    serviceIds: [illustrationId, brandingId],
    microServiceIds: [microIds.editorial, microIds.visualIdentity],
    featured: true,
    description: "سیستم کاور برای سه ریلیز متوالی با زبان بصری مشترک.",
  },
  {
    slug: "shard-merch",
    title: "مرچ تور شارد",
    coverUrl: "#00bae2",
    galleries: [
      gallery(["#00bae2", "#191919"], [microIds.apparel, microIds.promo]),
    ],
    customerId: customerIds.shard,
    serviceIds: [merchId],
    microServiceIds: [microIds.apparel, microIds.promo],
    featured: false,
    description: "تی‌شرت و پوستر تور با گرافیک شب‌نمای کنتراست بالا.",
  },
  {
    slug: "kavir-brand",
    title: "ریبرندینگ کویر",
    coverUrl: "#ff8709",
    galleries: [
      gallery(
        ["#ff8709", "#9d95ff"],
        [microIds.logo, microIds.brandGuidelines],
      ),
    ],
    customerId: customerIds.kavir,
    serviceIds: [brandingId],
    microServiceIds: [microIds.logo, microIds.brandGuidelines],
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
    db.collection("microServices").deleteMany({}),
    db.collection("customers").deleteMany({}),
    db.collection("projects").deleteMany({}),
    db.collection("siteSettings").deleteMany({}),
  ]);

  await db.collection("services").insertMany(services);
  await db.collection("microServices").insertMany(microServices);
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
    db.collection("microServices").createIndex({ slug: 1 }, { unique: true }),
    db
      .collection("microServices")
      .createIndex({ serviceId: 1, sortOrder: 1 }),
    db.collection("customers").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ customerId: 1 }),
    db.collection("projects").createIndex({ serviceIds: 1 }),
    db.collection("projects").createIndex({ microServiceIds: 1 }),
    db.collection("projects").createIndex({ "galleries.microServiceIds": 1 }),
    db.collection("inquiries").createIndex({ createdAt: -1 }),
  ]);

  console.log(
    `Done: ${services.length} services, ${microServices.length} microServices, ${customers.length} customers, ${projects.length} projects.`,
  );
  await client.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
