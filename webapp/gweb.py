from flask import g
from flask import Blueprint
from flask import redirect

bp = Blueprint("gweb", __name__)

# Later, nginx will serve the SPA and this route can get dumped
@bp.route("/")
def index():
    return redirect("static/index.html", 303)


