import React, { useState, useEffect } from "react";
import "./App.css";
import { ListGroup } from "./components/ListGroup";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { Paginator } from "./components/Paginator";
import { IssueDataFromServer } from "./types/issue";
import { OrgRepoInputForm } from "./components/OrgRepoInputForm";
import { getIssues, getIssuesByIds, IRepository } from "./services/issuesData";
import { PAGE_SIZE } from "./config/appSettings";
import { sortBy } from "./utils/sort";
import { BookmarksType } from "./types/types";
import { LinearProgress } from "@material-ui/core";

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

function App() {
  const [loading, setLoading] = useState(false);
  const [issueStateFilter, setIssueStateFilter] = useState("all");
  const [sortColumnParams, setSortColumnParams] = useState<ISortColumn>({
    sort: "created",
    direction: "desc",
  });
  const [activePage, setActivePage] = useState(1);
  const [pageIssues, setPageIssues] = useState<IssueDataFromServer[] | []>([]);
  const [bookmarks, setBookmarks] = useState<BookmarksType>({});
  const [lastPage, setLastPage] = useState<number>(1);
  const [repository, setRepository] = useState<IRepository | null>(null);

  const createPageOfBookmarks = () => {
    if (!repository) return;

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
  };

  const createPage = () => {
    if (!repository) return;

    const params = {
      page: activePage.toString(),
      state: issueStateFilter,
      ...sortColumnParams,
    };

    setLoading(true);
    getIssues(repository, params)
      .then((result) => {
        if (result) {
          const { issues, lastPage } = result;
          setLastPage(Number(lastPage));
          setPageIssues(issues);
        }
      })
      .catch((error: Error) => console.error(error.message))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!repository) return;
    issueStateFilter === "bookmarked" ? createPageOfBookmarks() : createPage();
  }, [activePage, issueStateFilter, sortColumnParams, repository]);

  useEffect(() => {
    issueStateFilter === "bookmarked" && createPageOfBookmarks();
  }, [bookmarks]);

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

  const handleToggleBookmark = (issueNumber: string) => {
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
        <h1 className="text-red-800 text-center font-bold p-4 text-2xl">
          Github Repository Issues Viewer
        </h1>
      </header>
      <OrgRepoInputForm onChange={handleRepoInput} disabled={loading} />
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
            {!loading && (
              <TableBody
                items={pageIssues}
                bookmarks={bookmarks}
                toggleBookmark={handleToggleBookmark}
              />
            )}
          </table>
          {loading && (
            <div className="pt-6">
              <LinearProgress />
            </div>
          )}

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
