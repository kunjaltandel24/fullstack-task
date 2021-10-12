import {Fragment, lazy, Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Row} from 'react-bootstrap';

import Header from '../Header';

const Home = lazy(() => import('../Home'));
const AddCar = lazy(() => import('../CarForm'));
const Sales = lazy(() => import('../Sales'));
const SaleForm = lazy(() => import('../SaleForm'));
const CarDetails = lazy(() => import('../CarDetails'));

export default () => {
    return <Fragment>
        <Header/>
        <main className="app-main">
            <Suspense fallback={() => 'loading...'}>
                <Row>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/add-car" component={AddCar}/>
                        <Route exact path="/car-details/:id" component={CarDetails}/>
                        <Route exact path="/sales" component={Sales}/>
                        <Route exact path="/sales/add-sale/:sku" component={SaleForm}/>
                        <Route exact path="/sales-details/:id" component={Home}/>
                    </Switch>
                </Row>
            </Suspense>
        </main>
    </Fragment>
}
