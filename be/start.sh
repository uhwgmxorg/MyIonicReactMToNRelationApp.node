#!/bin/bash
# start.sh
# Starte den Node.js-Server and DB
npm run start &
/usr/local/bin/docker-entrypoint.sh postgres