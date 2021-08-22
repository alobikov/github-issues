import parseLink from "parse-link-header";

export default function extractLastPag(headers: Headers): number {
  const link = new Headers(headers).get("link");
  if (!link) return 1;
  const result = parseLink(link)?.last?.page || "1";
  return Number(result); // if no Link in the header return 1
}
