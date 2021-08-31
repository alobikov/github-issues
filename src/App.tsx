import { useState, useEffect } from "react";
import { FilterGroup } from "./components/FilterGroup";
import { TableHeader } from "./components/TableHeader";
import { TableBody } from "./components/TableBody";
import { Paginator } from "./components/Paginator";
import { PAGE_SIZE } from "./config/appSettings";
import { BookmarksType } from "./types/types";
import { LinearProgress } from "@material-ui/core";
import { loadFromStorage, saveToStorage } from "./services/localStorage";
import { InputForm } from "./components/InputForm";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { loadIssues, loadIssuesByIds } from "./store/sagas/actions";
import { makeIssuesUrls } from "./utils/url";
import { setActivePage, setLastPage } from "./store/slices/paginator";
import { setIssuesFilter } from "./store/slices/issuesFilter";
import { setSortColumn } from "./store/slices/sortColumn";
import "./App.css";
import { sortBy } from "./utils/sort";
import { IssueDataFromServer } from "./types/issue";

function App() {
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState<BookmarksType>({});

  // SELECTORS
  const { loading } = useSelector((state: RootState) => state.issues);
  const {
    repositoryValid,
    response,
    full_name: repositoryFullName,
  } = useSelector((state: RootState) => state.repository);
  const issues = useSelector((state: RootState) => state.issues.list);
  const { activePage } = useSelector((state: RootState) => state.paginator);
  const { selectedFilter } = useSelector(
    (state: RootState) => state.issuesFilter
  );
  const sortColumnParams = useSelector((state: RootState) => state.sortColumn);

  function slicePageAndSort(items: IssueDataFromServer[]) {
    if (selectedFilter !== "bookmarked") return issues; // sorting and pagination is made by backend
    const sortedItems = sortBy(items, sortColumnParams);
    const start = (activePage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }

  function sortIssues() {}

  const getPageOfIssuesByIds = (ids: string[]) => {
    if (!repositoryFullName) return;
    const urls = makeIssuesUrls(repositoryFullName, ids);
    dispatch(loadIssuesByIds({ urls }));
  };

  const getPageOfIssues = () => {
    if (!repositoryFullName) return;

    const params = {
      page: activePage.toString(),
      state: selectedFilter,
      per_page: PAGE_SIZE.toString(),
      ...sortColumnParams,
    };

    dispatch(loadIssues({ params, repositoryFullName }));
  };

  useEffect(() => {
    if (!repositoryFullName || !repositoryValid) return;
    selectedFilter === "bookmarked" ? sortIssues() : getPageOfIssues();
  }, [activePage, sortColumnParams]);

  useEffect(() => {
    selectedFilter === "bookmarked"
      ? getPageOfIssuesByIds(Object.keys(bookmarks))
      : getPageOfIssues();
  }, [selectedFilter]);

  // this is effect needed to reflect bookmark changes on "bookmarked"
  useEffect(() => {
    if (!repositoryFullName || !repositoryValid) return;
    selectedFilter === "bookmarked" &&
      getPageOfIssuesByIds(Object.keys(bookmarks));
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
            {!loading && repositoryValid && !response && (
              <TableBody
                items={slicePageAndSort(issues)}
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

          {true ? <Paginator className="pt-3" /> : null}
        </div>
      </div>
    </div>
  );
}

export default App;
