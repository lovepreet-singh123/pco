import { Modal } from "react-bootstrap";
import { useUserQuery } from "../../api/users/users.api";
import usePermissions from "../../hooks/usePermission";
import { API_STATUS, ROUTES } from "../../utils/constants";
import { getRole, safeText } from "../../utils/utils";
import Spinner from "../Spinner/Spinner";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

type PropTypes = {
    show: boolean;
    handleClose: () => void;
    id: string,
};

const ViewUser = ({ id, show, handleClose }: PropTypes) => {
    const { data, status } = useUserQuery({ id });
    const { canEdit, canView } = usePermissions("PERMISSION_MANAGEMENT");
    const { canEdit: canEditRole, canView: canViewRole } = usePermissions("ROLE_MANAGEMENT");
    const navigate = useNavigate();
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>View User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    status === API_STATUS.PENDING ?
                        <Spinner />
                        :
                        data &&
                        <>
                            <p><strong>Name:</strong> {safeText(data?.name)}</p>
                            <p><strong>Username:</strong> {data?.username}</p>
                            <p><strong>Email:</strong> {data?.email}</p>
                            {canViewRole && <p><strong>Role:</strong> {getRole(data?.role)}
                                {canEditRole &&
                                    <Button onClick={() => navigate(ROUTES.ROLE_MANAGEMENT)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width={24} height={24}>
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </Button>}
                            </p>}
                            {canView && <p><strong>Permissions:</strong> {data?.permissions.join(", ")} {canEdit &&
                                <Button onClick={() => navigate(ROUTES.PERMISSION_MANAGEMENT)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width={24} height={24}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Button>}</p>}
                        </>
                }
            </Modal.Body>
        </Modal>
    );
};

export default ViewUser;
