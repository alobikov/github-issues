import { IParams } from "../store/sagas/actions";

export function makeIssuesUrl(full_name: string) {
  return `/repos/${full_name}/issues`;
}

export function addQueryParams(url: string, params: IParams) {
  let newUrl = url;
  newUrl = Object.entries(params).reduce((a, c, i) => {
    const amp = i > 0 ? "&" : "";
    return a + amp + `${c[0]}=${c[1]}`;
  }, newUrl + "?");
  return newUrl;
}

export function makeIssuesUrls(full_name: string, ids: string[]) {
  return ids.map((id: string) => makeIssuesUrl(full_name) + `/${id}`);
}
