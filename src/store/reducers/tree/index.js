const initialState = {
    tree: null
};

function treeReducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_TREE":
            return {
                ...state,
                tree: action.payload
            };
        default:
            return state;
    }
}

export default treeReducer;