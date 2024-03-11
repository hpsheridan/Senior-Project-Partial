import {connect} from 'react-redux';
import {addClassToSchedule} from '../reducers/schedule/actions.js';
import ClassAdder from '../../components/ClassAdder.js';


const mapDispatchToProps = dispatch => {
    return {
        addClass: (clss) => dispatch(addClassToSchedule(clss)),
    };
}

export default connect(null, mapDispatchToProps)(ClassAdder);
