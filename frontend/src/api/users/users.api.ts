import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../utils/service";
import { API } from "../../utils/constants";

type getUsersParams = {
    search?: string,
    role?: string,
    permissions?: string[],
    page?: number,
    limit?: number,
}
type userType = {
    _id: string,
    username: string,
    email: string,
    name: string,
    role: number,
    permissions: string[],
}
type getUsersResponse = {
    total: number;
    page: number;
    limit: number;
    users: userType[]
}
type updateUserParams = {
    email: string,
    name: string,
    username: string,
    id: string,
}
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery,
    endpoints: builder => ({
        allUsers: builder.query<getUsersResponse, getUsersParams>({
            query: ({ search, limit, page, permissions, role }) => {
                let query = `?page=${page}`;
                if (limit) {
                    query += `&limit=${limit}`;
                }
                if (search) {
                    query += `&search=${search}`;
                }
                if (permissions && permissions.length > 0) {
                    query += `&permission=${permissions.join(",")}`;
                }
                if (role) {
                    query += `&role=${role}`;
                }
                return ({
                    url: `${API.USERS}${query}`,
                })
            }
        }),
        createUser: builder.mutation<userType, Omit<userType, "_id"> & { password: string }>({
            query: (data) => ({
                url: API.USERS,
                method: "POST",
                body: data,
            })
        }),
        user: builder.query<userType, { id: string }>({
            query: ({ id }) => ({
                url: API.USER.replace(":id", id),
            })
        }),
        updateRole: builder.mutation<userType, { id: string, role: number }>({
            query: ({ id, role }) => ({
                url: API.UPDATE_ROLE.replace(":id", id),
                body: { role },
                method: "PUT",
            })
        }),
        updatePermissions: builder.mutation<userType, { id: string, permissions: string[] }>({
            query: ({ id, permissions }) => ({
                url: API.UPDATE_PERMISSIONS.replace(":id", id),
                body: { permissions },
                method: "PUT",
            })
        }),
        updateUser: builder.mutation<userType, updateUserParams>({
            query: ({ id, ...data }) => ({
                url: API.USER.replace(":id", id),
                body: data,
                method: "PUT",
            })
        }),
        deleteUser: builder.mutation<userType, { id: string }>({
            query: ({ id }) => ({
                url: API.USER.replace(":id", id),
                method: "DELETE",
            })
        }),
        deleteUsers: builder.mutation<userType, { ids: string[] }>({
            query: ({ ids }) => ({
                url: API.USERS,
                method: "DELETE",
                body: { ids },
            })
        }),
    })
})
export const { useAllUsersQuery, useCreateUserMutation, useUserQuery, useDeleteUserMutation, useUpdateUserMutation, useDeleteUsersMutation, useUpdatePermissionsMutation, useUpdateRoleMutation, useLazyUserQuery, } = userApi;