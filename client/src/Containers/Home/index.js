import { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Col, Row
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroll-component'

import {listCars} from '../../Services/inventory';

export default () => {
    const [listState, setListState] = useState({
        list: [],
        total: null
    });

    const fetchAvailableCars = () => {
        const { total, list } = listState;
        if (!total) {
            listCars({
                offset: list.length,
                limit: 10
            })
                .then((data) => {
                    const { data: { list, total } } = data;
                    setListState({
                        list: listState.list.concat(list),
                        total
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    useEffect(() => {
        fetchAvailableCars();
    }, [])

    return <Col xs={11} md={10} lg={9} className="mx-auto">
        <Row>
            <Col xs={12} className="d-flex justify-content-end mb-4">
                <Button as={Link} variant="outline-primary" to="/add-car">Add new Car</Button>
            </Col>
            {Boolean(listState.list.length) && listState.list.map(car => (<Col xs={12} md={6} lg={3} xl={4} key={car._id} className="pb-2">
                <Card className="h-100">
                    <Card.Header>
                        <h5 className="w-100 d-flex justify-content-between align-items-center">
                            <Link to={`/car-details/${car._id}`}><span>{`${car.name} - ${car.model}`}</span></Link>
                            <Button size="sm" as={Link} to={`/sales/add-sale/${car.sku}`}>sale</Button>
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <strong>Price</strong>
                            <strong>{car.price.toLocaleString()}</strong>
                        </div>
                    </Card.Body>
                </Card>
            </Col>))}
            <InfiniteScroller
                dataLength={listState.list.length}
                next={fetchAvailableCars}
                hasMore={listState.total === null || listState.list.length < listState.total}
                loader={<Col xs={12} className="position-relative mt-3">
                    <div className="window__refresh">
                        <div className="loader w-20" />
                    </div>
                </Col>}
            />
        </Row>
    </Col>
}
