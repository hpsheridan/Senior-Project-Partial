const initialState = {
    activeClasses: []
};


function scheduleReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_CLASSES_TO_SCHEDULE":
            return {
                ...state,
                activeClasses: [...state.activeClasses, ...action.payload]
            };
        case "DELETE_CLASS_FROM_SCHEDULE":

            let ClassList = [...state.activeClasses];
            let j = 0;
            let payloadLen = Object.keys(action.payload).length;

            if(ClassList.length !== 0 ) {//if theres something in ActiveClasses, we must update

                if (action.level.level === 1 ) {

                    for (let i = 0; i < ClassList.length && j < payloadLen; i++) {
                        let key = Object.keys(action.payload[j]);

                        if (ClassList[i].name === key[0]) {
                            //remove the matched value from activeCLasses
                            ClassList.splice(i, 1);
                            i--;
                            j++;
                        }
                    }


                } else if (action.level.level === 2) {//this can eventually be combined with 1
                        let key = action.level.node.data.name;
                        for (let i = 0; i < ClassList.length; i++) {
                            if (ClassList[i].name === key) {
                                //remove the matched value from activeCLasses
                                ClassList.splice(i, 1);
                                i--;
                            }
                        }
                } else if(action.level.level === 3) {

                    let found = false;
                    for(let i = 0; i < ClassList.length; i++){
                        if(ClassList[i].name === action.level.node.parent.data.name){ //find parent match

                            for(let n = 0; found === false && n < ClassList[i].sections.length; n++){

                                if(ClassList[i].sections.length > 2){
                                    //don't delete the shared discussion
                                    ClassList[i].edited = true;

                                    //dive into SubSections..
                                    for(let sub = 0; found === false && sub < ClassList[i].sections[n].subSections.length; sub++){
                                        if(ClassList[i].sections[n].subSections[sub].data.class_number !== action.level.node.data.combined_class_number){
                                            //find something to delete
                                            for(let k = 0; k < action.level.node.data.children.length; k++){
                                                if(ClassList[i].sections[n].subSections[sub].data.class_number === action.level.node.data.children[k].class_number){
                                                    ClassList[i].sections.splice(n, 1);
                                                    found = true;
                                                }
                                            }
                                        }
                                    }
                                }
                                else{
                                    //just delete all sections
                                    ClassList[i].edited = true;
                                    ClassList[i].sections = [];
                                }
                            }
                        }

                    }
                }
            }

            return{
                ...state,
                activeClasses: [...ClassList]
            };
        default:
            return state;
    }
}

export default scheduleReducer