import {SET_TITLE, SET_TOKEN} from './actionTypes';

export const setToken = (token, user) => {
    return {
        type: SET_TOKEN,
        user: user,
        token: token,
    }
};
export const setTitle = (mainTitle, subTitle) => {
    return {
        type: SET_TITLE,
        mainTitle,
        subTitle,
    }
};
