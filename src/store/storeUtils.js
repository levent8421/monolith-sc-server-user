import {connect} from 'react-redux';
import {setTitle, setToken} from './actionCreators';

const mapAllState2Props = (state, props) => {
    return {
        ...props,
        storeState: state,
    };
};
const asPropFun = (fun, dispatch) => {
    return (...args) => dispatch(fun(...args));
};
const mapAllAction2Props = (dispatch, props) => {
    const storeOperations = {
        setToken: asPropFun(setToken, dispatch),
        setTitle: asPropFun(setTitle, dispatch),
    };
    return {
        ...props,
        storeOperations,
    };
};

export const mapStateAndActions = component => {
    return connect(mapAllState2Props, mapAllAction2Props)(component);
};
