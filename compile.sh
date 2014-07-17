#!/bin/bash

# Clean out the existing deployment content.
rm -r -f deploy

# Copy config files (yaml & appengine_config.py) to deploy.
find config -type f -name '*.json' | cpio -p -a -m -d deploy/
cp -f *.yaml ./deploy/
cp -f *.py ./deploy/


# Copy server/*.py files (not tests) to deploy/server
find server -type f -name '*.py' -not -iname '*_test.py' | cpio -p -a -m -d deploy/

# Copy server/*.html files to deploy/server
find server -type f -name '*.html' | cpio -p -a -m -d deploy/

# Copy third_party/py/*.py files to deploy/server/third_party
pushd third_party/py
find . -type f -name '*.py' | cpio -p -a -m -d ../../deploy/server/third_party/
popd

# Copy client/*.html template files to deploy/client.
find client -name '*.html' | cpio -pamd deploy/


# Compile client/*.js files to deploy/client/perfkit_scripts.js.
python bin/closurebuilder.py \
 --root=$closurelib/ \
 --root=client/ \
 --namespace="p3rf.perfkit.explorer.application.module" \
 --output_mode=compiled \
 --compiler_jar=bin/closure-compiler.jar \
 --compiler_flags="--angular_pass" \
 --compiler_flags="--compilation_level=WHITESPACE_ONLY" \
 --compiler_flags="--language_in=ECMASCRIPT5" \
 --compiler_flags="--formatting=PRETTY_PRINT" \
 --output_file=deploy/client/perfkit_scripts.js



# Compile client/*.css stylesheets to deploy/client/perfkit_styles.css.
find client -name '*.css'| xargs \
  java -jar bin/closure-stylesheets.jar \
  --output-file deploy/client/perfkit_styles.css \
  --allow-unrecognized-functions \
  --allow-unrecognized-properties \
  $1


# Compilation complete.
