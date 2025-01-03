import mapValues from "lodash/mapValues";

export function decodeUriParams<T extends Record<string, string>>(params: T): T | null {
  try {
    return mapValues(params, decodeURIComponent) as T;
  } catch {
    return null;
  }
}
