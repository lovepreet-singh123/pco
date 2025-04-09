import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout/AuthLayout"
import Login from "./pages/Login/Login"
import AuthGaurd from "./routes/AuthGaurd/AuthGaurd"
import { routes } from "./routes/AuthRoutes/Routes"
import NoGaurd from "./routes/NoGaurd/NoGaurd"
import { ROUTES } from "./utils/constants"

const Application = () => {
    return (
        <>
            <BrowserRouter
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
            >
                <Routes>
                    <Route element={<NoGaurd />}>
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                    </Route>
                    {
                        routes.map(item => {
                            return (
                                <Route element={<AuthGaurd module={item.module} />}>
                                    <Route element={<AuthLayout />}>
                                        <Route path={item.path} Component={item.Component} />
                                    </Route>
                                </Route>
                            )
                        })
                    }
                    {/* <Route path={ROUTES.DASHBOARD} element={<AuthGaurd module={"DASHBOARD"}><Dashboard /></AuthGaurd>} />
                        <Route path={ROUTES.ROLE_MANAGEMENT} element={<RoleManagement />} />
                        <Route path={ROUTES.PERMISSION_MANAGEMENT} element={<PermissionManagement />} />
                        <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
                        <Route path={ROUTES.PRODUCTS} element={<Products />} /> */}
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Application
