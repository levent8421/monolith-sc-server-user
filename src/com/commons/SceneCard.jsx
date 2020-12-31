import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './SceneCard.less';
import {HomeOutlined as SceneIcon} from '@ant-design/icons';

class SceneCard extends Component {
    static propTypes = {
        scene: PropTypes.object.isRequired,
        onClick: PropTypes.func,
    };

    render() {
        const {scene, onClick} = this.props;
        return (
            <div className="scene-card" onClick={() => onClick && onClick()}>
                <h2 className="name">
                    <SceneIcon/>{scene.name}
                </h2>
                <pre>
                    {scene.description}
                </pre>
                <p>{scene.createTime}</p>
            </div>
        );
    }
}

export default SceneCard;
