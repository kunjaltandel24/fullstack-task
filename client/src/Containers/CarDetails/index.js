import { useState, useEffect, Fragment } from 'react';
import {
    Button,
    Card,
    Col, Row, Table
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroll-component'

import {getCar} from '../../Services/inventory';
import {listTransactions} from "../../Services/sales";

export default ({ match }) => {
    const { params: { id } } = match;
    const [car, setCar] = useState({});
    const [loading, setLoading] = useState(false);
    const [listState, setListState] = useState({
        list: [],
        total: null
    });

    const fetchCarDetails = () => {
        setLoading(true);
        getCar(id)
            .then((data) => {
                setLoading(false);
                const { data: car } = data;
                setCar(car);
                fetchCarSaleTransaction(car.sku);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const fetchCarSaleTransaction = (sku) => {
        const { total, list } = listState;
        if (!total) {
            listTransactions({
                offset: list.length,
                limit: 10,
                sku
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
        fetchCarDetails();
    }, [])

    return <Col xs={11} md={10} lg={9} className="mx-auto">
        <Row>
            <Col xs={12} className="d-flex mb-4">
                <h5>Car Details</h5>
            </Col>
            {loading && <Col xs={12} className="position-relative mt-3">
                <div className="window__refresh">
                    <div className="loader" />
                </div>
            </Col>}
            {car && car._id && (<Fragment>
                <Card className="h-100">
                    <Card.Header>
                        <h5 className="w-100 d-flex justify-content-between align-items-center">
                            <span>{`${car.name} - ${car.model}`}</span>
                            <Button size="sm" as={Link} to={`/sales/add-sale/${car.sku}`}>sale</Button>
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <strong>SKU</strong>
                            <strong>{car.sku}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <strong>Price</strong>
                            <strong>{car.price.toLocaleString()}</strong>
                        </div>
                    </Card.Body>
                </Card>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Sale Id</th>
                        <th>Buyer</th>
                        <th>Sold Price</th>
                        <th>Sold Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Boolean(listState.list.length) && listState.list.map(sale => (<tr key={sale._id} className="pb-2">
                        <td>{sale._id}</td>
                        <td>{`${sale.buyerName} ${sale.buyerPhone}`}</td>
                        <td>{sale.soldPrice.toLocaleString()}</td>
                        <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                    </tr>))}
                    <InfiniteScroller
                        dataLength={listState.list.length}
                        next={fetchCarSaleTransaction}
                        hasMore={listState.total === null || listState.list.length < listState.total}
                        loader={<Col xs={12} className="position-relative mt-3">
                            <div className="window__refresh">
                                <div className="loader w-20"/>
                            </div>
                        </Col>}
                    />
                    </tbody>
                </Table>
            </Fragment>)}
        </Row>
    </Col>
}
