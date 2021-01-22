import {request} from './request';

export const fetchConnectedStations = () => {
    return request({
        url: '/api/token/station/_free',
        method: 'get',
    });
};


export const bindStationScene = (stationId, sceneId) => {
    return request({
        url: `/api/token/station/${stationId}/_bind-scene`,
        method: 'post',
        data: {
            sceneId: sceneId
        }
    });
};


export const fetchStationByScene = sceneId => {
    return request({
        url: '/api/token/station/_by-scene',
        method: 'get',
        params: {
            sceneId,
        }
    });
};


export const fetchStationById = id => {
    return request({
        url: `/api/token/station/${id}`,
        method: 'get',
    });
};


export const syncSlotNo = id => {
    return request({
        url: `/api/token/station/${id}/_sync-slot-no`,
        method: 'post',
    });
};


export const syncSku = id => {
    return request({
        url: `/api/token/station/${id}/_sync-sku`,
        method: 'post',
    });
};

export const updateStation = station => {
    return request({
        url: `/api/token/station/${station.id}`,
        method: 'post',
        data: station,
    });
};
