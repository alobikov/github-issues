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

async function getApi(path: string) {
  const result = await fetch(gitApiUrl + path, {
    headers: {
      "Content-Type": "application/json",
      accept: "application/vnd.github.v3+json",
      Authorization: "token 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",
    },
  });
  const json = await result.json();
  const headers = result.headers;
  return [json, headers];
}

export default getApi;
