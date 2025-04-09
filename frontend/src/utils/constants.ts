export const ROUTES = {
    LOGIN: "/",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    ROLE_MANAGEMENT: "/role-management",
    USER_MANAGEMENT: "/user-management",
    PERMISSION_MANAGEMENT: "/permission-management",
}

export const STATUS_OPTIONS = [
    { value: "INACTIVE", label: "Inactive", },
    { value: "ARCHIVED", label: "Archived", },
    { value: "ACTIVE", label: "Active", },
]
export const CATEGORIES = [
    { value: "ELECTRONICS", label: "Electronics", },
    { value: "CLOTHING", label: "Clothing", },
    { value: "BOOKS", label: "Books", },
    { value: "HOME", label: "Home", },
    { value: "SPORTS", label: "Sports", },
]

export const TAGS = [
    { value: "NEW", label: "New" },
    { value: "SALE", label: "Sale" },
    { value: "POPULAR", label: "Popular" },
    { value: "ECO", label: "Eco" },
    { value: "TRENDING", label: "Trending" },
    { value: "LIMITED", label: "Limited" },
    { value: "BESTSELLER", label: "Bestseller" },
    { value: "CLASSIC", label: "Classic" },
    { value: "PREMIUM", label: "Premium" },
    { value: "BUDGET", label: "Budget" }
];

export const ROLE = {
    ADMIN: 1,
    USER: 3,
    SUBADMIN: 2,
}
export const ROLES = [
    { value: ROLE.ADMIN, label: "Admin", },
    { value: ROLE.SUBADMIN, label: "SubAdmin", },
    { value: ROLE.USER, label: "User", },
]

export const ENV = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL
}
export const API = {
    LOGIN: "login",
    PRODUCTS: "products",
    PRODUCT: "products/:id",
    CREATE_PRODUCT: "products",
    UPDATE_PRODUCT: "products/:id",
    DELETE_PRODUCT: "products/:id",
}
export const API_STATUS = {
    PENDING: "pending",
}
export const PRICE = {
    MIN: 0,
    MAX: 1000,
}

export const LIMIT_OPTIONS = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 30, label: 30 },
]
export const MSGS = {
    PRODUCT_CREATED: "product has been created",
    PRODUCT_UPDATED: "product has been updated",
}