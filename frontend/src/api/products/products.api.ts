import { createApi } from "@reduxjs/toolkit/query/react";
import { createProductType } from "../../actions/product/product.action";
import { API } from "../../utils/constants";
import { baseQuery } from "../../utils/service";

type productType = {
    _id: string,
    name: string
    description: string
    status: string,
    stock: number,
    isPremium: boolean,
    rating: number,
    price: number,
    category: string,
    tags: string[],
    createdAt: string,
    updatedAt: string,
};
type getProductsResponse = {
    total: number,
    page: number,
    limit: number,
    products: productType[],
}

type getProductsParams = {
    categories?: string[],
    status?: string,
    is_premium?: boolean,
    in_stock?: boolean,
    min_price?: number,
    max_price?: number,
    rating?: number,
    tags?: string[],
    page?: number,
    limit?: number,
    search?: string,
}

export const productsApi = createApi({
    reducerPath: "products",
    keepUnusedDataFor: 0,
    baseQuery: baseQuery,
    endpoints: builder => ({
        getProducts: builder.query<getProductsResponse, getProductsParams>({
            query: ({ categories, search, in_stock, is_premium, limit, max_price, min_price, page = 1, rating, status, tags }) => {
                let query = `?page=${page}`;

                if (search) {
                    query += `&search=${search}`;
                }

                if (categories && categories.length > 0) {
                    query += `&categories=${categories.join(",")}`;
                }
                if (in_stock) {
                    query += `&in_stock=${in_stock}`;
                }
                if (is_premium) {
                    query += `&is_premium=${is_premium}`;
                }
                if (limit) {
                    query += `&limit=${limit}`;
                }
                if (max_price) {
                    query += `&max_price=${max_price}`;
                }
                if (min_price) {
                    query += `&min_price=${min_price}`;
                }
                if (rating) {
                    query += `&rating=${rating}`;
                }
                if (status) {
                    query += `&status=${status}`;
                }
                if (tags && tags.length > 0) {
                    query += `&tags=${tags.join(",")}`;
                }
                return {
                    url: `${API.PRODUCTS}${query}`,
                }
            }
        }),
        getProduct: builder.query<productType, { id: string }>({
            query: ({ id }) => ({
                url: API.PRODUCT.replace(":id", id),
            })
        }),
        createProduct: builder.mutation<productType, createProductType>({
            query: (data) => ({
                url: API.CREATE_PRODUCT,
                method: "POST",
                body: data,
            })
        }),
        updateProduct: builder.mutation<productType, createProductType & { id: string }>({
            query: ({ id, ...data }) => ({
                url: API.UPDATE_PRODUCT.replace(":id", id),
                method: "PUT",
                body: data,
            })
        }),
        deleteProduct: builder.mutation<object, { id: string }>({
            query: ({ id }) => ({
                url: API.DELETE_PRODUCT.replace(":id", id),
                method: "DELETE",
            })
        }),
        deleteProducts: builder.mutation<object, { ids: string[] }>({
            query: ({ ids }) => ({
                url: API.DELETE_PRODUCTS,
                method: "DELETE",
                body: {ids},
            })
        }),
    })
})
export const { useGetProductsQuery, useDeleteProductsMutation, useDeleteProductMutation, useGetProductQuery, useLazyGetProductQuery, useCreateProductMutation, useUpdateProductMutation, } = productsApi;