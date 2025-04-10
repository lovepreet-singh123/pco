import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useDebouncedCallback } from "use-debounce";
import { useDeleteProductMutation, useDeleteProductsMutation } from "../../api/products/products.api";
import { useSearch } from "../../hooks/useSearch";
import { API_STATUS, PRICE } from "../../utils/constants";

const useFilter = () => {
    const { search } = useSearch();
    const { watch, control, reset, setValue } = useForm({
        defaultValues: {
            page: 1,
            limit: 10,
            categories: [],
            tags: [],
            status: "",
            is_premium: false,
            in_stock: false,
            min_price: PRICE.MIN,
            max_price: PRICE.MAX,
            rating: 0,
            search: "",
        },
    })
    const values = watch();

    const handlePage = useCallback((page: number) => setValue("page", page), [setValue])

    useEffect(() => {
        if (search !== values.search) {
            setValue("search", search);
            setValue("page", 1);
        }
    }, [search, setValue])

    return {
        handlePage,
        values,
        setValue,
        reset,
        control,
    }
}

export const useDeleteProduct = (cb?: () => void) => {
    const [deleteProduct, { status: deletingProduct }] = useDeleteProductMutation();
    const loading = useMemo(() => deletingProduct === API_STATUS.PENDING, [deletingProduct]);

    const handleDelete = useDebouncedCallback((id: string) => {
        Swal.fire({
            title: "Do you want to delete the product?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct({ id }).unwrap();
                    if (cb) {
                        cb();
                    }
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        })
    }, 300);

    return {
        handleDelete,
        loading,
    };
}

export const useDeleteProducts = (cb?: () => void) => {
    const [deleteProducts, { status: deletingProducts }] = useDeleteProductsMutation();
    const loading = useMemo(() => deletingProducts === API_STATUS.PENDING, [deletingProducts]);

    const handleDeleteProducts = useDebouncedCallback((ids: string[]) => {
        Swal.fire({
            title: "Do you want to delete the products?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteProducts({ ids }).unwrap();
                    if (cb) {
                        cb();
                    }
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        })
    }, 300);

    return {
        handleDeleteProducts,
        loading,
    };
}

export default useFilter;