import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import axios from "axios";
import { gitApiUrl } from "../../config/appSettings";
import { RootState } from "../configureStore";
import { AnyPtrRecord } from "dns";
import { setLastPage } from "../paginator";
import extractLastPage from "../../utils/extractLastPage";
import { issuesRequested, stopLoading } from "../issues";

export const apiCallBegan = createAction<any>("api/callBegan");
export const apiCallLoopBegan = createAction<any>("api/callLoopBegan");
export const apiCallSuccess = createAction<any>("api/callSuccess");
export const apiCallFailed = createAction<any>("api/callFailed");

const api =
  ({ dispatch }: { dispatch: any }) =>
  (next: any) =>
  async (action: any) => {
    if (action.type === apiCallBegan.type) {
      const { url, method, data, onSuccess, onError, onStart } = action.payload;

      if (onStart) dispatch({ type: onStart });
      next(action);

      try {
        const response = await axios.request({
          baseURL: gitApiUrl,
          headers: {
            "Content-Type": "application/json",
            accept: "application/vnd.github.v3+json",
          },
          url,
          method,
          data,
        });
        dispatch(apiCallSuccess(response.data));
        // const lastPage = new Headers(response.headers).get("link");
        // console.log("lastpage:", response.headers);
        dispatch(setLastPage(extractLastPage(response.headers)));
        //specific success handler is specified in ApiCallBegan
        onSuccess && dispatch({ type: onSuccess, payload: response.data });
      } catch (error) {
        dispatch(apiCallFailed(error));
        // specific error handler if specified in ApiCallBegan action
        onError && dispatch({ type: onError, payload: error });
      }
      return;
    }
    if (action.type === apiCallLoopBegan.type) {
      const { urls, method, data, onSuccess, onError, onStart } =
        action.payload;
      if (onStart) dispatch({ type: onStart });
      next(action);
      urls.forEach(async (url: string) => {
        try {
          const response = await axios.request({
            baseURL: gitApiUrl,
            headers: {
              "Content-Type": "application/json",
              accept: "application/vnd.github.v3+json",
            },
            url,
            method,
            data,
          });
          onSuccess: dispatch({ type: onSuccess, payload: response.data });
        } catch (error) {
          dispatch(apiCallFailed(error.message));
          console.log(error);
          // specific error handler if specified in ApiCallBegan action
          onError && dispatch({ type: onError, payload: error.message });
        } finally {
          console.log("finally");
          dispatch(stopLoading());
        }
      });
      return;
    }
    return next(action);
  };

export default api;
