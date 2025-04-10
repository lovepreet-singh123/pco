import { ChangeEvent, useEffect, useState } from "react"
import { Container, Nav, Navbar } from "react-bootstrap"
import { NavLink, Outlet } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import useLogout from "../../actions/logout/logout.action"
import Button from "../../components/Button/Button"
import Input from "../../components/form/Input/Input"
import { useSearch, useUpdate } from "../../hooks/useSearch"
import { useAppSelector } from "../../redux/store"
import { ROUTES } from "../../utils/constants"
import { getRole } from "../../utils/utils"

const AuthLayout = () => {
    const handleLogout = useLogout();
    const handleUpdate = useUpdate();
    const { search } = useSearch<{ search: string }>();
    const { details: { name }, role } = useAppSelector(state => state.user);
    const [searchValue, setSearchValue] = useState(search || "");

    const updateDebouncedSearch = useDebouncedCallback((value) => {
        handleUpdate("search", value);
    }, 300)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchValue(value);
        updateDebouncedSearch(value)
    }

    useEffect(() => {
        const value = search ?? "";
        setSearchValue(value)
    }, [search])
    return (
        <div>
            <Navbar expand="lg" className="mb-5 bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">{name}({getRole(role || 0)})</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className="nav-link" to={ROUTES.DASHBOARD}>Dashboard</NavLink>
                        </Nav>
                        <Nav>
                            <Input onChange={handleChange} value={searchValue} type="search" placeholder="Search" />
                            <Button onClick={handleLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
        </div>
    )
}

export default AuthLayout