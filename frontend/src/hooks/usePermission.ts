import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../redux/store";
import { PERMISSIONS, ROLE } from "../utils/constants";

export const permissions = {
    1: [
        `${PERMISSIONS.PRODUCTS}:edit`,
        `${PERMISSIONS.PRODUCTS}:view`,
        `${PERMISSIONS.PRODUCTS}:delete`,
        `${PERMISSIONS.PRODUCTS}:create`,
        `${PERMISSIONS.ROLE_MANAGEMENT}:edit`,
        `${PERMISSIONS.ROLE_MANAGEMENT}:view`,
        `${PERMISSIONS.USER_MANAGEMENT}:edit`,
        `${PERMISSIONS.USER_MANAGEMENT}:view`,
        `${PERMISSIONS.USER_MANAGEMENT}:delete`,
        `${PERMISSIONS.USER_MANAGEMENT}:create`,
        `${PERMISSIONS.PERMISSION_MANAGEMENT}:edit`,
        `${PERMISSIONS.PERMISSION_MANAGEMENT}:view`
    ],
    2: [
        `${PERMISSIONS.PRODUCTS}:edit`,
        `${PERMISSIONS.PRODUCTS}:view`,
        `${PERMISSIONS.ROLE_MANAGEMENT}:view`,
        `${PERMISSIONS.USER_MANAGEMENT}:edit`,
        `${PERMISSIONS.USER_MANAGEMENT}:view`,
        `${PERMISSIONS.PERMISSION_MANAGEMENT}:edit`,
        `${PERMISSIONS.PERMISSION_MANAGEMENT}:view`
    ],
    3: [
        `${PERMISSIONS.PRODUCTS}:view`,
        `${PERMISSIONS.USER_MANAGEMENT}:view`,
        `${PERMISSIONS.ROLE_MANAGEMENT}:view`,
        `${PERMISSIONS.PERMISSION_MANAGEMENT}:view`,
    ],
}
type permissionsOf = keyof typeof PERMISSIONS;
const usePermissions = (type: permissionsOf) => {
    const { role, permissions: modulePermissions } = useAppSelector(state => state.user);
    const [permission, setPermission] = useState({
        canEdit: false,
        canView: false,
        canDelete: false,
        canCreate: false,
    });
    const modulePermissionsSet = useMemo(() => new Set(modulePermissions), [modulePermissions]);

    const getPermissions = useCallback(() => {
        const modulePermission = role === ROLE.ADMIN ? true : modulePermissionsSet.has(type);

        if (modulePermission) {
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