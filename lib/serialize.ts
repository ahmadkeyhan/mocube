import { ObjectId } from "mongodb";
import type { Serialized } from "@/lib/models/types";

export function serialize<T>(value: T): Serialized<T> {
  if (value instanceof ObjectId) {
    return value.toHexString() as Serialized<T>;
  }
  if (value instanceof Date) {
    return value.toISOString() as Serialized<T>;
  }
  if (Array.isArray(value)) {
    return value.map((item) => serialize(item)) as Serialized<T>;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = serialize(nested);
    }
    return result as Serialized<T>;
  }
  return value as Serialized<T>;
}
