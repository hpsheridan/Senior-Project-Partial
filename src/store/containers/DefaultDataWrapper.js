import { connect } from 'react-redux';
import DefaultDataWrapper from "../../wrappers/DefaultDataWrapper";

// Import the thunk functions that handle all of the interaction with the API
import { fetchDepartments, fetchTerms } from "../middleware/thunk";


// Props that the component will receive from Redux, treat as normal props within component
const mapStateToProps = ( state ) => ( {
    selectedTerm: state.data.selectedTerm
} );

// dispatch functions are sent as an object, replaces mapDispatchToProps
export default connect( mapStateToProps, { fetchDepartments, fetchTerms } )( DefaultDataWrapper );
