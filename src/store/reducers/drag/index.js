const initialState = {
    activeDrag: 0
};

function dragReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_DRAG":
            return {
                ...state,
                activeDrag: action.payload
            };
        case "CLEAR_DRAG":
            return{
                ...state,
                activeDrag: 0
            };

        default:
            return state;
    }
}

export default dragReducer