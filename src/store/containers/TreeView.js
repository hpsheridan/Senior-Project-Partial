import {connect} from 'react-redux';
import TreeView from '../../components/TreeView';
import {addDragged} from "../reducers/drag/actions";
import {deleteClassFromSchedule} from "../reducers/schedule/actions";
import {updateTree} from "../reducers/tree/actions";

const mapStateToProps = state => {
    return {
        json: state.department.departmentView,
        activeDrag: state.drag.activeDrag,
        tree: state.tree.tree,
        activeClasses: state.schedule.activeClasses

    };
}

const mapDispatchToProps = dispatch => {
    return {
        addDrag: (drg) => dispatch(addDragged(drg)),
        updateTree: (tr) => dispatch(updateTree(tr)),
        deleteClass: (clss,lvl) => dispatch(deleteClassFromSchedule(clss, lvl)),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(TreeView);
