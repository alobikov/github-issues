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
import { setActivePage } from "./store/slices/paginator";
import { setIssuesFilter } from "./store/slices/issuesFilter";
import { setSortColumn } from "./store/slices/sortColumn";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = useState<BookmarksType>({});

  // SLECTORS
  const { loading } = useSelector((state: RootState) => state.issues);
  const { repositoryValid, full_name: repositoryFullName } = useSelector(
    (state: RootState) => state.repository
  );
  const pageIssues = useSelector((state: RootState) => state.issues.list);
  const { activePage } = useSelector((state: RootState) => state.paginator);
  const { selectedFilter } = useSelector(
    (state: RootState) => state.issuesFilter
  );
  const sortColumnParams = useSelector((state: RootState) => state.sortColumn);

  const getPageOfIds = (ids: string[]) => {
    if (!repositoryFullName) return;
    const urls = makeIssuesUrls(repositoryFullName, ids);
    dispatch(loadIssuesByIds({ urls }));
  };

  const getPageofIssues = () => {
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
    selectedFilter === "bookmarked"
      ? getPageOfIds(Object.keys(bookmarks))
      : getPageofIssues();
  }, [activePage, selectedFilter, sortColumnParams]);

  // this is effect needed to reflect bookmark changes on "bookmarked"
  useEffect(() => {
    selectedFilter === "bookmarked" && getPageOfIds(Object.keys(bookmarks));
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
