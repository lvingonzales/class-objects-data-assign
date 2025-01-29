import * as d3 from "d3";

export default async function drawBarChart() {
  const margin = { top: 30, right: 30, bottom: 70, left: 60 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ]);

  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const data = await d3.csv("./A1_how_dataset.csv");

  data.sort(function (b, a) {
    return a.Value - b.Value;
  });

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.Year;
      }),
    )
    .padding(0.2);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    const y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Year); })
      .attr("y", function(d) { return y(d.Total); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Total); })
      .attr("fill", "#69b3a2")

  return svg.node();
}
