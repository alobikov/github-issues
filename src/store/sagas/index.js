import { takeEvery, fork } from "@redux-saga/core/effects";

export function* workerLoadDataSaga() {
  yield console.log("worker saga");
}

export function* watchLoadDataSaga() {
  yield takeEvery("LOAD_DATA", workerLoadDataSaga);
}

export default function* rootSaga() {
  console.log("root saga");
  yield fork(watchLoadDataSaga);
}
