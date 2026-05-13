import type { oEmbedProvider } from "@lib/oembed";
import { unstable_cache } from "next/cache";

export const fetchDefaultProviders = unstable_cache(
  async () => {
    const res = await fetch("https://oembed.com/providers.json", { cache: "no-cache" });
    const response = (await res.json()) as oEmbedProvider[];

    // Embeds are whitelisted and implemented individually,
    // to prevent unwanted tracking by the linked services.
    const allowedProviders = ["YouTube"];

    const providers = allowedProviders.map(name => response.find(p => p.provider_name === name));

    return normalizeProviders(providers.filter(p => p != null));
  },
  undefined,
  // Cache for 1 hour
  { revalidate: 3600 },
);

function normalizeProviders(data: oEmbedProvider[]) {
  // Ensure `endpoints` and `schemes` aren't undefined
  for (const provider of data) {
    provider.endpoints ??= [];
    for (const endpoint of provider.endpoints) {
      endpoint.schemes ??= [];
      for (let i = 0, length = endpoint.schemes.length; i < length; i++) {
        // Replace "simple patterns" with regex patterns
        const regex = endpoint.schemes[i].replaceAll(".", "\\.").replaceAll("*", ".*");
        endpoint.schemes[i] = "^" + regex + "$";
      }
    }
  }
  return data;
}
