/* 
 * stats.js
 * Chris Phifer
 *
 * Makes request to our server to get score data requested (for the desired game mode)
 * and generates a chart based on the data (to show a score distribution of sorts)
 */


/* Give all the radio buttons event listeners for being clicked */
/* Just leave in global scope */
var modes = document.getElementsByName("difficulty");
for (var i in modes) {
	i.addEventListener('click', get_data);
}

function get_data() {
	for (var i = 0; i < modes.length; i++) {
		if (modes[i].checked) {
			process_data(modes[i].value);
			break; /* Don't process once we find one selected */
		}
	}
}

/* Expects array of objects */
function build_table(score_data) {
	var leaderboard = document.getElementById("leaderboard");
	
}

function process_data(difficulty) {
	var xhr = new XMLHttpRequest();
	xhr.open("post", "http://localhost:3000/high-scores", true);
	request.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var raw_data = request.responseText;
				var data = JSON.parse(raw_data);
				build_table(data);
			} else {
				process_data(difficulty);
			}
		}
	};
}
