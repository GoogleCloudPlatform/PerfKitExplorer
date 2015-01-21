#!/bin/bash

ECHO "** Compilation initializing."
ECHO "* Clean out the existing deployment content."
rm -r -f deploy

ECHO "** Copying files."
ECHO "* Copy config files (yaml & appengine_config.py) to deploy."
find config -type f -name '*.json' | cpio -p -a -m -d --quiet deploy/
cp -f *.yaml ./deploy/
cp -f *.py ./deploy/

ECHO "* Copy server/*.py files (not tests) to deploy/server."
find server -type f -name '*.py' -not -iname '*_test.py' | cpio -p -a -m -d --quiet deploy/

ECHO "* Copy server/*.html files to deploy/server"
find server -type f -name '*.html' | cpio -p -a -m -d --quiet deploy/

ECHO "* Copy third_party/py/*.py files to deploy/server/third_party."
cd third_party/py
find . -type f -name '*.py' | cpio -p -a -m -d --quiet ../../deploy/server/third_party/
cd ../..

ECHO "* Copy client/*.html and json template files to deploy/client."
find client -name '*.html' | cpio -pamd --quiet deploy/
find client -name '*.json' | cpio -pamd --quiet deploy/

ECHO "* Copy third_party/js/*.* files to deploy/server/third_party."
cd third_party/js
find . -type f -name '*.*' | cpio -p -a -m -d --quiet ../../deploy/client/third_party/
cd ../..

ECHO "** Compiling files."
ECHO "* Compile client/*.js (not tests) to deploy/client/perfkit_scripts.js."
find client lib/closure-library/closure/goog \
    -name '*_test.js' -prune \
    -o -name 'karma.conf.js' -prune \
    -o -name '*.js' -print | xargs \
  java -jar bin/closure-compiler.jar \
      --angular_pass \
      --compilation_level=WHITESPACE_ONLY \
      --language_in=ECMASCRIPT5 \
      --formatting=PRETTY_PRINT \
      --manage_closure_dependencies \
      --only_closure_dependencies \
      --process_closure_primitives true \
      --closure_entry_point p3rf.perfkit.explorer.application.module \
      --js_output_file=deploy/client/perfkit_scripts.js

ECHO "* Compile client/*.css stylesheets to deploy/client/perfkit_styles.css."
find client -name '*.css'| xargs \
  java -jar bin/closure-stylesheets.jar \
      --pretty-print \
      --output-file deploy/client/perfkit_styles.css \
      --allow-unrecognized-functions \
      --allow-unrecognized-properties \
      $1

ECHO "** Compilation complete."
