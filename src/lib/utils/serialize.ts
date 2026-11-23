/**
 * Next.js Server-to-Client Component Serialization Helper
 * Converts BSON ObjectIds, Date instances, and objects with toJSON methods into plain serializable primitives.
 */

export function toPlainObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}
