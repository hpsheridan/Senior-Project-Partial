/**
 * Tree Actions
 */

function updateTree(tr) {
    return {
        type: "UPDATE_TREE",
        payload: tr
    };
};

export {updateTree};