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
