import {request} from './request';

export const fetchSkuByCategory = (categoryId, page = 1, rows = 20) => {
    return request({
        url: '/api/token/sku/_by-category',
        method: 'get',
        params: {
            categoryId,
            page,
            rows
        }
    });
};


export const createSku = data => {
    return request({
        url: '/api/token/sku/',
        method: 'put',
        data,
    });
};
