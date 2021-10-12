import React, {Fragment, useState} from 'react';
import {useForm} from 'react-hook-form';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {addSale} from "../../Services/sales";

function SaleForm({ history, match }) {

    const {register, handleSubmit, errors, formState, reset} = useForm();
    const [error, setError] = useState('')

    const addNow = (data) => {
        const { params: { sku } } = match;
        data.sku = sku;
        addSale(data)
            .then(() => {
                history.push('/sales');
            })
            .catch((err) => {
                setError((err && err.message) || 'Something went wrong! Try again later');
            });
    };

    return <Col xs={11} md={10} lg={9} className="mx-auto">
        {formState.isSubmitting && <div className="window__refresh on-document">
            <span className="loader w-40"/>
        </div>}
        <Row>
            <Col xs={12} xs={12} md={10} lg={8} className="mx-auto">
                <h5>
                    <Button variant="outline-secondary" as={Link} to="/">Back</Button>
                    <span className="mx-2">Add New Car</span>
                </h5>
            </Col>
            <Col xs={12} md={10} lg={8} className="mx-auto mt-4">
                <Form className="w-100" onSubmit={handleSubmit(addNow)}>
                    <Form.Group>
                        <Form.Label>Buyer Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="buyerName"
                            ref={register({
                                required: true
                            })}
                            className={clsx({'has-error errored': errors.name})}
                        />
                        {errors.name && <Form.Text
                            className="input-error text-danger">{errors.name.message || 'Please enter buyer name'}</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Buyer Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="buyerPhone"
                            ref={register({
                                required: true
                            })}
                            className={clsx({'has-error errored': errors.model})}
                        />
                        {errors.buyerPhone && <Form.Text
                            className="input-error text-danger">{errors.buyerPhone.message || 'Please enter buyer phone number'}</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            name="price"
                            ref={register()}
                        />
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-end mt-3">
                        {error}
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-end mt-3">
                        <Button type="button" variant="outline-danger" className="mx-2" onClick={() => reset({})} block>Reset</Button>
                        <Button type="submit" block>Submit</Button>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    </Col>

}

export default SaleForm;
