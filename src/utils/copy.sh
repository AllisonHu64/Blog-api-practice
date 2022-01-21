#!/bin/sh
cd /Users/panhu/Desktop/code/server/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log