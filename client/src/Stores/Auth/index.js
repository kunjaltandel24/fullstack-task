import {
    USER_LOGOUT,
    USER_LOGIN,
    UPDATE_USER
} from './actions';

const user = { username: 'admin' };
const token = localStorage.getItem('token');
const initState = {
    isLoggedIn: !!token,
    user: user || {},
    token
};

const authReducer = (state = initState, action) => {
    if (action.type === USER_LOGOUT) {
        localStorage.removeItem('token');
        return {
            ...state,
            user: {},
            isLoggedIn: false
        };
    } else if (action.type === USER_LOGIN) {
        return {
            ...state,
            user: action.user,
            isLoggedIn: true,
            token: action.token
        };
    } else if (action.type === UPDATE_USER) {
        return {
            ...state,
            user: action.user
        };
    }

    return state;
};

export default authReducer;
