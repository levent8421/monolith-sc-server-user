import {request} from './request';

export const fetchCategoriesByScene = sceneId => {
    return request({
        url: '/api/token/sku-category/_by-scene',
        method: 'get',
        params: {
            sceneId
        }
    });
};

export const fetchTopLevelCategoriesByScene = sceneId => {
    return request({
        url: '/api/token/sku-category/_top-level-by-scene',
        method: 'get',
        params: {
            sceneId
        }
    });
};


export const createCategory = data => {
    return request({
        url: '/api/token/sku-category/',
        method: 'put',
        data,
    });
};
