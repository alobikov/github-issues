import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import axios from "axios";
import { gitApiUrl } from "../../config/appSettings";
import { RootState } from "../configureStore";
import { AnyPtrRecord } from "dns";
import { setLastPage } from "../paginator";
import extractLastPage from "../../utils/extractLastPage";

export const apiCallBegan = createAction<any>("api/callBegan");
export const apiCallSuccess = createAction<any>("api/callSuccess");
export const apiCallFailed = createAction<any>("api/callFailed");

const api =
  ({ dispatch }: { dispatch: any }) =>
  (next: any) =>
  async (action: any) => {
    if (action.type !== apiCallBegan.type) return next(action);
    next(action);
    const { url, method, data, onSuccess, onError } = action.payload;
    console.log("api call began", action);

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
      console.log(response.data);
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
  };

export default api;
