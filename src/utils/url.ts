export function makeIssuesUrl(url: string) {
  return `/repos/${url}/issues`;
}

export function addQueryParams(
  url: string,
  params: { [key: string]: string | number }
) {
  let newUrl = url;
  newUrl = Object.entries(params).reduce((a, c, i) => {
    const amp = i > 0 ? "&" : "";
    return a + amp + `${c[0]}=${c[1]}`;
  }, newUrl + "?");
  return newUrl;
}
