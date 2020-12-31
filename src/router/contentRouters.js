import Statistics from '../com/Statistics';
import StationScan from '../com/StationScan';
import Scenes from '../com/Scenes';
import UserInfo from '../com/UserInfo';
import SceneDetail from '../com/scene/SceneDetail';
import SceneStations from '../com/scene/SceneStations';

export const routers = [
    {
        path: '/',
        exact: true,
        component: Statistics,
    },
    {
        path: '/station-scan',
        exact: true,
        component: StationScan,
    },
    {
        path: '/scenes',
        exact: true,
        component: Scenes,
    },
    {
        path: '/user',
        exact: true,
        component: UserInfo,
    },
    {
        path: '/scene/:id',
        exact: true,
        component: SceneDetail,
    },
    {
        path: '/scene-stations/:id',
        exact: true,
        component: SceneStations,
    }
];
