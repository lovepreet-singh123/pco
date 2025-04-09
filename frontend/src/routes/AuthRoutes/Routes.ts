import { lazy } from "react";
import { ROUTES } from "../../utils/constants";
const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const PermissionManagement = lazy(() => import("../../pages/PermissionManagement/PermissionManagement"));
const Products = lazy(() => import("../../pages/Products/Products"));
const RoleManagement = lazy(() => import("../../pages/RoleManagement/RoleManagement"));
const UserManagement = lazy(() => import("../../pages/UserManagement/UserManagement"));

export const routes = [
    {
        name: "Dashboard",
        path: ROUTES.DASHBOARD,
        module: "DASHBOARD",
        Component: Dashboard,
    },
    {
        name: "Products",
        path: ROUTES.PRODUCTS,
        module: "PRODUCTS",
        Component: Products,
    },
    {
        name: "Role Management",
        path: ROUTES.ROLE_MANAGEMENT,
        module: "ROLE_MANAGEMENT",
        Component: RoleManagement,
    },
    {
        name: "User Management",
        path: ROUTES.USER_MANAGEMENT,
        module: "USER_MANAGEMENT",
        Component: UserManagement,
    },
    {
        name: "Permission Management",
        path: ROUTES.PERMISSION_MANAGEMENT,
        module: "PERMISSION_MANAGEMENT",
        Component: PermissionManagement,
    },
]