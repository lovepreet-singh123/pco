import { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "../../components/Button/Button";
import Select from "../../components/form/Select/Select";
import RoleModal from "../../components/modals/RoleModal";
import { ROLES } from "../../utils/constants";

const users = [
    { id: 1, name: "Alice Smith", email: "alice.smith@example.com", role: 1, createdAt: "2025-02-01T10:00:00Z" },
    { id: 2, name: "Bob Johnson", email: "bob.johnson@example.com", role: 2, createdAt: "2025-02-10T14:20:00Z" },
    { id: 3, name: "Charlie Williams", email: "charlie.williams@example.com", role: 3, createdAt: "2025-02-15T09:30:00Z" },
    { id: 4, name: "Diana Brown", email: "diana.brown@example.com", role: 1, createdAt: "2025-03-01T11:45:00Z" },
    { id: 5, name: "Ethan Jones", email: "ethan.jones@example.com", role: 2, createdAt: "2025-03-05T16:10:00Z" },
    { id: 6, name: "Fiona Garcia", email: "fiona.garcia@example.com", role: 3, createdAt: "2025-03-12T08:00:00Z" },
    { id: 7, name: "George Miller", email: "george.miller@example.com", role: 2, createdAt: "2025-03-20T17:25:00Z" },
    { id: 8, name: "Hannah Davis", email: "hannah.davis@example.com", role: 3, createdAt: "2025-03-27T12:40:00Z" },
    { id: 9, name: "Ian Wilson", email: "ian.wilson@example.com", role: 1, createdAt: "2025-04-01T13:15:00Z" },
    { id: 10, name: "Jenna Moore", email: "jenna.moore@example.com", role: 3, createdAt: "2025-04-06T15:55:00Z" }
];

const RoleManagement = () => {
    const [show, setShow] = useState(false);
    
    const getRole = (role: number) => role === 1 ? "Admin" : role === 2 ? "SubAdmin" : "User";
    return (
        <div>
            <div className="d-flex my-4 gap-3 align-items-center">
                <Select
                    options={ROLES}
                    isMulti
                />
                <Button onClick={() => setShow(true)} className="ms-auto">Add</Button>
            </div>
            <Table responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.length > 0 ?
                            users.map((item, index) => {
                                return (
                                    <tr key={index + 1}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td> {getRole(item.role)} </td>
                                        <td>
                                            <Button onClick={() => setShow(true)}>Edit</Button>
                                            <Button>Remove</Button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td>No Record found</td>
                            </tr>
                    }
                </tbody>
            </Table>
            {show && <RoleModal show={show} handleClose={() => setShow(false)} />}
        </div>
    )
}

export default RoleManagement