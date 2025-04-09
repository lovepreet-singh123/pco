import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useDebouncedCallback } from "use-debounce";
import { useDeleteProductMutation } from "../../api/products/products.api";
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
            search,
        },
    })

    useEffect(() => {
        setValue("search", search);
    }, [search, setValue])

    const handlePage = useCallback((page: number) => setValue("page", page), [setValue])

    return {
        handlePage,
        values: watch(),
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
                    console.log('cb: ', cb);
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
export default useFilter;