import React, { useState } from "react"
import "./App.css"
import { ListGroup } from "./components/ListGroup"
import { TableHeader } from "./components/TableHeader"
import { TableBody } from "./components/TableBody"
import { Paginator } from "./components/Paginator"
import load from "./services/api"
import parseLink from "parse-link-header"
import { IIssue } from "./types/issue"

let url = "https://api.github.com/repos/rails/rails/issues"

const filterGroupItems = [
  { title: "All Issues", state: "all" },
  { title: "Open Issues", state: "open" },
  { title: "Closed Issues", state: "closed" },
]

const sortGroupItems = [
  { key: "title", title: "Title" },
  { key: "author", title: "Author" },
  { sort: "created", title: "Created At" },
  { sort: "updated", title: "Updated At" },
  { sort: "comments", title: "Comments" },
  { key: "bookmark", title: "" },
]

interface ISortColumn {
  sort: string
  direction: "asc" | "desc"
}

function App() {
  const [issueStateFilter, setIssueStateFilter] = React.useState("all")
  const [sortColumn, setSortColumn] = React.useState<ISortColumn>({
    sort: "created",
    direction: "desc",
  })
  const [activePage, setActivePage] = React.useState(1)
  const [pageIssues, setPageIssues] = React.useState<IIssue[] | []>([])
  const [bookmarks, setBookmarks] = React.useState<Record<number, boolean>>({})
  const [lastPage, setLastPage] = React.useState<number>(1)

  const filterOutPullRequests = (issues: {}[]) =>
    issues.filter((issue) => !issue.hasOwnProperty("pull_request"))

  const addSortParams = (
    url: string,
    sortColumn: ISortColumn,
    activePage: number,
    issueStateFilter: string
  ): string => {
    let newUrl = new URL(url)
    Object.entries(sortColumn).forEach(([key, value]) => {
      newUrl.searchParams.set(key, value)
    })
    newUrl.searchParams.set("state", issueStateFilter)
    newUrl.searchParams.set("page", activePage.toString())
    return newUrl.toString()
  }
  React.useEffect(() => {
    async function fetchMyAPI() {
      try {
        const issues = await load<{}[]>(
          addSortParams(url, sortColumn, activePage, issueStateFilter)
        )
        const result = (await issues.data) as IIssue[]
        setPageIssues(result)
        const linkObj = parseLink(issues.headers || "")
        if (linkObj) setLastPage(Number(linkObj.last.page))
      } catch (error) {
        console.log(error)
      }
    }
    fetchMyAPI()
    return
  }, [activePage, issueStateFilter, sortColumn])

  React.useEffect(() => {
    async function fetchMyAPI() {
      try {
        const issues = await load<{}[]>(
          "https://api.github.com/repos/rails/rails/issues"
        )
        console.log(filterOutPullRequests(await issues.data))
        console.log(parseLink(issues.headers || ""))
      } catch (error) {
        console.log(error)
      }
    }
    // fetchMyAPI()
    return
  }, [])

  const handleGroupSelect = (selection: string) => {
    if (issueStateFilter === selection) return
    setIssueStateFilter(selection)
    setActivePage(1)
  }

  const handleSort = (sort: string) => {
    setActivePage(1)
    if (sort === sortColumn.sort)
      return setSortColumn({
        ...sortColumn,
        direction: sortColumn.direction === "asc" ? "desc" : "asc",
      })
    setSortColumn({ sort, direction: "desc" })
  }

  const handlePageSelect = (_: {}, idx: number) => {
    if (activePage === idx) return
    console.log(idx)
    setActivePage(idx)
  }

  const handleToggleBookmark = (issueNumber: number) => {
    if (issueNumber in bookmarks) {
      setBookmarks({ ...bookmarks, [issueNumber]: false })
    } else setBookmarks({ ...bookmarks, [issueNumber]: true })
  }

  return (
    <div className="px-4">
      <header>
        <h1 className="text-red-800 text-center p-4 text-lg">
          Github Repository Dashboard
        </h1>
      </header>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <ListGroup
            items={filterGroupItems}
            onSelect={handleGroupSelect}
            selectedItem={issueStateFilter}
          />
        </div>
        <div className="col-span-10">
          <table className="w-full">
            <TableHeader
              onSort={handleSort}
              sortColumn={sortColumn}
              items={sortGroupItems}
            />
            <TableBody
              items={pageIssues}
              bookmarks={bookmarks}
              toggleBookmark={handleToggleBookmark}
            />
          </table>

          <Paginator
            count={lastPage}
            active={activePage}
            onChange={handlePageSelect}
            className="pt-3"
          />
        </div>
      </div>
    </div>
  )
}

export default App
