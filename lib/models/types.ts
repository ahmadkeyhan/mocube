import type { ObjectId } from "mongodb";

export type ServiceColor =
  | "orangey"
  | "pink"
  | "lilac"
  | "blue"
  | "shockingly-green";

export type MicroService = {
  _id: ObjectId;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  serviceId: ObjectId;
  sortOrder: number;
};

export type PricingPlan = {
  name: string;
  priceLabel: string;
  features: string[];
  highlighted: boolean;
};

export type Service = {
  _id: ObjectId;
  slug: string;
  name: string;
  color: ServiceColor;
  shortDescription: string;
  description: string;
  pricingPlans: PricingPlan[];
  sortOrder: number;
};

export type Customer = {
  _id: ObjectId;
  slug: string;
  name: string;
  logoUrl: string;
  shortDescription: string;
  description: string;
};

export type ProjectGallery = {
  urls: string[];
  microServiceIds: ObjectId[];
  description?: string;
};

export type Project = {
  _id: ObjectId;
  slug: string;
  title: string;
  coverUrl: string;
  galleries: ProjectGallery[];
  customerId: ObjectId;
  serviceIds: ObjectId[];
  microServiceIds: ObjectId[];
  featured: boolean;
  description: string;
};

export type UserRole = "admin" | "business";

export type AppUser = {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  role: UserRole;
  businessId?: ObjectId;
  createdAt: Date;
};

export type SiteSettings = {
  _id: ObjectId;
  phone: string;
  instagram: string;
  telegram: string;
  announcement: string;
};

export type InquirySnapshotItem = {
  slug: string;
  name: string;
};

export type InquiryPlanSnapshot = {
  serviceSlug: string;
  serviceName: string;
  planName: string;
  priceLabel: string;
};

export type Inquiry = {
  _id: ObjectId;
  name: string;
  phone: string;
  businessName: string;
  message: string;
  services: InquirySnapshotItem[];
  microServices: InquirySnapshotItem[];
  plan: InquiryPlanSnapshot | null;
  createdAt: Date;
  read: boolean;
};

export type BusinessStatus = "pending" | "active" | "rejected";

export type Business = {
  _id: ObjectId;
  ownerUserId: ObjectId;
  name: string;
  fieldSlug: string;
  subTags: string[];
  city: string;
  audience: string;
  tone: string;
  instagram: string;
  brandColors: string[];
  status: BusinessStatus;
  shareToken: string;
  aiUsage: { day: string; count: number };
  createdAt: Date;
};

export type OccasionScope = "global" | "national";

export type OccasionCalendar = "gregorian" | "jalali" | "hijri";

export type OccasionKind = "campaign" | "poster";

/** `year: null` means it repeats every year on this month/day. */
export type OccasionDate = {
  calendar: OccasionCalendar;
  year: number | null;
  month: number;
  day: number;
};

export type Occasion = {
  _id: ObjectId;
  slug: string;
  title: string;
  description: string;
  scope: OccasionScope;
  /** Empty means it applies to every business field. */
  fieldSlugs: string[];
  date: OccasionDate;
  leadTimeDays: number;
  importance: number;
  suggestedKind: OccasionKind;
  active: boolean;
};

export type CalendarEntryKind =
  | "post"
  | "story"
  | "reel"
  | "campaign"
  | "poster"
  | "note";

export type CalendarEntryStatus = "planned" | "ready" | "published" | "skipped";

export type BriefStatus = "requested" | "inDesign" | "delivered" | "cancelled";

export type AiIdea = {
  title: string;
  hook: string;
  caption: string;
  visualDirection: string;
  cta: string;
};

export type CalendarBrief = {
  status: BriefStatus;
  idea: AiIdea;
  requestedAt: Date;
  dueDate: Date;
  deliveredAt: Date | null;
  adminNote: string;
};

export type CalendarEntry = {
  _id: ObjectId;
  businessId: ObjectId;
  /** Gregorian UTC midnight of the day it sits on. */
  date: Date;
  kind: CalendarEntryKind;
  title: string;
  notes: string;
  occasionSlug: string | null;
  status: CalendarEntryStatus;
  ideas: AiIdea[];
  request: CalendarBrief | null;
  createdAt: Date;
};

export type CalendarEntryWithBusiness = CalendarEntry & {
  business: Business | null;
};

export type ProjectWithRelations = Project & {
  customer: Customer | null;
  services: Service[];
  microServices: MicroService[];
};

export type MicroServiceWithRelations = MicroService & {
  service: Service | null;
};

export type MicroGalleryBlock = {
  projectSlug: string;
  projectTitle: string;
  gallery: ProjectGallery;
};

export type Serialized<T> = T extends ObjectId
  ? string
  : T extends Date
    ? string
    : T extends Array<infer U>
      ? Array<Serialized<U>>
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;
