#!/bin/sh

if [ -z "$1" ]
then
	echo "Try ./zipper.sh 'ver_num'";
else
	echo "Cloning repository..."
	git clone -q https://github.com/panzertime/gweb.git;
	echo "Looking at release staging branch..."
	git -C gweb checkout -q -b release-staging --track origin/release-staging;
	echo "Zipping contents..."
	zip -q -r "gweb-v$1_`git -C gweb rev-parse --short HEAD`.zip" gweb
	rm -rf gweb
fi
