import { useCallback, useEffect, useMemo } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { useAllUsersQuery } from "../../api/users/users.api";
import { useSearch, useUpdate } from "../../hooks/useSearch";
import { API_STATUS } from "../../utils/constants";

const defaultValues = {
    role: "",
    page: 1,
    search: "",
}
type FormValues = typeof defaultValues;

export const useRoleManagement = () => {
    const handleUpdate = useUpdate();
    const { search } = useSearch();
    const { watch, setValue: setFormValue, reset, } = useForm<FormValues>({
        defaultValues,
    });
    const query = watch();
    const { data, status, refetch, } = useAllUsersQuery(query);
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);

    const setValue: UseFormSetValue<FormValues> = useCallback((key, value) => {
        setFormValue(key, value);
        if (key !== "page") {
            setFormValue("page", 1);
        }
    }, [setFormValue]);

    const handleReset = useCallback(() => {
        handleUpdate("search", "", true);
        reset();
    }, [])

    useEffect(() => {
        if (search !== query.search) {
            setValue("search", search);
        }
    }, [search])

    return {
        query,
        setValue,
        handleReset,
        refetch,
        data,
        loading
    }
}