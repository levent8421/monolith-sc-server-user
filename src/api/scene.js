import {request} from './request';


export const fetchSceneById = id => {
    return request({
        url: `/api/token/scene/${id}`,
        method: 'get'
    });
};

export const updateScene = data => {
    return request({
        url: `/api/token/scene/${data.id}`,
        method: 'post',
        data: data,
    });
};
