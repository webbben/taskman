#!/bin/bash

npm run build

if [ $? -ne 0 ]; then
  # build failed - leave the error on the console
  echo "Build failed. Aborting..."
  exit 1
fi

# no build errors - proceed to running code
clear
node dist/cli.js