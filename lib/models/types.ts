import type { ObjectId } from "mongodb";

export type ServiceColor =
  | "orangey"
  | "pink"
  | "lilac"
  | "blue"
  | "shockingly-green";

export type MicroService = {
  slug: string;
  name: string;
  description: string;
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
  microServices: MicroService[];
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

export type Project = {
  _id: ObjectId;
  slug: string;
  title: string;
  coverUrl: string;
  galleryUrls: string[];
  customerId: ObjectId;
  serviceIds: ObjectId[];
  microServiceSlugs: string[];
  featured: boolean;
  description: string;
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
