import { useMemo } from "react"
import { Card, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button/Button"
import { useAppSelector } from "../../redux/store"
import { routes } from "../../routes/AuthRoutes/Routes"
import { ROLE } from "../../utils/constants"

const Dashboard = () => {
    const navigate = useNavigate();
    const { permissions, role } = useAppSelector(state => state.user);
    const permissionSet = useMemo(() => new Set(permissions), [permissions]);
    const filteredRoutes = useMemo(() => role === ROLE.ADMIN ? routes : routes.filter(item => permissionSet.has(item.module)), [role, permissionSet])
    return (
        <div>
            <Row>
                {
                    filteredRoutes.map((item, index) => {
                        return (
                            <Col md={4} key={index}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Button className="mt-5" onClick={() => navigate(item.path)}>Go to {item.name}</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
    )
}

export default Dashboard