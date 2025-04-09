import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../redux/store";
import { ENV } from "./constants";

export const baseQuery = fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
    prepareHeaders: (headers, api) => {
        const { role } = (api.getState() as RootState).user;
        headers.set("Authorization", String(role))
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        return headers;
    },
})