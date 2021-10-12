import { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Col, Row, Table
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import InfiniteScroller from 'react-infinite-scroll-component'

import {listTransactions} from "../../Services/sales";

export default () => {
    const [listState, setListState] = useState({
        list: [],
        total: null
    });

    const fetchSalesRecords = () => {
        const { total, list } = listState;
        if (!total) {
            listTransactions({
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
        fetchSalesRecords();
    }, [])

    return <Col xs={11} md={10} lg={9} className="mx-auto">
        <Row>
            <Col xs={12} className="mb-3">
                <Card className="h-100">
                    <Card.Header>
                        <h4 className="d-flex align-items-center">
                            <Button variant="outline-secondary" as={Link} to="/sales">Back</Button>
                            <strong className="mx-2">Sales Transactions</strong>
                        </h4>
                    </Card.Header>
                </Card>
            </Col>
            <Table responsive>
                <thead>
                <tr>
                    <th>Sale Id</th>
                    <th>Buyer</th>
                    <th>Car</th>
                    <th>Sold Price</th>
                    <th>Sold Date</th>
                </tr>
                </thead>
                <tbody>
                {Boolean(listState.list.length) && listState.list.map(sale => (<tr key={sale._id} className="pb-2">
                    <td>{sale._id}</td>
                    <td>{`${sale.buyerName} ${sale.buyerPhone}`}</td>
                    <td>{`${sale.car.name} ${sale.car.model}`}</td>
                    <td>{sale.soldPrice.toLocaleString()}</td>
                    <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                </tr>))}
                <InfiniteScroller
                    dataLength={listState.list.length}
                    next={fetchSalesRecords}
                    hasMore={listState.total === null || listState.list.length < listState.total}
                    loader={<Col xs={12} className="position-relative mt-3">
                        <div className="window__refresh">
                            <div className="loader w-20" />
                        </div>
                    </Col>}
                />
                </tbody>
            </Table>
        </Row>
    </Col>
}
