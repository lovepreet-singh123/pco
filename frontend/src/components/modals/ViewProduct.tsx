import moment from "moment";
import { Modal } from "react-bootstrap";
import { useGetProductQuery } from "../../api/products/products.api";
import { API_STATUS } from "../../utils/constants";
import { capitalize } from "../../utils/utils";
import Spinner from "../Spinner/Spinner";

type PropTypes = {
    show: boolean;
    handleClose: () => void;
    id: string,
};

const ViewProduct = ({ id, show, handleClose }: PropTypes) => {
    const { data, status } = useGetProductQuery({ id });

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>View Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    status === API_STATUS.PENDING ?
                        <Spinner />
                        :
                        <>
                            {data?.stock === 0 && <p className="text-center fw-bold text-danger">Out of stock</p>}
                            <h5>{data?.name}</h5>
                            <p><strong>Description:</strong> {data?.description}</p>
                            <p><strong>Status:</strong> {capitalize(data?.status)}</p>
                            <p><strong>Stock:</strong> {data?.stock}</p>
                            <p><strong>Premium:</strong> {data?.isPremium ? "Yes" : "No"}</p>
                            <p><strong>Rating:</strong> {data?.rating}</p>
                            <p><strong>Price:</strong> ${data?.price}</p>
                            <p><strong>Category:</strong> {capitalize(data?.category)}</p>
                            <p><strong>Tags:</strong> {data?.tags && data.tags.length > 0 ? data?.tags.map(item => capitalize(item)).join(", ") : <span className="text-danger">No related tags found</span>}</p>
                            <p><strong>Created At:</strong> {moment(data?.createdAt).fromNow()}</p>
                            <p><strong>Updated At:</strong> {moment(data?.updatedAt).fromNow()}</p>
                        </>
                }
            </Modal.Body>
        </Modal>
    );
};

export default ViewProduct;
