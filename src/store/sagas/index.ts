import { takeEvery, fork, call, put, all } from "@redux-saga/core/effects";
import * as repositoryActions from "../slices/repository";
import * as issueActions from "../slices/issues";
import * as sagaActions from "./actions";
import { LoadIssuesParams } from "./actions";
import { makeIssuesUrl, addQueryParams } from "../../utils/url";
import { PayloadAction } from "@reduxjs/toolkit";
import getApi from "../../services/http";

const actions = { ...repositoryActions, ...issueActions, ...sagaActions };

export function* loadReposData(full_name: string): any {
  const reposPath = `/repos/${full_name}`;
  const repos = yield call(getApi, reposPath);
  yield put(actions.setRepositoryValid(!repos.message));
  if (repos.message) {
    yield put(actions.setRepositoryResponse(repos.message));
  } else {
    yield put(actions.setRepository({ full_name }));
  }
}

function* loadIssuesData(payload: LoadIssuesParams): any {
  const { repositoryFullName, params } = payload;
  let path = makeIssuesUrl(repositoryFullName);
  path = addQueryParams(path, params);
  yield put(actions.issuesRequested());
  const issues = yield call(getApi, path);
  yield put(actions.issuesReceived(issues));
}

function* loadIssue(url: string): any {
  const issue = yield call(getApi, url);
  yield put(actions.oneIssueReceived(issue));
}

function* loadIssuesByIdsData({ urls }: { urls: string[] }): any {
  yield put(actions.issuesRequested());
  yield put(actions.clearIssues());
  yield all(urls.map((url: string) => call(loadIssue, url)));
  yield put(actions.stopLoading());
}

export function* workerLoadIssuesSaga(action: PayloadAction<any>) {
  yield call(loadIssuesData, action.payload);
}

export function* workerLoadIssuesByIdsSaga(action: PayloadAction<any>) {
  yield call(loadIssuesByIdsData, action.payload);
}

export function* workerLoadReposSaga(action: PayloadAction<any>) {
  yield call(loadReposData, action.payload);
}

export function* watchLoadIssuesSaga() {
  yield takeEvery(actions.loadIssues.type, workerLoadIssuesSaga);
}

export function* watchLoadIssuesByIdsSaga() {
  yield takeEvery(actions.loadIssuesByIds.type, workerLoadIssuesByIdsSaga);
}

export function* watchLoadReposSaga() {
  yield takeEvery(actions.loadRepos.type, workerLoadReposSaga);
}

export default function* rootSaga() {
  yield fork(watchLoadIssuesSaga);
  yield fork(watchLoadReposSaga);
  yield fork(watchLoadIssuesByIdsSaga);
}
