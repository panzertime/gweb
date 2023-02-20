#!/bin/sh
if [ -e update.lock ]
then 
    echo "Locked. Exiting prematurely"
    exit
else
    touch update.lock
    GPODDER_HOME=/path/to/gPodder gpo update
    GPODDER_HOME=/path/to/gPodder gpo download
    rm update.lock
fi