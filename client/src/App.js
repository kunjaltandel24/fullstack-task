import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {BrowserRouter} from 'react-router-dom';

import rootReducer from './Stores';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppRouter from './Containers/AppRouter';


const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default () => (
    <Provider store={store}>
      <BrowserRouter basename={'/'}>
        <AppRouter/>
      </BrowserRouter>
    </Provider>
);
