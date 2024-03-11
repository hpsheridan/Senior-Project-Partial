import * as d3 from 'd3';

function packageText(textFunc, fontSize) {
    return {
        textFunc,
        fontSize,
    }
}

function drawText(textArr, widthFunc, y_interval) {
    const draw = (textFunc, fontSize, y) => {
        d3.select("#WeeklySVG")
        .selectAll("svg")
        .append("text")
        .attr("class", "svg-text")
        .attr("width", widthFunc)
        .attr("x", sub => widthFunc(sub) / 2)
        .attr("y", y)
        .attr("fill", "black")
        .attr("style", sub => `font-size: ${fontSize * widthFunc(sub) / 100}rem`)
        .text(textFunc);
    }
    let y = 25;

    for (const t of textArr) {
        draw(t.textFunc, t.fontSize, y)
        y += y_interval;
    }
}

export {drawText, packageText};