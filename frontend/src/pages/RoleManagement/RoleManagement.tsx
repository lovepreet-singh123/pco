import { useCallback, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { useRoleManagement } from "../../actions/role-management/role-management";
import Button from "../../components/Button/Button";
import Select from "../../components/form/Select/Select";
import RoleModal from "../../components/modals/RoleModal";
import CustomPagination from "../../components/Pagination/Pagination";
import Spinner from "../../components/Spinner/Spinner";
import usePermissions from "../../hooks/usePermission";
import { ROLES } from "../../utils/constants";
import { getIndex, getRole, getSelectDefaultValue } from "../../utils/utils";

const RoleManagement = () => {
    const [show, setShow] = useState(false);
    const [id, setId] = useState("");
    const { canEdit } = usePermissions("ROLE_MANAGEMENT")
    const roleOptions = useMemo(() => [{ value: "", label: "All" }, ...ROLES], [])
    const { refetch, query, setValue, data, handleReset, loading, } = useRoleManagement();

    const handleCloseRoleModal = useCallback((shouldRefetch = false) => {
        setShow(false);
        if (shouldRefetch) {
            refetch();
        }
    }, [])

    return (
        <div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Select
                    options={roleOptions}
                    value={getSelectDefaultValue(roleOptions, query.role)}
                    onChange={option => {
                        setValue("role", String(option?.value));
                    }}
                />
                <Button onClick={handleReset} className="ms-auto">Reset</Button>
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
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
                                            <td> {getRole(item.role)} </td>
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
            {show && <RoleModal id={id} show={show} handleClose={handleCloseRoleModal} />}
        </div>
    )
}

export default RoleManagement