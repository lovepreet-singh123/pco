import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";

export const permissions = {
    1: ["product:edit", "product:view", "product:delete", "product:create"],
    2: ["product:view"],
    3: ["product:edit", "product:view"],
}

const usePermissions = (type: string) => {
    const { role } = useAppSelector(state => state.user);
    const [permission, setPermission] = useState({
        canEdit: false,
        canView: false,
        canDelete: false,
        canCreate: false,
    });

    const getPermissions = useCallback(() => {
        if (role) {
            const permissionSet = new Set(permissions[role as keyof typeof permissions]);
            setPermission(() => ({
                canEdit: permissionSet.has(`${type}:edit`),
                canView: permissionSet.has(`${type}:view`),
                canDelete: permissionSet.has(`${type}:delete`),
                canCreate: permissionSet.has(`${type}:create`),
            }))
        }
    }, [role, type])

    useEffect(() => {
        getPermissions();
    }, [getPermissions])

    return permission;
}
export default usePermissions;