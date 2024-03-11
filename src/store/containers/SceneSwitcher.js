import {connect} from 'react-redux';
import SceneSwitcher from "../../components/SceneSwitcher";

const mapStateToProps = state => {
    //console.log("state: ", state);
    return {
        currentScene: state.scene.currentScene
    };
}

export default connect(mapStateToProps)(SceneSwitcher);