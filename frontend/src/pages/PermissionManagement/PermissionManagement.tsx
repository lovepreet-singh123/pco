import { useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { usePermissionsManagement } from "../../actions/permission-management/permission-management";
import Button from "../../components/Button/Button";
import Select from "../../components/form/Select/Select";
import PermissionModal from "../../components/modals/PermissionModal";
import CustomPagination from "../../components/Pagination/Pagination";
import Spinner from "../../components/Spinner/Spinner";
import usePermissions from "../../hooks/usePermission";
import { routes } from "../../routes/AuthRoutes/Routes";
import { capitalize, getIndex, getSelectDefaultValue } from "../../utils/utils";

const PermissionManagement = () => {
    const [show, setShow] = useState(false);
    const [id, setId] = useState("");
    const { canEdit } = usePermissions("PERMISSION_MANAGEMENT")
    const PERMISSIONS_LIST = useMemo(() => routes.map(item => ({ value: item.module, label: capitalize(item.module) })), [routes]);
    const { refetch, query, setValue, data, handleReset, loading, } = usePermissionsManagement();

    const handleClose = useCallback((shouldRefetch = false) => {
        setShow(false);
        if (shouldRefetch) {
            refetch();
        }
    }, [])

    return (
        <div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Select
                    options={PERMISSIONS_LIST}
                    value={getSelectDefaultValue(PERMISSIONS_LIST, query.permissions)}
                    isMulti
                    onChange={option => {
                        setValue("permissions", option.map(item => String(item.value)));
                    }}
                />
                <Button onClick={handleReset} className="ms-auto">Reset</Button>
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Permissions</th>
                        {canEdit && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ?
                            <tr>
                                <td className="text-center" colSpan={4}>
                                    <Spinner />
                                </td>
                            </tr>
                            :
                            data &&
                                data.users.length > 0 ?
                                data.users.map((item, index) => {
                                    return (
                                        <tr key={item._id}>
                                            <td>{getIndex(query.page, index)}</td>
                                            <td>{item.username}</td>
                                            <td> {item.permissions.join(", ")} </td>
                                            {canEdit && <td>
                                                {canEdit && <Button onClick={() => { setShow(true); setId(item._id) }}>Edit</Button>}
                                            </td>}
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan={4}>No Record found</td>
                                </tr>
                    }
                </tbody>
            </Table>
            {
                (data && !loading) &&
                <CustomPagination
                    total={data?.total}
                    page={query.page}
                    onChange={(page) => setValue("page", page)}
                    onNext={(page) => setValue("page", page)}
                    onPrev={(page) => setValue("page", page)}
                />
            }
            {show && <PermissionModal id={id} show={show} handleClose={handleClose} />}
        </div>
    )
}

export default PermissionManagement;