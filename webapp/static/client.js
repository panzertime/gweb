var model = { "pods": {}, "queued": "", "pages": {}, "selected": {}, "curr_page": {} };

function player_setup() {
	$("#jquery_jplayer_1").jPlayer({
		loadstart: function(e){
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: e.jPlayer.status.media.title,
					artist: model["pods"][model["selected"]["podcast"]]["title"],
					artwork: [
						{src: e.jPlayer.status.media.poster}
					]
				})
			};
		},
		cssSelectorAncestor: "#jp_container_1",
		swfPath: "/js",
		supplied: "mp3",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true
		
	});
}

function sync_state(method="", callback=function(r){}, params, isText=false,){
	url = "../" + method;
	if (params) {
		url += "?";
		for (p in params) {
			url += p;
			url += "=";
			url += params[p].toString();
			url += "&";
		}
	}
	
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		isText ? callback(xhttp.responseText) : callback(JSON.parse(xhttp.responseText));
	};
	xhttp.overrideMimeType(isText ? "text/text" : "application/json");
	xhttp.open("GET", url, true);
	xhttp.send();
}

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
	$("#episode-page").empty().append("<option selected>Pick an episode</option>");

	sync_state("get_episodes", function(res){
			model["curr_page"] = res;
			for (episode in res) {
				ep_name = res[episode]["title"];
				line = '<option value="' + episode + '">' + ep_name + '</option>';
				$("#episode-page").append(line);
			}
		}, 
		{
			podcast: model["selected"]["podcast"],
			page: $("#page-selector").find(':selected').val()
		});

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
	$("#desc-block").height($("#title-block").height());
	$("#ep-desc").html(desc);
	$("#play").prop("disabled", false);
});

$(document).on("click", "#play", function (e) {
	sync_state("queue_episode", function(res){
			media = { 
				title: model["selected"]["title"], 
				mp3: res, 
				poster:  model["pods"][model["selected"]["podcast"]]["cover_url"]
			}
			$("#jquery_jplayer_1").jPlayer("setMedia", media);
			dimension = $("#jp_container_1").height();
			$("#jquery_jplayer_1").jPlayer("option", 
				"size", {
					width: dimension,
					height: dimension
			});
		}, 
		params = {id: model["selected"]["episode"]},
		isText=true);
})

$(document).ready(function () {

	player_setup();

	sync_state("pods", function(res){
		model["pods"] = res;
		for (pod in res) {
			pod_name = res[pod].title;
			line = '<option value="' + pod + '">' + pod_name + '</option>';
			$("#pod-selector").append(line);
		}
	});

	sync_state("status", function(res){
		console.log(res);
		if (res.updating) {
			lines =	'<h1 class="display-6 text-danger"><strong>U</strong></h1>'
			console.log(lines);
			$("#status-light").html(lines);
		}
	});

	sync_state("episode_count", function(res) {
		model["pages"] = {};
		for (pod in res) {
			model["pages"][pod] = Math.ceil(res[pod] / 25);
		}
	});
	
});
