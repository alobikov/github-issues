import React, { useState } from "react";
import "./App.css";
import { ListGroup } from "./components/ListGroup";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { Paginator } from "./components/Paginator";
import { IssuesDataFromServer } from "./types/issue";
import { OrgRepoInputForm } from "./components/OrgRepoInputForm";
import { getIssues, getIssuesByIds } from "./services/issuesData";
import { PAGE_SIZE } from "./config/appSettings";
import { TableSortLabel } from "@material-ui/core";
import { sortBy } from "./utils/sort";

const filterGroupItems = [
  { title: "All", state: "all" },
  { title: "Open", state: "open" },
  { title: "Closed", state: "closed" },
  { title: "Bookmarked", state: "bookmarked" },
];

const sortGroupItems = [
  { key: "title", title: "Title" },
  { key: "author", title: "Author" },
  { sort: "created", title: "Created At" },
  { sort: "updated", title: "Updated At" },
  { sort: "comments", title: "Comments" },
  { key: "bookmark", title: "" },
];

type SortKeyType = "created" | "updated" | "comments";

export interface ISortColumn {
  sort: SortKeyType;
  direction: "asc" | "desc";
}

interface IRepo {
  name: string;
  org: string;
}

interface IParams {
  [name: string]: string;
}

function App() {
  const [issueStateFilter, setIssueStateFilter] = useState("all");
  const [sortColumnParams, setSortColumnParams] = useState<ISortColumn>({
    sort: "created",
    direction: "desc",
  });
  const [activePage, setActivePage] = useState(1);
  const [pageIssues, setPageIssues] = useState<IssuesDataFromServer[] | []>([]);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [lastPage, setLastPage] = useState<number>(1);
  const [repository, setRepository] = useState<IRepo | null>(null);

  const filterOutPullRequests = (issues: {}[]) =>
    issues.filter((issue) => !issue.hasOwnProperty("pull_request"));

  const urlWithPath = (url: string, repository: IRepo | null) => {
    return `${url}/${repository?.org}/${repository?.name}/issues`;
  };

  const deps = [activePage, issueStateFilter, sortColumnParams, repository];

  React.useEffect(() => {
    const params = {
      page: activePage.toString(),
      state: issueStateFilter,
      ...sortColumnParams,
    };

    if (!repository) return;
    // function fetchAllIssues(url: string) {
    // return load<{}[]>(url)
    // {
    // const issues = result.data as IIssue[]
    // return { issues, link }
    // })
    // }

    if (issueStateFilter === "bookmarked") {
      const ids = Object.keys(bookmarks);
      getIssuesByIds(repository, ids)
        .then((result) => {
          const pageCount = Math.ceil(result.length / PAGE_SIZE);
          setLastPage(pageCount);
          const sortedIssues = sortBy(result, sortColumnParams);
          const startIndex = (activePage - 1) * PAGE_SIZE;
          const pageSlice = sortedIssues.slice(
            startIndex,
            startIndex + PAGE_SIZE
          );
          setPageIssues(pageSlice);
        })
        .catch((error: Error) => console.error(error.message));
    } else {
      getIssues(repository, params)
        .then((result) => {
          if (result) {
            const { issues, lastPage } = result;
            setLastPage(Number(lastPage));
            setPageIssues(issues);
          }
        })
        .catch((error: Error) => console.error(error.message));
    }

    return;
  }, deps);

  // React.useEffect(() => {
  //   async function fetchMyAPI() {
  //     try {
  //       const issues = await load<{}[]>(
  //         "https://api.github.com/repos/rails/rails/issues"
  //       )
  //       console.log(filterOutPullRequests(await issues.data))
  //       console.log(parseLink(issues.headers || ""))
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   // fetchMyAPI()
  //   return
  // }, [])

  const handleGroupSelect = (selection: string) => {
    if (issueStateFilter === selection) return;
    setIssueStateFilter(selection);
    setActivePage(1);
  };

  const handleSort = (sort: SortKeyType) => {
    setActivePage(1);
    if (sort === sortColumnParams.sort)
      return setSortColumnParams({
        ...sortColumnParams,
        direction: sortColumnParams.direction === "asc" ? "desc" : "asc",
      });
    setSortColumnParams({ sort, direction: "desc" });
  };

  const handlePageSelect = (_: {}, idx: number) => {
    if (activePage === idx) return;
    console.log(idx);
    setActivePage(idx);
  };

  const handleToggleBookmark = (issueNumber: number) => {
    if (issueNumber in bookmarks) {
      delete bookmarks[issueNumber];
      setBookmarks(Object.assign({}, bookmarks));
    } else setBookmarks({ ...bookmarks, [issueNumber]: true });
  };

  const handleRepoInput = ({ repo, org }: { repo: string; org: string }) => {
    setRepository({ name: repo, org });
  };

  return (
    <div className="px-4">
      <header>
        <h1 className="text-red-800 text-center p-4 text-lg">
          Github Repository Dashboard
        </h1>
      </header>
      <OrgRepoInputForm onChange={handleRepoInput} />
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
              sortColumn={sortColumnParams}
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
  );
}

export default App;
