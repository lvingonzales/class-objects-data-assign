import * as d3 from "d3";
const width = 500;
const whereSubHead = document.querySelector(
  ".where > .description > .sub-heading",
);
const whereInfo = document.querySelector(".where > .description > .info");

export default async function drawWhereChart() {
  const height = Math.min(width, 800);
  const radius = Math.min(width, height) / 2;
  let data;
  
  try {
    data = await d3.csv("./A1_where_dataset.csv");
  } catch (error) {
    data = await d3.csv("https://lvingonzales.github.io/A1_how_dataset.csv");
  }
  
  console.log(data);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.6)
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
    .attr("id", "Where")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr(
      "style",
      "max-width: 100%; height: auto; drop-shadow: 20px 20px 20px rgb(0, 0, 0);",
    );

  svg
    .append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
    .attr("class", "highlight")
    .attr("fill", (d) => color(d.data.Manuf))
    .attr("d", arc)
    .attr("name", (d) => d.data.Name)
    .attr("desc", (d) => d.data.Desc)
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

  svg
    .selectAll("path")
    .on("mouseover", function (event) {
      showInfo(event);
      let paths = Array.from(svg.node().querySelectorAll("path"));
      paths.forEach((path) => {
        if (path !== event.target) {
          path.classList.add("inactive");
        }
      });
    })
    .on("mouseout", function (event) {
      showDefaultInfo(event);
      let paths = Array.from(svg.node().querySelectorAll("path"));
      paths.forEach((path) => {
        if (path !== event.target) {
          path.classList.remove("inactive");
        }
      });
    });
  return svg.node();
}

function showInfo(event) {
  whereSubHead.textContent = `Items made in ${event.target.getAttribute("name")}:`;
  whereInfo.textContent = event.target.getAttribute("desc");
}

function showDefaultInfo(event) {
  whereSubHead.textContent = ``;
  whereInfo.textContent = `This chart shows a total of countries from which each object originates, hover over a category to see some observations of the data.`;
}
