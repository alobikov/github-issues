import fetchc from "cross-fetch"

const load = async <T>(url: string) => {
  const response = await fetchc(url, {
    headers: { accept: "application/vnd.github.v3+json" },
  })
  if (response.ok) {
    const data = (await response.json()) as Promise<T>
    const headers = response.headers.get("link") || ""
    return { data, headers }
  } else {
    throw new Error("Network response not OK")
  }
}

export default load
