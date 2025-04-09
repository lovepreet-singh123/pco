import { useForm } from "react-hook-form"
import { PRICE } from "../../utils/constants";
import { useCallback, useEffect } from "react";
import { useSearch } from "../../hooks/useSearch";

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
export default useFilter;