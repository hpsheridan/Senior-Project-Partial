/**
 * Scene Actions
 */

function switchScene(scene) {
    return {
        type: "SWITCH_SCENE",
        payload: scene
    };
};

export {switchScene};