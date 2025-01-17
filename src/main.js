import drawWhereChart from "./chart_where";
import "./style.css";

const whereChart = document.querySelector(".where > .chart");
const howChart = document.querySelector(".how");

drawWhereChart().then(svgNode => {
    whereChart.append(svgNode);
});
