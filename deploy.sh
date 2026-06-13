#!/bin/bash
DEST="/Volumes/docker/homeautomation-project/node-red/node_modules/node-red-contrib-tractive"

rsync -av \
  --no-owner --no-group --no-perms \
  --delete --delete-excluded \
  --exclude node_modules \
  --exclude .git \
  --exclude .github \
  --exclude .claude \
  --exclude .qodo \
  --exclude test \
  --exclude deploy.sh \
  --exclude check-connection.js \
  --exclude package-lock.json \
  --exclude '*.tgz' \
  . "$DEST/"

echo ""
echo "Deployed. Restart Node-RED to apply changes."
