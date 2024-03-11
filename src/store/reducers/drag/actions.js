/**
 * Drag Actions
 */


function addDragged(drg) {
    return {
        type: "ADD_DRAG",
        payload: drg
    };
};

function clearDragged(){
    return{
        type: "CLEAR_DRAG"
    }
}

export {addDragged, clearDragged};