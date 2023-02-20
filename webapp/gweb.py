from flask import g
from flask import Blueprint
from flask import redirect
from flask import jsonify
from flask import request
from flask import current_app

from os.path import exists as path_exists

from webapp.db import get_db

bp = Blueprint("gweb", __name__)

# Leaving this in as bad practice. Maybe I will use it while debugging later
# The proxy is supposed to serve this
#@bp.route("/")
#def index():
#    return redirect("static/index.html", 303)

@bp.route("/pods")
def get_pods():
    db = get_db()
    res = db.execute(
            "SELECT id, title, cover_url"
            " FROM podcast"
    ).fetchall()

    pods = dict()
    for row in res:
        pods[row["id"]] = {"title" : row["title"], "cover_url" : row["cover_url"]} 
    return jsonify(pods)


@bp.route("/episode_count")
def get_episode_counts():
    db = get_db()
    res = db.execute(
            "SELECT podcast_id,"
            " COUNT(podcast_id)"
            " FROM episode"
            " JOIN podcast"
            " ON podcast.id = episode.podcast_id"
            " GROUP BY podcast_id"
    ).fetchall()

    pods = dict()
    for row in res:
        pods[row["podcast_id"]] = row["COUNT(podcast_id)"]
    return jsonify(pods) 


@bp.route("/get_episodes")
def get_episodes():
    # OK, so we start at page one in the UI, but page one is 
    # rows 0-24, page 2 is rows 25-49, etc. So we need the first 
    # row of the wanted page
    start_at = (request.args.get("page", default=1, type=int) - 1) * 25
    db = get_db()
    res = db.execute(
            "SELECT id, title, published, description_html"
            " FROM episode"
            " WHERE podcast_id=?"
            " ORDER BY published DESC",
            (request.args.get("podcast", default=1),)
    ).fetchall()
    
    # OK, so we want 25 results (index base+0 to base+24), but we
    # should truncate if there aren't that many available.
    # So we finish at base+24 if the result count minus base 
    # is more than 24, otherwise we just go to the end
    finish_at = start_at + 24 if (len(res) - start_at) > 24 else (len(res)) - 1  

    episodes = list()
    # footgun: range() is actually (]
    for i in range(start_at, finish_at + 1):
        row = res[i]
        episodes.append({"id" : row["id"], "title" : row["title"], "published" : row["published"], "description" : row["description_html"]})
    
    return jsonify(episodes)


@bp.route("/queue_episode")
def queue_episode():
    index = request.args.get("id", default=-1, type=int)
    # in the DB the lowest index is 1. If nothing or bogon
    # is supplied then we should Malformed Request this one
    if index < 1:
        return 400;
    db = get_db()
    res = db.execute(
            "SELECT download_folder, download_filename"
            " FROM episode"
            " JOIN podcast"
            " ON podcast.id=episode.podcast_id"
            " WHERE episode.id=?",
            (index,)
    ).fetchone()
    
    url = "/".join([current_app.config["GPO_BASE"], res["download_folder"], res["download_filename"]])
    return url

@bp.route("/status")
def status():
    res = dict()
    # Expecting the lockfile to be stored in the directory above gweb,
    # but we're expecting the server to be executed from gweb? 
    # Sort this out. Maybe set a working directory in the run scripts
    res["updating"] = path_exists("../updating.lock")
    return jsonify(res)

