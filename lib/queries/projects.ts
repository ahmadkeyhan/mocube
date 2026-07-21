import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Customer, Project, Service } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

type ProjectFilters = {
  serviceSlug?: string;
  customerSlug?: string;
  featured?: boolean;
};

async function resolveFilterIds(
  filters: ProjectFilters,
): Promise<{ serviceId?: ObjectId; customerId?: ObjectId } | null> {
  const db = await getDb();
  if (!db) return null;

  let serviceId: ObjectId | undefined;
  let customerId: ObjectId | undefined;

  if (filters.serviceSlug) {
    const service = await db
      .collection<Service>(COLLECTIONS.services)
      .findOne({ slug: filters.serviceSlug }, { projection: { _id: 1 } });
    if (!service) return { serviceId: undefined, customerId: undefined };
    serviceId = service._id;
  }

  if (filters.customerSlug) {
    const customer = await db
      .collection<Customer>(COLLECTIONS.customers)
      .findOne({ slug: filters.customerSlug }, { projection: { _id: 1 } });
    if (!customer) return { serviceId: undefined, customerId: undefined };
    customerId = customer._id;
  }

  return { serviceId, customerId };
}

export async function getProjects(filters: ProjectFilters = {}) {
  try {
    const db = await getDb();
    if (!db) return [];

    const ids = await resolveFilterIds(filters);
    if (!ids) return [];

    if (filters.serviceSlug && !ids.serviceId) return [];
    if (filters.customerSlug && !ids.customerId) return [];

    const query: Record<string, unknown> = {};
    if (ids.serviceId) query.serviceIds = ids.serviceId;
    if (ids.customerId) query.customerId = ids.customerId;
    if (filters.featured) query.featured = true;

    const docs = await db
      .collection<Project>(COLLECTIONS.projects)
      .find(query)
      .sort({ featured: -1, title: 1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getProjectsWithRelations(filters: ProjectFilters = {}) {
  try {
    const db = await getDb();
    if (!db) return [];

    const projects = await getProjects(filters);
    if (projects.length === 0) return [];

    const customerIds = [
      ...new Set(projects.map((p) => p.customerId).filter(Boolean)),
    ].map((id) => new ObjectId(id));
    const serviceIds = [...new Set(projects.flatMap((p) => p.serviceIds))].map(
      (id) => new ObjectId(id),
    );

    const [customers, services] = await Promise.all([
      db
        .collection<Customer>(COLLECTIONS.customers)
        .find({ _id: { $in: customerIds } })
        .toArray(),
      db
        .collection<Service>(COLLECTIONS.services)
        .find({ _id: { $in: serviceIds } })
        .toArray(),
    ]);

    const customerMap = new Map(
      customers.map((c) => [c._id.toHexString(), serialize(c)]),
    );
    const serviceMap = new Map(
      services.map((s) => [s._id.toHexString(), serialize(s)]),
    );

    return projects.map((project) => ({
      ...project,
      customer: customerMap.get(project.customerId) ?? null,
      services: project.serviceIds
        .map((id) => serviceMap.get(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    }));
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<Project>(COLLECTIONS.projects)
      .findOne({ slug });

    if (!doc) return null;

    const [customer, services] = await Promise.all([
      db
        .collection<Customer>(COLLECTIONS.customers)
        .findOne({ _id: doc.customerId }),
      db
        .collection<Service>(COLLECTIONS.services)
        .find({ _id: { $in: doc.serviceIds } })
        .toArray(),
    ]);

    return {
      ...serialize(doc),
      customer: customer ? serialize(customer) : null,
      services: serialize(services),
    };
  } catch {
    return null;
  }
}
