import {request} from './request';

export const fetchMyScenes = () => {
    return request({
        url: '/api/token/user-scene/',
        method: 'get',
    });
};


export const createScene = data => {
    return request({
        url: '/api/token/user-scene/',
        method: 'put',
        data: data,
    });
};
