import { combineReducers } from 'redux'
import auth from './Auth';

export * from './Auth/actions';

export default combineReducers({
    auth
});
