

		function makeSpinner() {
			const xhttp = new XMLHttpRequest();
			xhttp.overrideMimeType("application/json");
			xhttp.onload = function() {
				var res = JSON.parse(xhttp.responseText);
				document.getElementById("splash").innerHTML = res;
			}
			xhttp.open("GET", "../pods", true);
			xhttp.send();
		}
		window.onload = makeSpinner;
