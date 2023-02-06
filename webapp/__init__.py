import os

from flask import Flask


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    if not os.getenv("GPO_DB_URL"):
        raise RuntimeError("GPO_DB_URL is not set")
    if not os.getenv("GPO_BASE"):
        raise RuntimeError("GPO_BASE is not set")
    app.config.from_mapping(
        DATABASE=os.getenv("GPO_DB_URL"),
        GPO_BASE=os.getenv("GPO_BASE"),
    )

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    from . import db
    db.init_app(app)

    from . import gweb
    app.register_blueprint(gweb.bp)

    return app

