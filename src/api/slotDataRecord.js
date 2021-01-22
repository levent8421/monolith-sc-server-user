import {request} from './request';

export const fetchLastRecord = slotId => {
    return request({
        url: '/api/token/slot-data-record/_last',
        method: 'get',
        params: {
            slotId
        }
    });
};

export const fetchLastRecordsByStation = stationId => {
    return request({
        url: '/api/token/slot-data-record/_by-station',
        method: 'get',
        params: {
            stationId
        }
    });
};
