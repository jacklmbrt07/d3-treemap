const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
  const hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node.children;
    })
    .sum((node) => {
      return node.value;
    })
    .sort((node1, node2) => {
      return node2.value - node1.value;
    });

  const createTreeMap = d3.treemap().size([1000, 600]);

  const movieTiles = hierarchy.leaves();

  createTreeMap(hierarchy);

  console.log(movieTiles);

  let block = canvas
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return `translate(${movie["x0"]}, ${movie["y0"]})`;
    });

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let category = movie.data.category;
      switch (category) {
        case "Action":
          return "Orange";
        case "Drama":
          return "lightgreen";
        case "Adventure":
          return "coral";
        case "Family":
          return "lightblue";
        case "Animation":
          return "pink";
        case "Comedy":
          return "khaki";
        case "Biography":
          return "tan";
      }
    })
    .attr("data-name", (movie) => {
      return movie.data.name;
    })
    .attr("data-category", (movie) => {
      return movie.data.category;
    })
    .attr("data-value", (movie) => {
      return movie.data.value;
    })
    .attr("width", (movie) => {
      return movie["x1"] - movie["x0"];
    })
    .attr("height", (movie) => {
      return movie["y1"] - movie["y0"];
    })
    .on("mouseover", (event) => {
      let movie = event.target.__data__;
      let revenue = movie.data.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      tooltip.transition().style("visibility", "visible");
      tooltip.html(`$ ${revenue} <hr /> ${movie.data.name}`);
      tooltip.attr("data-value", movie.data.value);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  block
    .append("text")
    .text((movie) => {
      return movie.data.name;
    })
    .attr("x", 5)
    .attr("y", 20);
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    console.log(movieData);
    drawTreeMap();
  }
});
