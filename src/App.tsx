import React, { useState, useEffect } from "react";
import "./App.css";
import { FilterGroup } from "./components/FilterGroup";
import { ISortColumn, TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { Paginator } from "./components/Paginator";
import { IssueDataFromServer } from "./types/issue";
import { getIssues, getIssuesByIds } from "./services/issuesData";
import { PAGE_SIZE } from "./config/appSettings";
import { sortBy } from "./utils/sort";
import { BookmarksType } from "./types/types";
import { LinearProgress } from "@material-ui/core";
import { loadFromStorage, saveToStorage } from "./services/localStorage";
import { InputForm } from "./components/InputForm";
import { checkRepository } from "./services/reposData";
import { Provider, useSelector, useDispatch } from "react-redux";
import store, { RootState } from "./store/configureStore";
import { apiCallBegan } from "./store/middleware/api";
import { issuesReceived } from "./store/issues";
import { addQueryParams, makeIssuesUrl } from "./utils/url";
import { setActivePage } from "./store/paginator";
import { setIssuesFilter } from "./store/issuesFilter";
import { setSortColumn } from "./store/sortColumn";

function App() {
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarksType>({});
  const dispatch = useDispatch();
  const { repositoryValid, full_name: repositoryFullName } = useSelector(
    (state: RootState) => state.repository
  );
  const pageIssues = useSelector((state: RootState) => state.issues.list);
  const { activePage } = useSelector((state: RootState) => state.paginator);
  const { selectedFilter } = useSelector(
    (state: RootState) => state.issuesFilter
  );
  const sortColumnParams = useSelector((state: RootState) => state.sortColumn);

  // TODO temp substitution
  const setPageIssues = (issues: any) => {};
  const setIssueStateFilter = (str: string) => {};
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const createPageOfBookmarks = () => {
    if (!repositoryFullName) return;

    const ids = Object.keys(bookmarks);

    setLoading(true);
    getIssuesByIds(repositoryFullName, ids)
      .then((result) => {
        // const pageCount = Math.ceil(result.length / PAGE_SIZE);
        // setLastPage(pageCount);
        const sortedIssues = sortBy(result, sortColumnParams);
        const startIndex = (activePage - 1) * PAGE_SIZE;
        const pageSlice = sortedIssues.slice(
          startIndex,
          startIndex + PAGE_SIZE
        );
        setPageIssues(pageSlice);
      })
      .catch((error: Error) => console.error(error.message))
      .finally(() => setLoading(false));
  };

  const createPage = () => {
    if (!repositoryFullName) return;

    const params = {
      page: activePage.toString(),
      state: selectedFilter,
      per_page: PAGE_SIZE,
      ...sortColumnParams,
    };

    let fullUrl = makeIssuesUrl(repositoryFullName);
    fullUrl = addQueryParams(fullUrl, params);
    console.log(fullUrl);

    dispatch(
      apiCallBegan({
        url: fullUrl,
        onSuccess: issuesReceived.type,
      })
    );
  };

  useEffect(() => {
    console.log("active page changed");
    if (!repositoryFullName || !repositoryValid) return;
    selectedFilter === "bookmarked" ? createPageOfBookmarks() : createPage();
  }, [activePage, selectedFilter, sortColumnParams]);

  // this is effect needed to reflect bookmark changes on "bookmarked"
  useEffect(() => {
    selectedFilter === "bookmarked" && createPageOfBookmarks();
    if (repositoryFullName)
      saveToStorage(repositoryFullName, Object.keys(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (repositoryFullName) {
      dispatch(setActivePage(1));
      dispatch(setIssuesFilter("all"));
      dispatch(setSortColumn({ sort: "created", direction: "desc" }));

      const result = loadFromStorage(repositoryFullName);
      if (result) {
        let loadedBookmarks: BookmarksType = {};
        result.forEach((key: string) => (loadedBookmarks[key] = true));
        setBookmarks(loadedBookmarks);
      } else {
        setBookmarks({});
      }
    }
  }, [repositoryFullName]);

  const handleGroupSelect = (selection: string) => {
    if (selectedFilter === selection) return;
    setIssueStateFilter(selection);
    // setActivePage(1);
  };

  const handleToggleBookmark = (issueNumber: string) => {
    if (issueNumber in bookmarks) {
      delete bookmarks[issueNumber];
      setBookmarks(Object.assign({}, bookmarks));
    } else setBookmarks({ ...bookmarks, [issueNumber]: true });
  };

  return (
    <div className="px-4">
      <h1 className="text-red-800 text-center font-bold p-4 mb-3 text-2xl">
        Github Repository Issues Viewer
      </h1>

      <InputForm disabled={loading} />

      <div className="grid grid-cols-12 gap-4">
        <FilterGroup className="col-span-2" />

        <div className="col-span-10">
          <table className="w-full">
            <TableHeader />
            {!loading && repositoryValid && (
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

          {!loading && pageIssues.length ? (
            <Paginator className="pt-3" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
