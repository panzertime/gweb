GPO_DB_URL=file:directory/db.sql GPO_BASE=http://url.tld gunicorn -w 4 'webapp:create_app()'

