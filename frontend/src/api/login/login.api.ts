import { createApi } from "@reduxjs/toolkit/query/react";
import { API } from "../../utils/constants";
import { baseQuery } from "../../utils/service";

type loginResponse = {
    msg: string,
    user: {
        username: string,
        email: string,
        name: string,
        role: number,
        permissions: string[],
    }
}

export const loginApi = createApi({
    reducerPath: "login",
    baseQuery: baseQuery,
    endpoints: builder => ({
        logIn: builder.mutation<loginResponse, { username: string, password: string }>({
            query: (data) => ({
                url: API.LOGIN,
                method: "POST",
                body: data,
            })
        })
    })
})
export const { useLogInMutation } = loginApi;