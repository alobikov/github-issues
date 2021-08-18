import fetchc from "cross-fetch"
import { IIssue } from "../types/issue"

export const loadAll = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github.v3+json",
    },
  })
  if (response.ok) {
    const data: IIssue[] = await response.json()
    const link: string = response.headers.get("link") || ""
    return { data, link }
  } else {
    throw new Error("Network response not OK")
  }
}

const loadId = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github.v3+json",
    },
  })
  if (response.ok) {
    const data: {} = await response.json()
    const link: string = response.headers.get("link") || ""
    return data as IIssue
  } else {
    throw new Error("Network response not OK")
  }
}

export const loadIds = async (url: string, ids: number[]) => {
  return Promise.all(
    ids.map(async (id) => {
      const fullUrl = `${url}/${id.toString()}`
      const data = await loadId(fullUrl)
      return data as IIssue
    })
  )
}
