import {connect} from 'react-redux';
import Header from '../../components/Header';
import {clearDragged} from "../reducers/drag/actions";
import {addClassToSchedule} from "../reducers/schedule/actions";
import {switchScene} from "../reducers/scenes/actions";



const mapStateToProps = state => {
    return {
        activeDrag: state.drag.activeDrag,
        activeClasses: state.schedule.activeClasses
    };
}

const mapDispatchToProps = dispatch => {
    return {
        clearDrag: (drg) => dispatch(clearDragged()),
        addClass: (clss) => dispatch(addClassToSchedule(clss)),
        switchScene: (scene) => dispatch(switchScene(scene))
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(Header);