import { Modal } from "react-bootstrap"
import { ROLES } from "../../utils/constants"
import Button from "../Button/Button"
import Select from "../form/Select/Select"

type PropTypes = {
    show: boolean,
    handleClose: () => void,
}

const RoleModal = ({ show, handleClose }: PropTypes) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Body>
                <form>
                    <Select
                        label="Username"
                    />
                    <Select
                        options={ROLES}
                        label="Role"
                    />
                    <Button
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default RoleModal