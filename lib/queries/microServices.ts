import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type {
  MicroGalleryBlock,
  MicroService,
  Project,
  Service,
} from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

export async function getMicroServices() {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .find({})
      .sort({ serviceId: 1, sortOrder: 1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getMicroServicesWithService() {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .find({})
      .sort({ serviceId: 1, sortOrder: 1 })
      .toArray();

    if (docs.length === 0) return [];

    const serviceIds = [
      ...new Set(docs.map((m) => m.serviceId.toHexString())),
    ].map((id) => new ObjectId(id));

    const services = await db
      .collection<Service>(COLLECTIONS.services)
      .find({ _id: { $in: serviceIds } })
      .toArray();

    const serviceMap = new Map(
      services.map((s) => [s._id.toHexString(), serialize(s)]),
    );

    return docs.map((micro) => ({
      ...serialize(micro),
      service: serviceMap.get(micro.serviceId.toHexString()) ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getMicroServicesByServiceId(serviceId: string) {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .find({ serviceId: new ObjectId(serviceId) })
      .sort({ sortOrder: 1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getMicroServiceBySlug(slug: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .findOne({ slug });

    if (!doc) return null;

    const service = await db
      .collection<Service>(COLLECTIONS.services)
      .findOne({ _id: doc.serviceId });

    return {
      ...serialize(doc),
      service: service ? serialize(service) : null,
    };
  } catch {
    return null;
  }
}

export async function getGalleriesForMicro(microId: string) {
  try {
    const db = await getDb();
    if (!db) return [];

    const objectId = new ObjectId(microId);
    const projects = await db
      .collection<Project>(COLLECTIONS.projects)
      .find({ "galleries.microServiceIds": objectId })
      .sort({ featured: -1, title: 1 })
      .toArray();

    const blocks: MicroGalleryBlock[] = [];
    for (const project of projects) {
      for (const gallery of project.galleries) {
        if (
          gallery.microServiceIds.some((id) => id.equals(objectId))
        ) {
          blocks.push({
            projectSlug: project.slug,
            projectTitle: project.title,
            gallery,
          });
        }
      }
    }

    return serialize(blocks);
  } catch {
    return [];
  }
}
