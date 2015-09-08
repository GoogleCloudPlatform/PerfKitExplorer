#!/bin/bash

# Exit on errors.
set -e

echo "** Compilation initializing."

Die () {
  echo >&2 Error: "$@"
  exit 1
}

# Sanity check that we're in the right directory.
[ -f gulpfile.js -a -d server/perfkit/explorer ] || Die \
  "Run this as ./compile.sh in the PerfKitExplorer directory."

echo "* Clean out the existing deployment content."
rm -r -f deploy/client/components
rm -r -f deploy/client/third_party
rm -r -f deploy/config
rm -r -f deploy/server
rm -f deploy/*.*

$(npm bin)/gulp $1

java -jar bin/closure-stylesheets.jar \
  --pretty-print \
  --output-file deploy/client/perfkit_styles.css \
  --allow-unrecognized-functions \
  --allow-unrecognized-properties \
  build/perfkit_styles.css

echo "** Compilation complete."
