import { gitApiUrl } from "../config/appSettings";

export interface QueryParams {
  [name: string]: string;
}

export interface HttpRequest<REQB> {
  path: string;
  method?: string;
  body?: REQB;
  params?: QueryParams;
  accessToken?: string;
  skipError?: boolean;
}
export interface HttpResponse<RESB> {
  ok: boolean;
  body?: RESB;
  headers?: Headers;
}

const withParams = (url: string, params: QueryParams): string => {
  let newUrl = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    newUrl.searchParams.set(key, value);
  });
  return newUrl.toString();
};

export const http = async <RESB, REQB = undefined>(
  config: HttpRequest<REQB>
): Promise<HttpResponse<RESB>> => {
  let url = `${gitApiUrl}${config.path}`;
  if (config.params) {
    url = withParams(url, config.params);
  }
  const request = new Request(url, {
    method: config.method || "get",
    headers: {
      "Content-Type": "application/json",
      accept: "application/vnd.github.v3+json",
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  });
  if (config.accessToken) {
    request.headers.set("authorization", `bearer ${config.accessToken}`);
  }
  const response = await fetch(request);
  if (response.ok) {
    const body = await response.json();
    const headers = response.headers;
    return { ok: response.ok, body, headers };
  } else {
    if (config.skipError) {
      return { ok: false, body: {} as RESB };
    } else {
      logError(request, response);
      return { ok: response.ok };
    }
  }
};

const logError = async (request: Request, response: Response) => {
  const contentType = response.headers.get("content-type");
  let body: any;
  if (contentType && contentType.indexOf("application/json") !== -1) {
    body = await response.json();
  } else {
    body = await response.text();
  }
  console.error(`Error requesting ${request.method} ${request.url}`, body);
};
