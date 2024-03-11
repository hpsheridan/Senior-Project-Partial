const initialState = {
    scene: "TREE"
};

function sceneReducer(state = initialState, action) {
    switch (action.type) {
        case "SWITCH_SCENE":
            return {
                ...state,
                currentScene: action.payload
            };
        default:
            return state;
    }
}

export default sceneReducer;