// Created 10/01/2019

import * as React from "react";
import * as d3 from 'd3';
import {Pre_ProcessJSON} from "../conversions/Tree/Pre_ProcessJSONForTreeView"
import {contextMenu} from "../draws/Tree/ContextMenu";
import "../stylesheets/tree.css";
import Delete from "../draws/Tree/Delete";
import Add from "../draws/Tree/Add";


//helpful for "copy-paste" type of adding node to tree
/*
let selected = {
    aInternal: false,
    aListener: function(val) {},
    set a(val) {
        this.aInternal = val;
        this.aListener(val);
    },
    get a() {
        return this.aInternal;
    },
    registerListener: function(listener) {
        this.aListener = listener;
    }
}

selected.registerListener(function(val) {
    console.log("val:: ", val);

    //alert("Someone changed the value of x.a to " + val);
});

 */


function drawSomethingElse (treeData, addDrag, activeDrag, updateTree, treeStruct, deleteClass){

    let path;


    // panning variables
    // let panSpeed = 200;
    // let panBoundary = 20; // Within 20px from edges will pan when dragging.
    // let panTimer;

    //dragging variables
    let domNode;
    let draggingNode;

    //node interaction
    let print_is_true = false;
    let right_click_active = false;
    let node_to_rename;
    let rename_active = false;
    let rename_node_parent;
    let node_to_update;


    // Set the dimensions and margins of the diagram
    let margin = {top: 0, right: 20, bottom: 0, left: 0};
    const viewerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) ;
    const viewerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 160;


    //div for pop-Up menu
    let div = d3.select('#tree-container').append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    //v5 zoom
    function zoom() {
        svgGroup.attr("transform", d3.event.transform);
    }

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    let zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);


    let baseSvg = d3.select("#tree-container")
        .attr("width", viewerWidth + margin.right + margin.left)
        .attr("height", viewerHeight + margin.top + margin.bottom)
        .attr("transform", "translate("
            + margin.left + "," + margin.top+ ")")
        .call(zoomListener);


    // Append a group which holds all nodes and which the zoom Listener can act upon.
    let svgGroup = baseSvg.append("g")
        .attr("transform", "translate(" + viewerWidth/2 + ", 160)");

    let i = 0,
        duration = 750,
        root;

    // declares a tree layout and assigns the size
    let treemap = d3.tree().size([viewerHeight, viewerWidth]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function (d) {
        return d.children;
    });
    root.x0 = viewerHeight / 2;
    root.y0 = viewerWidth/2;


    // Collapse after the second level if treeStructure is null
    if (treeStruct === null){
        root.children.forEach(collapse);
        update(root);
        TreeStructure(updateTree, root);
    }
    else{
        update(treeStruct);
    }


    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    //make this recursive to expand all even if first children are already expanded
    function expand(d) {
        if(d.depth === 4){
            return;
        }
        else {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
            }
            else if(d.children){
                d.children.forEach(expand);
                d._children = null;
            }
        }
    }


    //center on the source node
    function centerNode(source){
        let t = d3.zoomTransform(baseSvg.node());
        let x =  t.x;
        let y = source.x0;

        y = -y *t.k + viewerHeight / 2;

        svgGroup.transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + t.k + ")");
        //.on("end", function(){ baseSvg.call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(t.k))});
    }


    function update(source) {

        let treeData;

        //access the treeStruct store to remember the tree's expanded/collapsed structure
        if(treeStruct === null){
            treeData = treemap(root);
        }else{
            treeData = treemap(treeStruct);
        }

        // Compute the new tree layout.
        let nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) { //
            d.y = d.depth * 180
        });

        // Define the drag listeners for drag/drop behaviour of nodes.
        let dragListener = d3.drag()
            .on("start", function (d) {
                if (d.depth !== 1) {
                    return;
                }

                d3.event.sourceEvent.stopPropagation();
                // it's important that we suppress the mouseover event on the node being dragged.
                // Otherwise it will absorb the mouseover event and the underlying node will not
                // detect it d3.select(this).attr('pointer-events', 'none');
            })
            .on("drag", function (d) {
                if (d.depth !== 1) {//drag only allowed at first level
                    return;
                }

                domNode = this;
                draggingNode = d;

                /*/ get coords of mouseEvent relative to svg container to allow for panning
                relCoords = d3.mouse($('svg').get(0));
                if (relCoords[0] < panBoundary) {
                    panTimer = true;
                    pan(this, 'left');
                } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                    panTimer = true;
                    pan(this, 'right');
                } else if (relCoords[1] < panBoundary) {
                    panTimer = true;
                    pan(this, 'up');
                } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                    panTimer = true;
                    pan(this, 'down');
                } else {
                    try {
                        clearTimeout(panTimer);
                    } catch (e) {

                    }
                }*/


                //get coordinates relative to baseSvg
                let coordinates = d3.mouse(svgGroup.node());
                //move the node
                d3.select(this).attr("transform", "translate("  +  coordinates[0]  + "," + coordinates[1] + ")");


            }).on("end", function (d) {
                if (d.depth !== 1) {
                    return;
                }
                domNode = this;

                //if drag not ended while above top menu - DO NOT ADD IT TO A LIST
                // let x = window.event.clientX;     // Get the horizontal coordinate
                let y = window.event.clientY;     // Get the vertical coordinate
                if(y  < 160){
                    console.log("Added to Weekly schedule: ", d);
                    if(d.data.info != null){
                        addNodeToDrag(addDrag, activeDrag, d.data.info); //updates redux
                    }
                }
                endDrag(d);
            });



        function endDrag(d) {

            d3.select(domNode).attr('class', 'node');
            if (draggingNode !== null) {
                update(root);
                //centerNode(draggingNode);
                draggingNode = null;
            }
        }

        // ****************** Nodes section ***************************

        // Update the nodes...

        let node = svgGroup.selectAll('g.node')
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        node.exit().remove(); 

        // Enter any new modes at the parent's previous position.
        let nodeEnter = node.enter().append('g')
            .call(dragListener)
            .attr('class', 'node')
            .attr("transform", function (d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on('click', click);

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6);


        nodeEnter.select("circle.node")
            .attr("r", 1e-6)
            .attr('stroke', function (d) {
                if(d.is_updated === true){//updated nodes
                    return "red"; //'#DC143C';
                }
                return 'steelblue';
            })
            .style("fill", function (d) {
                if(d.data.is_updated === true){
                    return d._children ?  '#CD5C5C': "orange"; //updated nodes
                }
                return d._children ? "lightsteelblue" : "#fff";
            });


        // Add labels for the nodes
        // Update the text to reflect whether node has children or not.
        nodeEnter.append("text")
            .attr('class', d => `box-cell-g-${d.id}`)
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                if (d.data.name) {
                    return d.data.name;
                }
            });

        //mouseOver function to print info for the node
        nodeEnter.on("mouseover", function (node) { //mouseOver node

            //PRINT MENU AT LEAF NODES
            setTimeout(function call(){
                if (node.depth === 4 ) {

                    print_is_true = true;
                    //let x, y;
                    //printIt(node.data, x, y);
                }
            }, 300);
        })
            .on('mouseout', function (d, i) {

                if(print_is_true === true){
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                    div.transition()
                        .duration('50')
                        .style("opacity", '1');
                }
                //else you don't need to remove menu
                print_is_true = false;
            });


        let menu;
        nodeEnter.on('contextmenu', function (d,i){
            console.log("right click on: ", d);

            right_click_active = true;
            let level = d.depth;
            if (level === 0) {
                menu = [
                    {
                        title: 'Add class',
                        action: function(p,i){
                            create_node( d, level);
                        }
                    },
                    {
                        title: 'Expand All',
                        action: function(elm, i) {
                            console.log('Expand All clicked');
                            expand(d);
                            update(root);
                        }
                    }, {
                        title: 'Collapse All',
                        action: function(elm, i) {
                            console.log('Collapse All clicked');
                            collapse(d);
                            update(root);
                        }
                    }
                ];
            }
            else if (level === 1) {
                menu = [
                    {
                        title: 'Add class',
                        action: function(p,i){
                            create_node( d, level);
                        }
                    },
                    {
                        title: 'Delete',
                        action: function(elm, i) {
                            console.log('Delete clicked');
                            delete_node(d);
                        }
                    },
                    {
                        title: 'Expand All',
                        action: function(elm, i) {
                            expand(d);
                            update(root);
                        }
                    }, {
                        title: 'Collapse All',
                        action: function(elm, i) {
                            collapse(d);
                            update(root);
                        }
                    },
                    {
                        title: 'Rename',
                        action: function(elm, i) {
                            console.log('Rename clicked');
                            node_to_rename = d;
                            rename_node_parent = d.parent;
                            rename_active = true;
                            rename_node(level); //rename node
                        }
                    }
                ];
            }
            else if (level === 2) {
                menu = [
                    {
                        title: 'Add Section',
                        action: function(p,i){
                            create_node( d, level);
                        }
                    },
                    {
                        title: 'Delete Section',
                        action: function(elm, i) {
                            console.log('Delete clicked');
                            delete_node(d);
                        }
                    },
                    {
                        title: 'Expand All',
                        action: function(elm, i) {
                            expand(d);
                            update(root);
                        }
                    }, {
                        title: 'Collapse All',
                        action: function(elm, i) {
                            collapse(d);
                            update(root);
                        }
                    },
                    {
                        title: 'Rename',
                        action: function(elm, i) {
                            console.log('Rename clicked');
                            node_to_rename = d;
                            rename_node_parent = d.parent;
                            rename_active = true;
                            rename_node(level); //rename node
                        }
                    }];

            }
            else if (level === 3) {
                menu = [
                    {
                        title: 'Add terminal node',
                        action: function(p,i){
                            create_node(d, level);
                        }
                    },
                    {
                        title: 'Delete Section',
                        action: function(elm, i) {
                            console.log('Delete clicked');
                            delete_node(d);
                        }
                    },
                    {
                        title: 'Expand All',
                        action: function(elm, i) {
                            expand(d);
                            update(root);
                        }
                    }, {
                        title: 'Collapse All',
                        action: function(elm, i) {
                            collapse(d);
                            update(root);
                        }
                    },
                    {
                        title: 'Rename',
                        action: function(elm, i) {
                            console.log('Rename clicked');
                            node_to_rename = d;
                            rename_node_parent = d.parent;
                            rename_active = true;
                            rename_node(level); //rename node
                        }
                    }
                  ];
            }
            else if (level === 4) {
                menu = [
                    {
                        title: 'Rename',
                        action: function(elm, i) {
                            console.log('Rename clicked');
                            node_to_rename = d;
                            rename_node_parent = d.parent;
                            rename_active = true;
                            rename_node(level); //rename node
                        }
                    },
                    ];

                //helpful for "copy-paste" type of adding node to tree
                // {
                //     title: 'Select Node',
                //         action: function(p,i){
                //
                //     let obj ={
                //         node: d,
                //         depth: d.depth,
                //         update: update,
                //         root: root
                //    }

                //  selected.a = obj;
                //}
                //}
                //
                //
                //
                //
            }

            contextMenu(menu)();

        });

        //FOR MENU AT LEAF NODE
         //function printIt(items, x, y){
         //    //build message:
         //    console.log(items);

         //    let inst_name = items['instructors'][0].instructor_fName + " " + items['instructors'][0].instructor_lName;
         //    let messageForNow = ['Class Info:' + "<br/>" + "instructor: " + inst_name + "<br/>" + "facility name: " + items['meeting_pattern'][0].facility_name + "<br/>" + "section: "+ items['section']+  "<br/>" + "component: " + items['component']];

         //    console.log("message for now: ", messageForNow);

             //displays the message over the square
         //    div.transition()
         //       .duration(200)
         //        .style("opacity", 1);
         //    div	.html(messageForNow)
         //        .style("left", (x+15) + "px")
         //       .style("top", (y -15 ) + "px")
         //        .style("opacity", 0);
         //}


        // Toggle children function - represent children of expanded node as children, and compressed children as _children
        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            return d;
        }

        // Toggle children on click. (expand/collapse node on click)
        function click(d) {
            console.log("You clicked: ", d);

            if (d3.event.defaultPrevented) return; // click suppressed
            d = toggleChildren(d);
            update(d);
            centerNode(d);
        }


        node.selectAll("text").remove(); //remove all pre-existing text

        // UPDATE
        let nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });


        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 8)
            .style("fill", function (d) {
                if(d.data.is_updated === true){
                    return 'orange';
                }
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');


        nodeUpdate.append("text")
            .attr('class', d => `box-cell-g-${d.id}`)
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                if (d.data.name) {
                    return d.data.name;
                }
            });

        // Remove any exiting nodes
        let nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1e-6);


        // On exit reduce the opacity of text labels
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        let link = svgGroup.selectAll('path.link')
            .data(links, function (d) {
                return d.id;
            });

        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function (d) {
                let o = {x: source.x0, y: source.y0}
                return diagonal(o, o)
            });

        // UPDATE
        let linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function (d) {
                return diagonal(d, d.parent)
            });

        // Remove any exiting links
        link.exit().transition()
             .duration(duration)
             .attr('d', function (d) {
                 let o = {x: source.x, y: source.y}
                 return diagonal(o, o)
             })
             .remove();

        // Store the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {

            path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

            return path
        }
    }


    //this function adds a new child node to create_node_parent, with the help of create_node_helper
    function create_node(item, level) {
        Add(item, level, update, root); //adds the item(s) to the tree view
        let pa = item;


        if(pa.depth !== 0){
            while(pa.data.info === undefined){
                pa = pa.parent;
            }
        }else{
            if(pa.children)
                pa = pa.children[0];
            else pa = pa._children[0]
        }


        let infObj = {
            level: item.depth,
            level_one: pa,
            node: item
        };

        //must update the store
        delClss(deleteClass, pa.data.info, infObj);

        /*
        //helpful for "copy-paste" type of adding node to tree
        if(selected){
            console.log("calling add");
            if(selected.a.depth !== (level + 1)){
                selected.a = false;
                alert("Please select node at level " + (level + 1));
            }
            else{
                expand(selected.a.node);

                Add(item, selected.a.node, selected.a.depth, selected.a.update, selected.a.root);
            }
        }else{

        }*/


    }


    //deletes node, and its children
    function delete_node(node) {
        let pa = node;
        while(pa.data.info === undefined){
            pa = pa.parent;
        }

        let infObj = {
            level: node.depth,
            level_one: pa,
            node: node
        };

        Delete(node, pa); //return true if we need to add a class back into activeC

        update(root);
        delClss(deleteClass, pa.data.info, infObj);
    }


    //allows the user to rename, but guides the user based on the level of the node_to_rename/level
    function rename_node(level) {

        let input;
        let className;
        if (node_to_rename && rename_active) {

            if(level === 1){
                input = prompt("Enter A Catalog Number", "100");
                if(input != null){
                    let pre = node_to_rename.data.name.split("-");

                    className = pre[0] +"-" + input; //automatically add CS- to the name of the node
                    node_to_rename.data.name = className;
                }
            }
            else if(level === 2 ){
                input = prompt("Enter a Class Number", "1000");
                if(input != null){

                    let term_number = " 2187 "; //term number for entire json
                    className = rename_node_parent.data.name + term_number + input; //automatically add parent name to the name of the new node
                    node_to_rename.data.name = className;
                }
            }
            else if(level === 3){ //update the name of all the courses..
                console.log("Level 3");
                input = prompt("Enter Course Title", "Intro To Typing");

                if(input != null) {
                    node_to_rename.parent.children.forEach((value) => {
                        value.data.name = input;
                        value.data.is_updated = true;

                        //update the course titles too?
                        //value.data.course_title = input;
                    });
                }
            }
            else if(level === 4 ){//this is last layer, at this layer, user can only rename the component of the course (ACT, LAB, SEM)
                //in further iterations of this project, user will be able to update more here
                input = prompt("Activity", "ACT/LAB");
                if(input != null) {
                    //update the component too?
                    //node_to_rename.data.component = input;
                    node_to_rename.data.name = input;
                }
            }
            rename_active = false; //stop renaming
        }

        //update all parent nodes to reflect update
        node_to_update = node_to_rename;
        while(node_to_update){
            node_to_update.data.is_updated = true;
            node_to_update = node_to_update.parent;
        }
        update(node_to_rename); //update the tree
    }
}


const addNodeToDrag = (addDrag, activeDrag, node) => {

    if (activeDrag === 0) {
        addDrag(node);
    }
};

const TreeStructure = (updateTree, rt) => {
    updateTree(rt);
};


const delClss = (deleteClass, clss, lvl) => {
    deleteClass(clss,lvl);

};


export default function TreeView({json, activeDrag, addDrag, updateTree, tree, deleteClass, activeClasses}){

    React.useEffect(function() {

        let processedJSON= Pre_ProcessJSON(json);
        drawSomethingElse(processedJSON, addDrag, activeDrag, updateTree, tree, deleteClass);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [json]);


    return(
        <>
            <div className="parent">
                <svg id="tree-container" className="tree-container" >
                </svg>
            </div>
        </>
    );
}
