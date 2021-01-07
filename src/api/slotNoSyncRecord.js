import {request} from './request';

export const fetchRecordsByTraceId = traceId => {
    return request({
        url: '/api/token/slot-no-sync-record/_by-trace-id',
        method: 'get',
        params: {
            traceId,
        }
    });
};


export const STATE_TABLE = {
    waiting: 1,
    success: 2,
    timeout: 3,
    error: 4,
};
