/* 
 * stats.js
 * Chris Phifer
 *
 * Makes request to our server to get score data requested (for the desired game mode)
 * and generates a chart based on the data (to show a score distribution of sorts)
 */

google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(render_chart);

var modes;
var data = [];

/* Give all the radio buttons event listeners for being clicked */
/* Just leave in global scope */
$(document).ready(function() {
	modes = document.getElementsByName("difficulty");
	for (var i = 0; i < modes.length; i++) {
		modes[i].addEventListener('click', get_data);
	}
});

function get_data() {
	$("#chart").hide();
	data = [];
	for (var i = 0; i < modes.length; i++) {
		if (modes[i].checked) {
			process_data(modes[i].value);
			break; /* Don't process once we find one selected */
		}
	}
}

/* Expects array of objects holding score data */
function build_table(difficulty) {
	var leaderboard = document.getElementById("leaderboard");
	var title = "<h1>Scores (" + difficulty.replace(/\b\w/g, l => l.toUpperCase()) + ")</h1>"
	var table = "<table class=\"table table-bordered table-hover table-striped\">"
	table += "<thead><tr class=\"success\"><th>Rank</th><th>Username</th><th>Score</th></tr></thead>"
	table += "<tbody>"
	/* Assume: Array is sorted by score */
	for (var i = 0; i < data.length; i++) {
		if (data[i].username === "") {
			data[i].username = "Anonymous";
		}

		table += "<tr>"
		table += "<th scope=\"row\">" + (i + 1) + "</th>" + 
		         "<td>" + data[i].username + "</td>" +
		         "<td>" + data[i].score + "</td>"
		table += "</tr>"
	} 
	table += "</tbody></table>"
	leaderboard.innerHTML = title + table;

	render_chart();
}

function render_chart() {
	var chart_div = document.getElementById("chart");
	var formatted_data = [];

	formatted_data[0] = ["Rank", "Score"];
	for (var i = 0; i < data.length; i++) {
		formatted_data.push([i + 1, data[i].score]);
	}

	formatted_data = google.visualization.arrayToDataTable(formatted_data);

	var options = {
		title: "Scores by Rank",
		lengend: { position: "bottom" }
	};

	var chart = new google.visualization.LineChart(chart_div);
	if (data.length > 0) {
		$("#chart").show();
		chart.draw(formatted_data, options);
	}
}


/* Perform an XHR to the high-scores route to get all scores for a given difficulty */
function process_data(difficulty) {
	if (difficulty === "local") {
		if (localStorage.getItem("scores") == null) {
			localStorage.setItem("scores", JSON.stringify([]));
		} 
		data = JSON.parse(localStorage.getItem("scores"));
		build_table(difficulty);
	} else {
		var xhr = new XMLHttpRequest();
		xhr.open("get", "http://find-the-way.herokuapp.com/high-scores?difficulty=" + difficulty, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var raw_data = xhr.responseText;
					data = JSON.parse(raw_data);
					build_table(difficulty);
				} else {
					process_data(difficulty);
				}
			}
		};
		xhr.send();
	}
}