#!/bin/sh
export GPO_DB_URL=file:/path/to/database;
export GPO_BASE=https://domain.tld/path/to/mp3s;
gunicorn -b unix:/tmp/gunicorn.sock --chdir /path/to/gweb/ -w 4 'webapp:create_app()'