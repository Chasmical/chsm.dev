import type { oEmbedEndpoint, oEmbedProvider, oEmbedResponse } from "./types";
export type * from "./types";

export interface oEmbedInput<X = object> {
  providers: oEmbedProvider[];
  overrides?: { [provider_name: string]: ProviderParams & X };
  size: [width: number, height: number];
}
interface ProviderParams {
  size?: [width: number, height: number];
  params?: Record<string, string | number | boolean>;
}

export interface oEmbedInfo<X = object> {
  requestUrl: URL;
  provider: oEmbedProvider;
  endpoint: oEmbedEndpoint;
  override?: ProviderParams & X;
  size: [width: number, height: number];
  response: () => Promise<oEmbedResponse>;
}

export function getOEmbed<X>(config: oEmbedInput<X>, url: string): oEmbedInfo<X> | undefined {
  // Find the matching oEmbed API endpoint
  const endpointInfo = findOEmbedEndpoint(config.providers, url);
  if (!endpointInfo) return;

  // Determine the query parameters
  const [provider, endpoint] = endpointInfo;
  const override = config.overrides?.[provider.provider_name];
  const size = override?.size ?? config.size;

  const requestUrl = createOEmbedRequestUrl(url, endpoint, size, override?.params);

  const response = async (): Promise<oEmbedResponse> => {
    const res = await fetch(
      requestUrl,
      // Cache on server for 1 hour, and cache on client indefinitely
      typeof window === "undefined" ? { next: { revalidate: 3600 } } : { cache: "force-cache" },
    );
    const data = (await res.json()) as oEmbedResponse;

    // Prevent spoofing through response's data
    data.provider_name = provider.provider_name;
    data.provider_url = provider.provider_url;

    return data;
  };

  return { requestUrl, provider, endpoint, override, size, response };
}

// Function for matching a URL to a provider's endpoint
export function findOEmbedEndpoint(providers: oEmbedProvider[], url: string) {
  for (const provider of providers) {
    for (const endpoint of provider.endpoints) {
      for (const scheme of endpoint.schemes) {
        if (url.match(scheme)) return [provider, endpoint] as const;
      }
    }
  }
}

export function createOEmbedRequestUrl(
  url: string,
  endpoint: oEmbedEndpoint,
  size: [width: number, height: number],
  extraParams?: Record<string, string | number | boolean>,
) {
  // Build the request URL
  const format = "json";
  const requestUrl = new URL(endpoint.url.replace("{format}", format));

  // Determine the query parameters and assign them to the URL
  const params = {
    ...endpoint.params,
    url,
    format,
    maxwidth: size[0],
    maxheight: size[1],
    ...extraParams,
  };
  for (const key in params) {
    requestUrl.searchParams.set(key, "" + params[key as never]);
  }

  return requestUrl;
}
