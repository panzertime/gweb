#!/bin/sh
GPO_DB_URL=file:/path/to/database GPO_BASE=file:///path/to/mp3s flask --app webapp --debug run 
# The test version should be available at 127.0.0.1:5000
