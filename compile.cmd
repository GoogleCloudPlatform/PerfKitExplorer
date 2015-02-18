@ECHO OFF

REM PerfKit Explorer deployment script for Windows clients.
REM Requirements:
REM   * Java 7 JRE
REM   * Python 2.7
REM   * Google App Engine
REM   * Closure Compiler

ECHO ** Clean out the existing deployment content.
rmdir /S /Q deploy

ECHO ** Copy config files (json, yaml ^& appengine_config.py) to deploy.
ECHO ** Copy server/*.py files (not tests) to deploy/server
ECHO ** Copy server/*.html files to deploy/server
ECHO ** Copy third_party/py files to deploy/server/third_party
ECHO "* Compile client/*.js (not tests) with Closure to deploy/client/perfkit_scripts.js."
ECHO "* Compile client/*.html with Html2Js to deploy/client/perfkit_templates.js."
node_modules/.bin/gulp

java -jar bin/closure-stylesheets.jar --pretty-print --output-file deploy/client/perfkit_styles.css ^
  --allow-unrecognized-functions --allow-unrecognized-properties out/perfkit_styles.css >> last_compile.log

ECHO Compilation complete.
