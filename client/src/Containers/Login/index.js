import {useState} from "react";
import {
    Card, Col, Row, Form, Button
} from 'react-bootstrap';
import {loginUser} from '../../Stores';
import {useDispatch} from "react-redux";

export default ({ history }) => {
    const [loginFields, setLoginFields] = useState({
        username: '',
        password: ''
    });
    const dispatch = useDispatch();
    const onChange = (e) => {
        const { target: { value, name } } = e;
        loginFields[name] = value;
        setLoginFields({ ...loginFields });
    }
    const login = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        dispatch(loginUser(loginFields))
            .then(() => {
                history.push('/');
            })
    }
    return <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        <Card>
            <Card.Body>
                <Form className="w-100" onSubmit={login}>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <h3 className="text-center w-100">Car Inventory</h3>
                        </Col>
                        <Col xs={6} className="mb-3">
                            <Form.Control
                                type="text"
                                name="username"
                                onChange={onChange}
                            />
                        </Col>
                        <Col xs={12}/>
                        <Col xs={6} className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                onChange={onChange}
                            />
                        </Col>
                        <Col xs={12}/>
                        <Col xs={6} className="mb-3 d-flex justify-content-center">
                            <Button type="submit" className="w-75">Login</Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    </div>
}
