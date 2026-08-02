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

export type AdminRole = "admin";

export type AdminUser = {
  _id: ObjectId;
  username: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: Date;
};

export type SiteSettings = {
  _id: ObjectId;
  phone: string;
  instagram: string;
  telegram: string;
  announcement: string;
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
