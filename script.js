document.addEventListener("DOMContentLoaded", function () {
  // Your existing hardcoded data
  var existingData = [
    ["smoke bombs", 1, 40],
    ["feels like", 0, 38],
    ["enemy squad", 0, 29],
    ["victory within", 1, 29],
    ["hope left", 0, 28],
    ["looks like", 0, 26],
    ["feeling like", 0, 25],
    ["enemies must", 0, 24],
    ["chicken dinner", 0, 23],
    ["every move", 0, 22],
    ["lost cause", 0, 21],
    ["smoke grenade", 0, 21],
    ["chance winning", 0, 21],
    ["see us", 0, 21],
    ["driving skills", 0, 21],
    ["diversion tactics", 0, 21],
    ["upper hand", 0, 21],
  ];

  // Set up the chart dimensions for the existing graph
  var existingMargin = { top: 40, right: 30, bottom: 70, left: 50 };
  var existingWidth = 600 - existingMargin.left - existingMargin.right;
  var existingHeight = 550 - existingMargin.top - existingMargin.bottom;

  // Create SVG container for the existing graph
  var existingSvg = d3
    .select("#chart") // Select the div with id 'existing-chart'
    .append("svg")
    .attr("width", existingWidth + existingMargin.left + existingMargin.right)
    .attr("height", existingHeight + existingMargin.top + existingMargin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + existingMargin.left + "," + existingMargin.top + ")"
    );

  // Create scales, axes, bars, etc. for the existing graph
  var existingXScale = d3
    .scaleBand()
    .domain(existingData.map((d) => d[0]))
    .range([0, existingWidth])
    .padding(0.1);
  var existingYScale = d3
    .scaleLinear()
    .domain([0, d3.max(existingData, (d) => d[2])])
    .range([existingHeight, 0]);

  existingSvg
    .append("g")
    .attr("transform", "translate(0," + existingHeight + ")")
    .call(d3.axisBottom(existingXScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  existingSvg.append("g").call(d3.axisLeft(existingYScale));

  var existingBars = existingSvg
    .selectAll("rect")
    .data(existingData)
    .enter()
    .append("g")
    .attr("class", "bar-group");

  existingBars
    .append("rect")
    .attr("x", (d) => existingXScale(d[0]))
    .attr("y", (d) => existingYScale(d[2]))
    .attr("width", existingXScale.bandwidth())
    .attr("height", (d) => existingHeight - existingYScale(d[2]))
    .attr("fill", (d) => (d[1] === 1 ? "red" : "blue"))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  function handleMouseOver(d) {
    d3.select(this).attr("fill", "gray");

    var xPos =
      parseFloat(d3.select(this).attr("x")) + existingXScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(this).attr("y")) - 10;

    existingSvg
      .append("rect")
      .attr("class", "tooltip-background")
      .attr("x", xPos - 20)
      .attr("y", yPos - 30)
      .attr("width", 40)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "white")
      .style("opacity", 0.9);

    existingSvg
      .append("text")
      .attr("class", "tooltip")
      .attr("x", xPos)
      .attr("y", yPos - 15)
      .attr("text-anchor", "middle")
      .text(d[2]);
  }

  function handleMouseOut(d) {
    d3.select(this).attr("fill", (d) => (d[1] === 1 ? "red" : "blue"));

    existingSvg.select(".value-popup").remove();
    existingSvg.select(".tooltip").remove();
    existingSvg.select(".tooltip-background").remove();
  }

  // Fetch data from CSV file
  d3.csv(
    "https://raw.githubusercontent.com/Fiery51/DataScience1/main/CodeTemplates/Data%20Science%201%20Projects/FinalProject/Graph2.csv"
  ).then(function (newData) {
    // Set up the chart dimensions for the new graph
    var margin = { top: 375, right: 30, bottom: 70, left: 50 };
    var width = 564 - margin.left - margin.right; // Set the desired width
    var height = 550 - margin.top - margin.bottom;

    // Create SVG container for the new graph
    var svg = d3
      .select("#chart2") // Select the div with id 'chart'
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales, axes, bars, etc. for the new graph
    var xScale = d3
      .scaleBand()
      .domain(newData.map((d) => d.Word))
      .range([0, width])
      .padding(0.2); // Adjust the padding for separation
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(newData, (d) => d.Count)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(yScale));

    var bars = svg
      .selectAll(".bar-group")
      .data(newData)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    bars
      .append("rect")
      .attr("x", (d) => xScale(d.Word))
      .attr("y", (d) => yScale(d.Count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.Count))
      .attr("fill", (d) => (d.Sentiment === "1" ? "red" : "blue"))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    function handleMouseOver(d) {
      d3.select(this).attr("fill", "gray");

      var xPos = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
      var yPos = parseFloat(d3.select(this).attr("y")) - 10;

      svg
        .append("rect")
        .attr("class", "tooltip-background")
        .attr("x", xPos - 20)
        .attr("y", yPos - 30)
        .attr("width", 40)
        .attr("height", 20)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "white")
        .style("opacity", 0.9);

      svg
        .append("text")
        .attr("class", "tooltip")
        .attr("x", xPos)
        .attr("y", yPos - 15)
        .attr("text-anchor", "middle")
        .text(d.Count);
    }

    function handleMouseOut(d) {
      d3.select(this).attr("fill", (d) =>
        d.Sentiment === "1" ? "red" : "blue"
      );

      svg.select(".value-popup").remove();
      svg.select(".tooltip").remove();
      svg.select(".tooltip-background").remove();
    }

    var mainContent = document.getElementById("main-content");
    var visualizations = document.getElementById("Visualizations");
    var chart1 = document.getElementById("Vis_1"); // Assuming this is your first graph
    var chart2 = document.getElementById("Vis_2"); // Assuming this is your second graph
    var intro_1 = document.getElementById("intro_1");
    var intro_2 = document.getElementById("intro_2");

    var firstTriggerToShow = 2300; // First scroll position to show the first graph
    var firstTriggerToHide = 2800; // First scroll position to hide the first graph
    var secondTriggerToShow = 3800; // Second scroll position to show the second graph
    var secondTriggerToHide = 5200; // Second scroll position to hide the second graph

    window.onscroll = function () {
      var currentScrollPos = window.scrollY;

      // Hide both charts initially
      chart1.style.display = "none";
      chart2.style.display = "none";
      visualizations.style.display = "none"; // Ensure the container is also hidden

      // Show first graph
      if (
        currentScrollPos > firstTriggerToShow &&
        currentScrollPos < firstTriggerToHide
      ) {
        visualizations.style.display = "block"; // Display the container
        visualizations.style.width = "50%"; // Adjust width if needed
        mainContent.style.width = "50%";
        chart1.style.display = "block";
        chart2.style.display = "none";
      }

      // Show second graph
      if (
        currentScrollPos > secondTriggerToShow &&
        currentScrollPos < secondTriggerToHide
      ) {
        visualizations.style.display = "block"; // Display the container
        visualizations.style.width = "50%"; // Adjust width if needed
        mainContent.style.width = "50%";
        chart1.style.display = "none";
        chart2.style.display = "block";
      }

      // Hide visualizations if outside any trigger points
      if (
        currentScrollPos < firstTriggerToShow ||
        (currentScrollPos > firstTriggerToHide &&
          currentScrollPos < secondTriggerToShow) ||
        currentScrollPos > secondTriggerToHide
      ) {
        visualizations.style.display = "none"; // Hide the container
        mainContent.style.width = "100%";
      }
    };

    // 2. Change Color Scheme Functionality
    var changeColorBtn = document.getElementById("changeColorScheme");

    // 2. Change Color Scheme Functionality
    var changeColorBtn = document.getElementById("changeColorScheme");

    changeColorBtn.addEventListener("click", function () {
      // Change the theme of the website
      var body = document.body;

      // Toggle between light and dark themes
      if (body.classList.contains("light-theme")) {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
      } else {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
      }
    });
  });
});
