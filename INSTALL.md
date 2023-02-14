I'm running this in a jail on FreeBSD. You need:

- nginx (or another proxy)
- gpodder
- Python 3.8
- the stuff from requirements.txt, in a virtualenv if you please
- I went with gunicorn to do wsgi but you can do whatever. Your problem now

Anyway, you'll want a proxy for the webapp and a server for the static files

Then you can run it with something like:

(this is for csh in a jail)
setenv GPO_DB_URL file:/root/gPodder/Database
setenv GPO_BASE http://static.hostname.domain
gunicorn -b unix:/tmp/gunicorn.sock -w 4 'webapp:create_app()'




