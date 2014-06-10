#!/bin/bash


# Copy config files (yaml & appengine_config.py) to deploy.
find config -type f | cpio -pamVd deploy/
cp -f *.yaml ./deploy/
cp -f *.py ./deploy/


# Copy server/*.py files (not tests) to deploy/server
find server -type f -not -iname '*_test.py' | cpio -pamVd deploy/


# Copy client/*.html template files to deploy/client.
find client -name '*.html' | cpio -pamVd deploy/


# Compile client/*.js files to deploy/client/dashkit_scripts.js.
python bin/closurebuilder.py \
 --root=$closurelib/ \
 --root=client/ \
 --namespace="p3rf.dashkit.explorer.application.module" \
 --output_mode=compiled \
 --compiler_jar=bin/closure-compiler.jar \
 --compiler_flags="--angular_pass" \
 --compiler_flags="--compilation_level=WHITESPACE_ONLY" \
 --compiler_flags="--language_in=ECMASCRIPT5" \
 --compiler_flags="--formatting=SINGLE_QUOTES" \
 --output_file=deploy/client/dashkit_scripts.js


# Compile client/*.css stylesheets to deploy/client/dashkit_styles.css.
find client -name '*.css'| xargs \
  java -jar bin/closure-stylesheets.jar \
  --output-file deploy/client/dashkit_styles.css \
  --allow-unrecognized-functions \
  --allow-unrecognized-properties \
  $1


# Compilation complete.

appcfg.py --oauth2 update deploy

# deployment complete.
