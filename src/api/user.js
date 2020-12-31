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
