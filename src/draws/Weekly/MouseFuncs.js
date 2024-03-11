import * as d3 from 'd3';
import {getSubsectSelect} from "./MiscFuncs.js";

function generateSectOnDrag(onPickup, updatePos, onDrop) {
    let mouse_dx, mouse_dy;

    const sectOnDrag = d3.drag()
        .on("start", sub => {
            onPickup(sub);

            let cur_sect = getSubsectSelect(sub);
            mouse_dx = cur_sect.attr("x") - d3.event.x;
            mouse_dy = cur_sect.attr("y") - d3.event.y;
        })
        .on("drag",  sub => {
            let cur_sect = getSubsectSelect(sub);
            let initX = cur_sect.attr("x");
            let initY = cur_sect.attr("y");

            let deltaX = d3.event.x - initX + mouse_dx;
            let deltaY = d3.event.y - initY + mouse_dy;
            updatePos(sub, deltaX, deltaY);
        })
        .on("end", sub => {
            onDrop(sub);
        });
    return sectOnDrag;
}

function generateSectOnMouseOver(classChangeColor) {
    return d => classChangeColor(d, "grey");
}

function generateSectOnMouseOut(classChangeColor) {
    return d => classChangeColor(d, "white");
}

export {generateSectOnDrag, generateSectOnMouseOver, generateSectOnMouseOut};