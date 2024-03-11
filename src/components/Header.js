// Created 10/01/2019
import * as d3 from 'd3';
import React from 'react';
import departmentToWeekly from "../conversions/departmentToWeekly.js";
import "../stylesheets/header.css";

let message = {
    list: [],
    mess: ""
};


function drawTopMenu(switchScene){

    let boxMenu = d3.select("#header")
        .attr("width", "100%")
        .attr("height", "20%")
        .attr('class', 'boxes-svg')

    //let width_right = boxMenu.property("offsetWidth");
    //console.log("header width", width_right);


    /******* draw top menu ********/

    //leave this option for a more complex top menu
    var rows = 1;
    var columns = 1;

    const top = d3.range(rows).map(d => []).map((row, i) => {
        return d3.range(columns).map((col, j) => ({
            row: i,
            column: j,

        }));
    });

    const topBox = boxMenu //for top menu
        .selectAll('.topBox')
        .data(top)
        .enter()
        .append('g')
        .attr('class', 'topBox')
        .attr('transform', (d, i) => `translate(${100 * i},0 )`);

    //underlay
    topBox.append('rect')
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", "steelblue");

    const allSquares = topBox.selectAll('.box-cell') //for top menu
        .data(d => d)
        .enter()
        .append('g')
        .attr('class', d => `box-cell-g-${d.column}`)
        .attr('transform', (d, i) => `translate(${(260 )* i + 10 },10 )`);


    allSquares.append('rect') //for top menu
        .attr("width", 250)
        .attr("height", 135)
        .style("fill", "grey")
        .attr('stroke', "darkgrey")
        .attr('stroke-dasharray', '10,5')
        .attr('stroke-linecap', 'butt')
        .attr('stroke-width', '3')
        .attr("r", 100)
        .style('fill', 'lightgrey');


     allSquares.append("circle") //for top menu
         .attr("cx", 125)
         .attr("cy", 65)
         .attr("r", 40)
         .style('fill', 'white')
         .attr('stroke', 'darkgrey')
         .attr('stroke', "darkgrey")
         .attr('stroke-dasharray', '10,5')
         .attr('stroke-linecap', 'butt')
         .attr('stroke-width', '3');


    allSquares.append('text') //for top menu
        .attr("y", 90)
        .attr("x", 97)
        .attr('fill','grey')
        .style("font", "100px times")
        .text('+');


    //prints the icon to switch between projects at the top right hand side
    var mini_tree  = d3.select('.topBox').append("svg:image")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 250)
        .attr('height', 135)
        .attr('xlink:href',function(){
            if(cur_scene === "TREE"){// if user viewing the Tree, display the option to switch to the weekly schedule
                return 'https://www.jqueryscript.net/images/Dynamic-Weekly-Scheduler-jQuery-Schedule.jpg';
            }//else display the option to go to the tree view
            return 'http://4.bp.blogspot.com/-gRcgPHK-sxw/UtIDyQlILqI/AAAAAAAAAjE/bznMVA_8P0k/s1600/tree-10.png';
        })
        .attr('transform', (d, i) => `translate(${(300 )* 2 + 10 },10 )`);

    mini_tree.on('click',function(){
        //switch between TreeView and WeeklyView

        swapScene(switchScene);
    });


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    allSquares //top menu
        .on("mouseover", function (d, i) { //mouseOver top menu
            //console.log("lastDragged",lastDragged);

            d3.select(this).transition() //changes color of square
                .duration('50')
                .attr('opacity', '.85');


            //displays the message over the square
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(message.mess)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });
}


//-----Store functions
const clearNodeFromDrag = (clearDrag) => {
        clearDrag();
};


const addNodeToActiveClasses = (addClass, activeDrag) => {
    addClass(departmentToWeekly(activeDrag));
};

let cur_scene = "WEEKLY";
const swapScene = (switchScene) => {
    if (cur_scene === "TREE") {cur_scene = "WEEKLY";}
    else{cur_scene = "TREE";}
    //console.log(`switching scene to ${cur_scene}`);
    switchScene(cur_scene);
};


function handleActiveDrag(clearDrag, activeDrag, addClass, activeClasses) {

    let added_to_list = false;
    let clssList = [];
    let clssmess = null;
    let mes;


    //create the message from classes in activeClasses store
    for (let clss = 0; clss < activeClasses.length; clss++) {
        [mes] = activeClasses[clss].name.split(" ");
        if (!clssList.includes(mes)) {
            clssList.push(mes);
            if(!clssmess){
                clssmess = mes;
            }
            else{
                clssmess = clssmess + "<br/>" + mes;
            }
        }
    }


    let potential_add;
    if (activeDrag !== 0) {//need to add it to the activeClasses store if present
        for (let i = 0; i < activeDrag.length; i++) {
            let m = Object.keys(activeDrag[i]);
            [potential_add] = m[0].split(" ");
            if (!message.list.includes(potential_add)) {//check if already in activeClasses store
                clssList.push(potential_add);
                added_to_list = true;
                if(!clssmess){
                    clssmess = potential_add;
                }
                else{
                    clssmess = clssmess + "<br/>" + potential_add;
                }
            }
        }

        if(added_to_list){
            addNodeToActiveClasses(addClass, activeDrag);//add activeDrag to activeClasses store
            clearNodeFromDrag(clearDrag); //clear dragged from redux state
        }
    }

    if(clssList.length === 0){
        clssmess = "No classes in Weekly Schedule."
    }
    message.list = clssList;
    message.mess = clssmess;
}



export default function Header({clearDrag, activeDrag, addClass, switchScene, activeClasses}) {

    React.useEffect(function() {
        swapScene(switchScene); //call to initialize the swap
    }, []);

    React.useEffect(function() {

        handleActiveDrag(clearDrag, activeDrag, addClass, activeClasses);
        drawTopMenu(switchScene);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDrag, addClass, clearDrag, activeClasses]);


    return (
        <div className = "Header">
            <svg id = "header" className = "header>"></svg>
        </div>
    );
}
