import WeeklyView from '../../components/WeeklyView.js';
import {updateMeetingPattern} from "../reducers/department/actions.js"
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        activeClasses: state.schedule.activeClasses
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateMeetingPattern: (clss) => dispatch(updateMeetingPattern(clss))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyView);