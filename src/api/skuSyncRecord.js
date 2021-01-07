import {request} from './request';

export const STATE_TABLE = {
    waiting: 1,
    success: 2,
    timeout: 3,
    error: 4,
};

export const fetchSkuSyncRecordsByTraceId = traceId => {
    return request({
        url: '/api/token/sku-sync-record/_by-trace-id',
        method: 'get',
        params: {
            traceId
        }
    });
};
