import * as d3 from "d3";
const width = 500;

export default async function drawWhereChart() {
  const height = Math.min(width, 800);
  const radius = Math.min(width, height) / 2;

  const data = await d3.csv("../A1_where_dataset.csv");
  console.log(data);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.60)
    .outerRadius(radius - 1);

  const pie = d3
    .pie()
    .padAngle(1 / radius)
    .sort(null)
    .value((d) => d.Total);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.Manuf))
    .range(
      d3
        .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
        .reverse(),
    );

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
    .attr("fill", (d) => color(d.data.Manuf))
    .attr("d", arc)
    .attr("name", (d) => d.data.Name)
    .append("title")
    .text((d) => `${d.data.Manuf}: ${d.data.Total.toLocaleString()}`);

  svg
    .append("g")
    .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .call((text) =>
      text
        .append("tspan")
        .attr("y", "-0.2em")
        .attr("font-weight", "bold")
        .text((d) => d.data.Manuf),
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text((d) => d.data.Total.toLocaleString("en-US")),
    );

    svg.selectAll("path")
        .on("mouseover", function(event) {
            console.log(event.target.getAttribute("name"));
        });
  return svg.node();
}
