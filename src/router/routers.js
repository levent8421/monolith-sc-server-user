import Index from '../com/Index';
import Login from '../com/Login';

export const rootRoutes = [
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/**',
        exact: true,
        component: Index,
    },
];

