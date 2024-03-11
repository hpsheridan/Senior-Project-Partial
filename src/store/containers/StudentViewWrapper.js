import StudentViewWrapper from "../../wrappers/StudentViewWrapper";
import { connect } from 'react-redux';

// Import the thunk functions that handle all of the interaction with the API
import { fetchStudentView } from "../middleware/thunk";


// Props that the component will receive from Redux, treat as normal props within component
const mapStateToProps = ( state ) => ( {
    selectedTerm: state.data.selectedTerm,
    selectedDepartment: state.data.selectedDepartment
} );

// dispatch functions are sent as an object, replaces mapDispatchToProps
export default connect( mapStateToProps, { fetchStudentView } )( StudentViewWrapper );
