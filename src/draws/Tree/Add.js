// Created 5/15/2020
import * as d3 from 'd3';

import testAdd from "../../testfiles/testAddClass";
import {Pre_ProcessJSON} from "../../conversions/Tree/Pre_ProcessJSONForTreeView"

let num_adds = 0;
//export default function Add(add_to_this_node, node, level, update, root){
export default function Add(add_to_this_node, level, update, root){
    if(num_adds > 5){
        alert("exceeded number of adds for testing");
    }else {
        let input;
        if(add_to_this_node.depth === 0){
            input = testAdd;
        }
        else{//some pre-processing for the testAdd..

            let deptView ="departmentView";
            let key = Object.keys(testAdd[deptView])


            key.sort(function (a, b) {
                let aName = a.substring(3, 6);
                let bName = b.substring(3, 6);

                if (aName < bName) {
                    return -1;
                } else if (aName > bName) {
                    return 1;
                } else {
                    return 0;
                }
            });


            let newName = add_to_this_node.data.name.split(" ")[0] + " " + key[num_adds].split(" ")[1] +" " + key[num_adds].split(" ")[2];

            /* eslint-disable no-eval */
           // node_parent.data.inf[eval("comp")]
            let value = testAdd[deptView][key[num_adds]];
            let newObj = {} ;
            newObj[eval('newName')] =  value;


            let outterObj = {};
            outterObj[eval('deptView')] =  newObj;
            input = outterObj;

        }


        let node_parent = add_to_this_node;
        let addList = Pre_ProcessJSON(input);

        //Make an SVG Container
        let svgContainer = d3.select("#tree-container").append("svg")
            .attr("width", 1000)
            .attr("height", 800)
            .attr('class', 'addView');


        function remove() {
            d3.selectAll('.addView').style('display', 'none');
        };

        svgContainer.append('rect')
            .attr('x', 110)
            .attr('y', 110)
            .attr("width", 400)
            .attr("height", 200)
            .on('click', remove);

        svgContainer.append('text')
            .attr('x', 110)
            .attr('y', 120)
            .text(function (d) {
                return "Are you sure you want to add? ";//+ addList['departmentView'].children[0].data.name + " to " + addList;
            });

        svgContainer.append('text')
            .attr('x', 110)
            .attr('y', 140)
            .text(function (d) {
                return "YES: (click me)";// + node.data.name;
            })
            .on('click', function () {

                if (node_parent.depth === 0) {

                    ADD_HELPER(node_parent, addList.children[num_adds], update, root);
                } else if (node_parent.depth === 1) {

                    if (node_parent.data.children && node_parent.data.children.length > 0) {
                        node_parent.data.info.push(addList.children[0].info[0]);
                        ADD_HELPER(node_parent, addList.children[0].children[0], update, root);
                    }
                } else if (node_parent.depth === 2) {
                    let index = null;
                    let key = null;

                    //need to find the correct info slot
                    for (let k = 0; k < node_parent.parent.data.info.length; k++) {

                        let ke = Object.keys(node_parent.parent.data.info[k])[0];
                        if (ke === node_parent.data.name) {
                            index = k;
                            key = ke
                        }
                    }

                    for (let i = 0; i < addList.children[0].children[0].children.length; i++) {
                        node_parent.parent.data.info[index][key].push(addList.children[0].children[0].children[i].inf);
                        ADD_HELPER(node_parent, addList.children[0].children[0].children[i], update, root);
                    }
                } else {

                    let len = addList.children[0].children[0].children[0].inf.components.length;
                    for (let j = 0; j < len; j++) {
                        let comp = addList.children[0].children[0].children[0].inf.components[j];

                        /* eslint-disable no-eval */
                        node_parent.data.inf[eval("comp")] = addList.children[0].children[0].children[0].inf[comp];
                        node_parent.data.inf.components.push(comp);

                        ADD_HELPER(node_parent, addList.children[0].children[0].children[0].children[j], update, root);
                    }
                }

                remove();
                num_adds++;
                return;
            });
    }

}

function ADD_HELPER(node_parent, data, update, root){
    let newNode;

    newNode = d3.hierarchy(data);

    newNode.data.is_updated = true;
    newNode.parent = node_parent;

    adjust_depth(newNode, node_parent.depth);

    if(node_parent.depth != null) {
        node_parent.data.children.push(newNode);

        if (node_parent.children) {
            node_parent.children.push(newNode);

        } else if (node_parent._children) {
            node_parent._children.push(newNode);
        }
    }

    let tmp = node_parent;
    while(tmp){ //this denotes a change in the nodes and all of the node's predecessors
        tmp.data.is_updated = true;
        tmp = tmp.parent;
    }

    update(root);
};



//finds depths that are incorrect (this happens when adding values), and corrects the depth
function adjust_depth(newNode) {

    let parent_depth = newNode.parent.depth;
    newNode.depth = parent_depth + 1;

    if(newNode.children) {
        for (let i = 0; i < newNode.children.length; i++) {
            newNode.children[i].depth += parent_depth + 1;

            if (newNode.children[i].children) {
                for (let j = 0; j < newNode.children[i].children.length; j++) {
                    newNode.children[i].children[j].depth += parent_depth + 1;
                    if (newNode.children[i].children[j].children) {
                        for (let k = 0; k < newNode.children[i].children[j].children.length; k++) {
                            newNode.children[i].children[j].children[k].depth += parent_depth + 1;

                        }
                    }
                }
            }
        }
    }
}
