/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Pick<T, K>;

export function pick<T extends object>(
  object: T,
  keys: readonly string[],
): Partial<T>;

export function pick<T extends object>(object: T, keys: readonly string[]) {
  const result: Partial<T> = {};

  for (const key of keys) {
    if (key in object) {
      (result as any)[key] = (object as any)[key];
    }
  }

  return result;
}
