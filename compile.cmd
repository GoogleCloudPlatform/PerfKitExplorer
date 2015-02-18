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
xcopy .\config\*.json .\deploy\config\ >> last_compile.log
copy *.yaml .\deploy\ >> last_compile.log
copy *.py .\deploy\ >> last_compile.log

ECHO ** Copy server/*.py files (not tests) to deploy/server
xcopy .\server\*.py .\deploy\server\ /S >> last_compile.log
FOR /f %%f IN ('dir /s /b .\deploy\server\*_test.py') DO del %%f >> last_compile.log

ECHO ** Copy server/*.html files to deploy/server
xcopy .\server\*.html .\deploy\server\ /S >> last_compile.log

ECHO ** Copy third_party/py files to deploy/server/third_party
xcopy .\third_party\py\*.* .\deploy\server\third_party\ /S >> last_compile.log

ECHO "* Compile client/*.js (not tests) with Closure to deploy/client/perfkit_scripts.js."
ECHO "* Compile client/*.html with Html2Js to deploy/client/perfkit_templates.js."
gulp

SET CSS_TEMPFILE=deploy\perfkit_styles_raw.css
ECHO ** Combine the client/*.css stylesheets into a single file.
ECHO. /* Concatenated CSS */ > %CSS_TEMPFILE%
FOR /F %%k in ('dir /b /s /-p client /o:n /a:-d ^| findstr /E .css') DO copy /y /b "%CSS_TEMPFILE%" + "%%k" "%CSS_TEMPFILE%" >> last_compile.log

java -jar bin/closure-stylesheets.jar --pretty-print --output-file deploy/client/perfkit_styles.css ^
  --allow-unrecognized-functions --allow-unrecognized-properties "%CSS_TEMPFILE%" >> last_compile.log

ECHO Compilation complete.
