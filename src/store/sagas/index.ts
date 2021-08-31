import {
  takeEvery,
  fork,
  call,
  put,
  all,
  select,
} from "@redux-saga/core/effects";
import * as repositoryActions from "../slices/repository";
import * as issueActions from "../slices/issues";
import * as sagaActions from "./actions";
import * as paginator from "../slices/paginator";
import { LoadIssuesParams } from "./actions";
import { makeIssuesUrl, addQueryParams } from "../../utils/url";
import { PayloadAction } from "@reduxjs/toolkit";
import getApi from "../../services/http";
import extractLastPag from "../../utils/extractLastPage";
import { PAGE_SIZE } from "../../config/appSettings";

const actions = {
  ...repositoryActions,
  ...issueActions,
  ...paginator,
  ...sagaActions,
};

export function* loadReposData(full_name: string): any {
  const reposPath = `/repos/${full_name}`;
  try {
    const [repos, headers] = yield call(getApi, reposPath);
    yield put(actions.setRepositoryValid(!repos.message));
    if (repos.message) {
      yield put(
        actions.setRepositoryResponse(`Repository error: ${repos.message}`)
      );
    } else {
      yield put(actions.setRepository({ full_name }));
      yield put(actions.setRepositoryResponse(""));
    }
  } catch (e) {
    yield put(actions.stopLoading());
    yield put(actions.setRepositoryResponse(`Network Error: ${e.message}`));
  }
}

function* loadIssuesData(payload: LoadIssuesParams): any {
  const { repositoryFullName, params } = payload;
  let path = makeIssuesUrl(repositoryFullName);
  path = addQueryParams(path, params);
  yield put(actions.issuesRequested());
  try {
    const [issues, headers] = yield call(getApi, path);
    const lastPage = extractLastPag(headers);
    yield put(actions.setLastPage(lastPage));
    yield put(actions.issuesReceived(issues));
    yield put(actions.setRepositoryResponse(""));
  } catch (e) {
    yield put(actions.stopLoading());
    yield put(actions.setRepositoryResponse(`Network Error: ${e.message}`));
  }
}

function* loadIssue(url: string): any {
  try {
    const [issue, headers] = yield call(getApi, url);
    yield put(actions.oneIssueReceived(issue));
    yield put(actions.setRepositoryResponse(""));
  } catch (e) {
    yield put(actions.stopLoading());
    yield put(actions.setRepositoryResponse(`Network Error: ${e.message}`));
  }
}

function* loadIssuesByIdsData({ urls }: { urls: string[] }): any {
  yield put(actions.issuesRequested());
  yield put(actions.clearIssues());
  yield all(urls.map((url: string) => call(loadIssue, url)));
  const { list } = yield select((state) => state.issues);
  yield put(actions.setLastPage(Math.ceil(list.length / PAGE_SIZE)));
  yield put(actions.stopLoading());
}

export function* workerLoadIssues(action: PayloadAction<any>) {
  yield call(loadIssuesData, action.payload);
}

export function* workerLoadIssuesByIds(action: PayloadAction<any>) {
  yield call(loadIssuesByIdsData, action.payload);
}

export function* workerLoadRepos(action: PayloadAction<any>) {
  yield call(loadReposData, action.payload);
}

export function* watchLoadIssues() {
  yield takeEvery(actions.loadIssues.type, workerLoadIssues);
}

export function* watchLoadIssuesByIds() {
  yield takeEvery(actions.loadIssuesByIds.type, workerLoadIssuesByIds);
}

export function* watchLoadRepos() {
  yield takeEvery(actions.loadRepos.type, workerLoadRepos);
}

export default function* rootSaga() {
  yield fork(watchLoadIssues);
  yield fork(watchLoadRepos);
  yield fork(watchLoadIssuesByIds);
}
