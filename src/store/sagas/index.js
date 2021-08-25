import { takeEvery, fork, call, put, all } from "@redux-saga/core/effects";
import {
  setRepositoryValid,
  setRepositoryResponse,
  setRepository,
} from "../repository";
import { gitApiUrl } from "../../config/appSettings";
import { makeIssuesUrl, addQueryParams } from "../../utils/url";
import {
  clearIssues,
  issuesReceived,
  issuesRequested,
  oneIssueReceived,
  stopLoading,
} from "../issues";
import { loadIssues, loadRepos, loadIssuesByIds } from "./actions";

async function getApi(path) {
  try {
    const result = await fetch(gitApiUrl + path, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/vnd.github.v3+json",
      },
    });
    const json = await result.json();
    return json;
  } catch (e) {
    console.error(e);
  }
}

export function* loadReposData(full_name) {
  const reposPath = `/repos/${full_name}`;
  const repos = yield call(getApi, reposPath);
  yield put(setRepositoryValid(!repos.message));
  if (repos.message) {
    yield put(setRepositoryResponse(repos.message));
  } else {
    yield put(setRepository({ full_name }));
  }
}

function* loadIssuesData(payload) {
  const { repositoryFullName, params } = payload;
  let path = makeIssuesUrl(repositoryFullName);
  path = addQueryParams(path, params);
  yield put(issuesRequested());
  const issues = yield call(getApi, path);
  yield put(issuesReceived(issues));
}

function* loadIssue(url) {
  console.log("load issue: ", url);
  const issue = yield call(getApi, url);
  yield put(oneIssueReceived(issue));
}

function* loadIssuesByIdsData({ urls }) {
  yield put(issuesRequested());
  yield put(clearIssues());
  console.log(urls);
  yield all(urls.map((url) => call(loadIssue, url)));
  yield put(stopLoading());
}

export function* workerLoadIssuesSaga(action) {
  yield call(loadIssuesData, action.payload);
}

export function* workerLoadIssuesByIdsSaga(action) {
  yield call(loadIssuesByIdsData, action.payload);
}

export function* workerLoadReposSaga(action) {
  console.log(action.payload);
  yield call(loadReposData, action.payload);
}

export function* watchLoadIssuesSaga() {
  yield takeEvery(loadIssues().type, workerLoadIssuesSaga);
}

export function* watchLoadIssuesByIdsSaga() {
  yield takeEvery(loadIssuesByIds().type, workerLoadIssuesByIdsSaga);
}

export function* watchLoadReposSaga() {
  yield takeEvery(loadRepos().type, workerLoadReposSaga);
}

export default function* rootSaga() {
  yield fork(watchLoadIssuesSaga);
  yield fork(watchLoadReposSaga);
  yield fork(watchLoadIssuesByIdsSaga);
}
