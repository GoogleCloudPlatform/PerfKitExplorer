#!/bin/bash

echo "** Compilation initializing."
echo "* Clean out the existing deployment content."
rm -r -f deploy

echo "** Copying files."
echo "* Copy config files (yaml & appengine_config.py) to deploy."
find config -type f -name '*.json' | cpio -p -a -m -d --quiet deploy/
cp -f *.yaml ./deploy/
cp -f *.py ./deploy/

echo "* Copy server/*.py files (not tests) to deploy/server."
find server -type f -name '*.py' -not -iname '*_test.py' | cpio -p -a -m -d --quiet deploy/

echo "* Copy server/*.html files to deploy/server"
find server -type f -name '*.html' | cpio -p -a -m -d --quiet deploy/

echo "* Copy third_party/py/*.py files to deploy/server/third_party."
cd third_party/py
find . -type f -name '*.py' | cpio -p -a -m -d --quiet ../../deploy/server/third_party/
cd ../..

echo "* Copy third_party/js/*.* files to deploy/server/third_party."
cd third_party/js
find . -type f -name '*.*' | cpio -p -a -m -d --quiet ../../deploy/client/third_party/
cd ../..

echo "* Compile client/*.js (not tests) with Closure to deploy/client/perfkit_scripts.js."
echo "* Compile client/*.html with Html2Js to deploy/client/perfkit_templates.js."
gulp

echo "* Compile client/*.css stylesheets to deploy/client/perfkit_styles.css."
find client -name '*.css'| xargs \
  java -jar bin/closure-stylesheets.jar \
      --pretty-print \
      --output-file deploy/client/perfkit_styles.css \
      --allow-unrecognized-functions \
      --allow-unrecognized-properties \
      $1

echo "** Compilation complete."
