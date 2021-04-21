import {request} from './request';

export const fetchSlotsByStation = (stationId, page, rows) => {
    return request({
        url: '/api/token/slot/_by-station',
        method: 'get',
        params: {
            stationId,
            page,
            rows,
        }
    });
};

export const createSlot = data => {
    return request({
        url: '/api/token/slot/',
        method: 'put',
        data: data,
    });
};

export const setElabelState = (id, enable) => {
    return request({
        url: `/api/token/slot/${id}/_elabel-enabled`,
        method: 'post',
        data: {
            elabelEnabled: enable,
        }
    });
};


export const setSku = (slotId, skuId) => {
    return request({
        url: `/api/token/slot/${slotId}/_sku`,
        method: 'post',
        data: {
            skuId: skuId,
        }
    });
};

export const fetchLastSlotDataByStation = stationId => {
    return request({
        url: '/api/token/slot/_last-data-by-station',
        method: 'get',
        params: {
            stationId,
        }
    });
};

export const updateSlotNoById = (slotId, slotNo) => {
    return request({
        url: `/api/token/slot/${slotId}/_update-slot-no-by-id`,
        method: 'post',
        data: {
            slotNo: slotNo,
        },
    })
};
