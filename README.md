This is a web UI and audio player for [gpodder](https://github.com/gpodder/gpodder).

The idea is that gpodder runs on a server with a job or service periodically issuing a `gpo update; gpo download` command.

Then this application reads the gpodder database so that a web page can list the episodes and select one to be played with [jPlayer](https://github.com/jplayer/jPlayer).

In production [nginx](https://github.com/nginx/nginx) will be used to proxy requests to the webapp, serve the handful of static files, and serve the MP3 files themselves (on a separate subdomain).


