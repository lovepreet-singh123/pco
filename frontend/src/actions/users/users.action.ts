import { useForm, UseFormSetValue } from "react-hook-form";
import { useAllUsersQuery, useDeleteUserMutation, useDeleteUsersMutation } from "../../api/users/users.api";
import { useCallback, useEffect, useMemo } from "react";
import { API_STATUS } from "../../utils/constants";
import { useSearch, useUpdate } from "../../hooks/useSearch";
import Swal from "sweetalert2";
import { useDebouncedCallback } from "use-debounce";

const defaultValues = {
    search: "",
    role: "",
    permission: [],
    page: 1,
    limit: 10,
}
type FormValues = {
    search: string;
    role: string;
    permission: string[];
    page: number;
    limit: number;
}

const useUsers = () => {
    const { search } = useSearch();
    const update = useUpdate();
    const { setValue: setFormValue, reset, watch, } = useForm<FormValues>({
        defaultValues,
    });
    const query = watch();
    const { status, data, refetch, } = useAllUsersQuery(query);
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);

    const setValue: UseFormSetValue<FormValues> = useCallback((key, value) => {
        setFormValue(key, value);
        if (key !== "page") {
            setFormValue("page", 1);
        }
    }, [setFormValue])

    const handleReset = useCallback(() => {
        update("search", "", true);
        reset();
    }, [])

    useEffect(() => {
        if (search !== query.search) {
            setFormValue("search", search);
        }
    }, [search])

    return {
        data,
        loading,
        setValue,
        handleReset,
        query,
        refetch,
    }
}

export const useDeleteUser = (cb?: () => void) => {
    const [deleteUser, { status }] = useDeleteUserMutation();
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);
    const handleDeleteUser = useDebouncedCallback((id: string) => {
        Swal.fire({
            title: "Do you want to delete the user?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteUser({ id }).unwrap();
                    if (cb) {
                        cb();
                    }
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        })
    }, 300);

    return { handleDeleteUser, loading };
}
export const useDeleteUsers = (cb?: () => void) => {
    const [deleteUsers, { status }] = useDeleteUsersMutation();
    const loading = useMemo(() => status === API_STATUS.PENDING, [status]);
    const handleDeleteUsers = useDebouncedCallback((ids: string[]) => {
        Swal.fire({
            title: "Do you want to delete the users?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteUsers({ ids }).unwrap();
                    if (cb) {
                        cb();
                    }
                } catch (error) {
                    console.log('error: ', error);
                }
            }
        })
    }, 300);

    return { handleDeleteUsers, loading };
}

export default useUsers;