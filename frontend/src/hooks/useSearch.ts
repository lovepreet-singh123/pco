import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export const useSearch = <T extends Record<string, string>>(): T => {
    const location = useLocation();
    const values = useMemo(() => {
        const search = new URLSearchParams(location.search);
        const result = {} as T;
        Array.from(search.entries()).forEach(([key, value]) => {
            result[key as keyof T] = value as T[keyof T];
        });
        return result;
    }, [location.search]);
    return values;
}


export const useUpdate = () => {
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const handleUpdate = (key: string, value: string, removeEmpty: boolean = true) => {
        const params = new URLSearchParams(search);
        params.set(key, value);
        if (removeEmpty && value.length === 0) {
            params.delete(key);
        }
        navigate(`${pathname}?${params.toString()}`);
    }
    return handleUpdate;

}