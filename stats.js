/* 
 * stats.js
 * Chris Phifer
 *
 * Makes request to our server to get score data requested (for the desired game mode)
 * and generates a chart based on the data (to show a score distribution of sorts)
 */

var modes;

/* Give all the radio buttons event listeners for being clicked */
/* Just leave in global scope */
$(document).ready(function() {
	modes = document.getElementsByName("difficulty");
	for (var i = 0; i < modes.length; i++) {
		modes[i].addEventListener('click', get_data);
	}
});

function get_data() {
	for (var i = 0; i < modes.length; i++) {
		if (modes[i].checked) {
			process_data(modes[i].value);
			break; /* Don't process once we find one selected */
		}
	}
}

/* Expects array of objects holding score data */
function build_table(difficulty, score_data) {
	var leaderboard = document.getElementById("leaderboard");
	var title = "<h1>Scores (" + difficulty.replace(/\b\w/g, l => l.toUpperCase()) + ")</h1>"
	var table = "<table class=\"table table-bordered table-hover table-striped\">"
	table += "<thead><tr class=\"success\"><th>Rank</th><th>username</th><th>Score</th></tr></thead>"
	table += "<tbody>"
	/* Assume: Array is sorted by score */
	for (var i = 0; i < score_data.length; i++) {
		console.log("hi");
		table += "<tr>"
		table += "<th scope=\"row\">" + (i + 1) + "</th>" + 
		         "<td>" + score_data[i].username + "</td>" +
		         "<td>" + score_data[i].score + "</td>"
		table += "</tr>"
	} 
	table += "</tbody></table>"
	leaderboard.innerHTML = title + table;
}


/* Perform an XHR to the high-scores route to get all scores for a given difficulty */
function process_data(difficulty) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "http://find-the-way.herokuapp.com/high-scores?difficulty=" + difficulty, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var raw_data = xhr.responseText;
				var data = JSON.parse(raw_data);
				build_table(difficulty, data);
			} else {
				process_data(difficulty);
			}
		}
	};
	xhr.send();
}
