import { useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import useUsers, { useDeleteUser, useDeleteUsers } from "../../actions/users/users.action";
import Button from "../../components/Button/Button";
import Checkbox from "../../components/form/Checkbox/Checkbox";
import Select from "../../components/form/Select/Select";
import UserModal from "../../components/modals/UserModal";
import ViewUser from "../../components/modals/ViewUser";
import CustomPagination from "../../components/Pagination/Pagination";
import Spinner from "../../components/Spinner/Spinner";
import usePermissions from "../../hooks/usePermission";
import { routes } from "../../routes/AuthRoutes/Routes";
import { LIMIT_OPTIONS, ROLES } from "../../utils/constants";
import { capitalize, getFilteredValues, getIndex, getRole, getSelectDefaultValue, safeText } from "../../utils/utils";
import toast from "react-hot-toast";

const UserManagement = () => {
    const [show, setShow] = useState(false);
    const [view, setView] = useState(false);
    const [id, setId] = useState("");
    const [ids, setIds] = useState<string[]>([]);
    const { canCreate, canEdit, canDelete, canView } = usePermissions("USER_MANAGEMENT");
    const { canView: canViewRole } = usePermissions("ROLE_MANAGEMENT");
    const { canView: canViewPermissions } = usePermissions("PERMISSION_MANAGEMENT");
    const PERMISSIONS_LIST = useMemo(() => routes.map(item => ({ value: item.module, label: capitalize(item.module) })), [routes]);
    const { data, loading, setValue, refetch, query, handleReset } = useUsers();
    const allSelected = useMemo(() => data?.users && data.users.length === ids.length || false, [ids, data])
    const { handleDeleteUser, loading: deleteUserLoading } = useDeleteUser(() => {
        refetch();
        setId("");
    });
    const { handleDeleteUsers, loading: deleteUsersLoading } = useDeleteUsers(() => {
        refetch();
        setIds([]);
    });

    const handleSelectAll = useCallback(() => {
        if (data?.users) {
            setIds(ids => data.users.length === ids.length ? [] : data?.users.map(item => item._id))
        } else {
            toast.error("There's no record to select")
        }
    }, [setIds, data])

    const handleSelectProduct = useCallback((id: string) => {
        setIds(ids => getFilteredValues(ids, id));
    }, [setIds, getFilteredValues])

    const handleCloseShow = useCallback((shouldRefetch = false) => {
        setShow(false);
        setId("");
        if (shouldRefetch) {
            refetch();
        }
    }, [setShow])
    return (
        <div>
            <h3>Users - {loading ? <Spinner /> : data?.total}</h3>
            <div className="d-flex justify-content-between">
                {canViewPermissions && <Select
                    options={PERMISSIONS_LIST}
                    isMulti
                    onChange={option => setValue("permission", option.map(item => String(item.value)))}
                    value={getSelectDefaultValue(PERMISSIONS_LIST, query.permission)}
                />}
                {canViewRole && <Select
                    options={ROLES}
                    onChange={option => setValue("role", String(option?.value))}
                    value={getSelectDefaultValue(ROLES, query.role)}
                />}
                <Select
                    options={LIMIT_OPTIONS}
                    onChange={option => setValue("limit", Number(option?.value))}
                    value={getSelectDefaultValue(LIMIT_OPTIONS, query.limit)}
                />
                <Button onClick={handleReset}>Reset</Button>
                {canCreate && <Button onClick={() => setShow(true)}>Add</Button>}
                {canDelete && (ids.length > 0 && (deleteUsersLoading ? <Spinner /> : <Button onClick={() => handleDeleteUsers(ids)}>Delete Selected</Button>))}
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        <th><Checkbox onChange={handleSelectAll} checked={allSelected} /></th>
                        <th>#</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Username</th>
                        {canViewRole && <th>Role</th>}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ?
                            <tr>
                                <td className="text-center" colSpan={7}>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            data &&
                                data.users.length > 0 ?
                                data.users.map((item, index) => {
                                    return (
                                        <tr key={item._id}>
                                            <td><Checkbox checked={ids.includes(item._id)} onChange={() => handleSelectProduct(item._id)} /></td>
                                            <td>{getIndex(query.page, index)}</td>
                                            <td>{item.email}</td>
                                            <td>{safeText(item.name)}</td>
                                            <td>{item.username}</td>
                                            {canViewRole && <td>{getRole(item.role)} </td>}
                                            <td>
                                                {canView && <Button onClick={() => { setView(true); setId(item._id) }}>View</Button>}
                                                {canEdit && <Button onClick={() => { setShow(true); setId(item._id) }}>Edit</Button>}
                                                {canDelete && ((deleteUserLoading && id === item._id) ? <Spinner /> : <Button onClick={() => { handleDeleteUser(item._id); setId(item._id) }}>Delete</Button>)}
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={7}>No Record found</td>
                                </tr>
                    }
                </tbody>
            </Table>
            {
                (data && !loading) &&
                <CustomPagination
                    limit={query.limit}
                    total={data?.total}
                    page={query.page}
                    onChange={(page) => setValue("page", page)}
                    onNext={(page) => setValue("page", page)}
                    onPrev={(page) => setValue("page", page)}
                />
            }
            {show && <UserModal id={id} show={show} handleClose={handleCloseShow} />}
            {view && <ViewUser id={id} show={view} handleClose={() => { setView(false); setId("") }} />}
        </div>
    )
}

export default UserManagement