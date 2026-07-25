import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type {
  Customer,
  MicroService,
  Project,
  Service,
} from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

type ProjectFilters = {
  serviceSlug?: string;
  customerSlug?: string;
  microSlug?: string;
  featured?: boolean;
};

async function resolveFilterIds(filters: ProjectFilters): Promise<{
  serviceId?: ObjectId;
  customerId?: ObjectId;
  microServiceId?: ObjectId;
} | null> {
  const db = await getDb();
  if (!db) return null;

  let serviceId: ObjectId | undefined;
  let customerId: ObjectId | undefined;
  let microServiceId: ObjectId | undefined;

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

  if (filters.microSlug) {
    const micro = await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .findOne({ slug: filters.microSlug }, { projection: { _id: 1 } });
    if (!micro) {
      return {
        serviceId: undefined,
        customerId: undefined,
        microServiceId: undefined,
      };
    }
    microServiceId = micro._id;
  }

  return { serviceId, customerId, microServiceId };
}

export async function getProjects(filters: ProjectFilters = {}) {
  try {
    const db = await getDb();
    if (!db) return [];

    const ids = await resolveFilterIds(filters);
    if (!ids) return [];

    if (filters.serviceSlug && !ids.serviceId) return [];
    if (filters.customerSlug && !ids.customerId) return [];
    if (filters.microSlug && !ids.microServiceId) return [];

    const query: Record<string, unknown> = {};
    if (ids.serviceId) query.serviceIds = ids.serviceId;
    if (ids.customerId) query.customerId = ids.customerId;
    if (ids.microServiceId) query.microServiceIds = ids.microServiceId;
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

async function loadMicroServicesByIds(ids: ObjectId[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];

  return db
    .collection<MicroService>(COLLECTIONS.microServices)
    .find({ _id: { $in: ids } })
    .toArray();
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
    const microServiceIds = [
      ...new Set(projects.flatMap((p) => p.microServiceIds)),
    ].map((id) => new ObjectId(id));

    const [customers, services, microServices] = await Promise.all([
      db
        .collection<Customer>(COLLECTIONS.customers)
        .find({ _id: { $in: customerIds } })
        .toArray(),
      db
        .collection<Service>(COLLECTIONS.services)
        .find({ _id: { $in: serviceIds } })
        .toArray(),
      loadMicroServicesByIds(microServiceIds),
    ]);

    const customerMap = new Map(
      customers.map((c) => [c._id.toHexString(), serialize(c)]),
    );
    const serviceMap = new Map(
      services.map((s) => [s._id.toHexString(), serialize(s)]),
    );
    const microMap = new Map(
      microServices.map((m) => [m._id.toHexString(), serialize(m)]),
    );

    return projects.map((project) => ({
      ...project,
      customer: customerMap.get(project.customerId) ?? null,
      services: project.serviceIds
        .map((id) => serviceMap.get(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
      microServices: project.microServiceIds
        .map((id) => microMap.get(id))
        .filter((m): m is NonNullable<typeof m> => Boolean(m)),
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

    const galleryMicroIds = doc.galleries.flatMap((g) => g.microServiceIds);
    const allMicroIds = [
      ...new Set(
        [...doc.microServiceIds, ...galleryMicroIds].map((id) =>
          id.toHexString(),
        ),
      ),
    ].map((id) => new ObjectId(id));

    const [customer, services, microServices] = await Promise.all([
      db
        .collection<Customer>(COLLECTIONS.customers)
        .findOne({ _id: doc.customerId }),
      db
        .collection<Service>(COLLECTIONS.services)
        .find({ _id: { $in: doc.serviceIds } })
        .toArray(),
      loadMicroServicesByIds(allMicroIds),
    ]);

    const microMap = new Map(
      microServices.map((m) => [m._id.toHexString(), serialize(m)]),
    );

    return {
      ...serialize(doc),
      customer: customer ? serialize(customer) : null,
      services: serialize(services),
      microServices: doc.microServiceIds
        .map((id) => microMap.get(id.toHexString()))
        .filter((m): m is NonNullable<typeof m> => Boolean(m)),
      microById: Object.fromEntries(microMap),
    };
  } catch {
    return null;
  }
}
