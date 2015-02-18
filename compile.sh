#!/bin/bash

echo "** Compilation initializing."
echo "* Clean out the existing deployment content."
rm -r -f deploy

$(npm bin)/gulp $1

java -jar bin/closure-stylesheets.jar \
  --pretty-print \
  --output-file deploy/client/perfkit_styles.css \
  --allow-unrecognized-functions \
  --allow-unrecognized-properties \
  out/perfkit_styles.css

echo "** Compilation complete."
