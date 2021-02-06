import {request} from './request';

export const login = data => {
    return request({
        url: '/api/open/user/_login',
        method: 'post',
        data: data,
    });
};


export const fetchMe = () => {
    return request({
        url: '/api/token/user/_me',
        method: 'get',
    });
};


export const resetPassword = param => {
    return request({
        url: '/api/token/user/_reset-password',
        method: 'post',
        data: param,
    });
};

export const updateUserInfo = user => {
    return request({
        url: '/api/token/user/_me',
        method: 'post',
        data: user,
    });
};
