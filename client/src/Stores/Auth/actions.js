import {
    login
} from '../../Services/auth';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

export const loginUser = (payload) => (dispatch) => {
    return login(payload)
        .then(({ data: { user = {}, token } = {} }) => {
            localStorage.setItem('token', token);
            dispatch({
                type: USER_LOGIN,
                user: {
                    username: payload.username
                },
                token: token
            });

            return { success: true }
        })
        .catch((err) => {
            throw err.response;
        })
};

export const logOutUser = () => {
    return dispatch => {
        dispatch({
            type: USER_LOGOUT,
        });
    };
};
