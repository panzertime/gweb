var model = { "pods": {}, "queued": "", "pages": {}, "selected": {}, "curr_page": {} };

$(document).on("change", "#pod-selector", function (e) {
	sel = $("#pod-selector").find(':selected').val();
	model["selected"]["podcast"] = sel;
	url = model["pods"][sel]["cover_url"];
	doc = '<img src="' + url + '" class="img-fluid">';
	$("#pod-cover").html(doc);

	$("#page-selector").empty().append("<option selected>Pick a page</option>");
	for (let page = 1; page <= model["pages"][sel]; page++) {
		line = '<option value="' + page + '"> Page ' + page + '</option>';
		$("#page-selector").append(line);
	}
	$("#page-selector").prop("disabled", false);
});


$(document).on("change", "#page-selector", function (e) {
	sel_page = $("#page-selector").find(':selected').val();
	const xhttp = new XMLHttpRequest();
	xhttp.overrideMimeType("application/json");
	xhttp.onload = function () {
		var res = JSON.parse(xhttp.responseText);
		model["curr_page"] = res;
		for (episode in res) {

			name = res[episode]["title"];
			line = '<option value="' + episode + '">' + name + '</option>';
			$("#episode-page").append(line);
		}
	}
	url = "../get_episodes?podcast=" + model["selected"]["podcast"] + "&page=" + sel_page;
	xhttp.open("GET", url, true);
	$("#episode-page").empty().append("<option selected>Pick an episode</option>");
	xhttp.send();
	$("#episode-page").prop("disabled", false);
});

$(document).on("change", "#episode-page", function (e) {
	sel_ep = $("#episode-page").find(':selected').val();
	episode = model["curr_page"][sel_ep];
	model["selected"]["episode"] = episode["id"];
	model["selected"]["title"] = episode["title"];
	desc = episode["description"];
	date = new Date(episode["published"] * 1000).toLocaleString();
	title = episode["title"];

	$("#ep-title").html(title);
	$("#ep-date").html(date);
	$("#ep-desc").html(desc);
	$("#play").prop("disabled", false);
});

$(document).on("click", "#play", function (e) {
	const xhttp = new XMLHttpRequest();
	xhttp.overrideMimeType("text/text");
	xhttp.onload = function () {
		var res = xhttp.responseText;
		media = { title: model["selected"]["title"], mp3: res }
		$("#jquery_jplayer_1").jPlayer("setMedia", media);
	}
	const ep = model["selected"]["episode"];
	xhttp.open("GET", "../queue_episode?id=" + ep, true);
	xhttp.send();
})

$(document).ready(function () {
	const xhttp = new XMLHttpRequest();
	xhttp.overrideMimeType("application/json");
	xhttp.onload = function () {
		var res = JSON.parse(xhttp.responseText);
		model["pods"] = res;
		for (pod in res) {
			name = res[pod].title;
			line = '<option value="' + pod + '">' + name + '</option>';
			$("#pod-selector").append(line);
		}
	}
	xhttp.open("GET", "../pods", true);
	xhttp.send();

	const xhttp2 = new XMLHttpRequest();
	xhttp2.overrideMimeType("application/json");
	xhttp2.onload = function () {
		var res = JSON.parse(xhttp2.responseText);
		model["pages"] = {};
		for (pod in res) {
			model["pages"][pod] = Math.ceil(res[pod] / 25);
		}
	}
	xhttp2.open("GET", "../episode_count");
	xhttp2.send();
});
