// Created by 5/15/2020

export default function Delete( node, pa){

    DEL_HELPER(node, pa);
    return;

}

function DEL_HELPER(node, pa){

    if(node.parent){

        let tmp = node;
        while(tmp){ //this denotes a change in the nodes and all of the node's predecessors
            tmp.data.is_updated = true;
            tmp = tmp.parent;
        }

        for(let i = 0; i < node.parent.children.length; i++ ){

            if(node.parent.children[i].data.name === node.data.name && node.parent.children[i].id === node.id){

                if(node.parent.children.length === 1){//if there is only one child in the children array

                    if(node.parent.depth === 1){
                        node.parent.data.info = [];
                        node.parent.data.children = [];
                    }
                    else if(node.parent.depth ===2){
                        for(let i = 0; i < pa.data.info.length; i++) {
                            let key = Object.keys(pa.data.info[i]);
                            if (key[0] === node.parent.data.name) {
                                pa.data.info[i][key[0]] = [];
                            }
                        }
                    }

                    node.parent.children = null;
                    return;
                }
                if(node.parent.depth ===1){
                    node.parent.data.info.splice(i, 1);
                    if(node.parent.data.info.length ===1){
                        node.parent.data.isMultiComponent = false;
                    }
                }
                if(node.parent.depth ===2){

                    for(let i = 0; i < pa.data.info.length; i++){
                        let key = Object.keys(pa.data.info[i]);
                            if (key[0] === node.parent.data.name) {
                                for(let j = 0; j< pa.data.info[i][key[0]].length; j++) {

                                    for(let child = 0; child < node.data.children.length; child++){

                                        if(pa.data.info[i][key[0]][j]) {
                                            if (node.data.children[child].class_number === pa.data.info[i][key[0]][j].class_number) {
                                                pa.data.info[i][key[0]].splice(j, 1);
                                            }
                                        }
                                    }
                                }
                            }
                    }
                }

                node.parent.data.children.splice(i, 1);
                node.parent.children.splice(i,1); //remove from children array
                return;
            }
        }
    }
}
