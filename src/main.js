import drawBarChart from "./chart_bar";
import drawHowChart from "./chart_how";
import drawWhereChart from "./chart_where";
import "./style.css";

const whereChart = document.querySelector(".where > .chart");
const howChart = document.querySelector(".how > .chart");
const barChart = document.querySelector(".bar > .chart");

drawWhereChart().then(svgNode => {
    whereChart.append(svgNode);
});

drawHowChart().then(svgNode => {
    howChart.append(svgNode);
})
