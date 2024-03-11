import ReduxTest from "../../components/ReduxTest";
import { connect } from 'react-redux';
// Import specific actions that act upon the reducers
import { selectDepartment } from "../reducers/data/actions";
// Import selectors that pull data from Redux and alter their contents for a specific view
import { getDepartmentNames } from "../reducers/data/selectors";


// Props that the component will receive from Redux, treat as normal props within component
const mapStateToProps = ( state ) => ( {
    departmentNames: getDepartmentNames( state ),
    schedulerView: state.scheduler.schedulerView,
    departmentView: state.department.departmentView,
    studentView: state.student.studentView
} );

// dispatch functions are sent as an object, replaces mapDispatchToProps
export default connect( mapStateToProps, {
    // Mapping the Redux actions to functions to be used by the components
    selectDepartment,
} )( ReduxTest );
