@ECHO OFF

ECHO ** Clean out the existing deployment content.
rmdir /S /Q deploy

ECHO ** Copy config files (json, yaml ^& appengine_config.py) to deploy.
xcopy .\config\*.json .\deploy\config\
copy *.yaml .\deploy\
copy *.py .\deploy\

ECHO ** Copy server/*.py files (not tests) to deploy/server
xcopy .\server\*.py .\deploy\server\ /S
FOR /f %%f IN ('dir /s /b .\deploy\server\*_test.py') DO del %%f

ECHO ** Copy server/*.html files to deploy/server
xcopy .\server\*.html .\deploy\server\ /S

ECHO ** Copy third_party/py files to deploy/server/third_party
xcopy .\third_party\py\ .\deploy\server\third_party\ /S

ECHO ** Copy client/*.html template files to deploy/client.
xcopy .\client\*.html .\deploy\client\ /S

ECHO ** Compile client/*.js files to deploy/client/perfkit_scripts.js.
python %closurelib%/closure/bin/build/closurebuilder.py ^
 --root=%closurelib%/ ^
 --root=client/ ^
 --namespace="p3rf.perfkit.explorer.application.module" ^
 --output_mode=compiled ^
 --compiler_jar=bin/closure-compiler.jar ^
 --compiler_flags="--angular_pass" ^
 --compiler_flags="--compilation_level=WHITESPACE_ONLY" ^
 --compiler_flags="--language_in=ECMASCRIPT5" ^
 --compiler_flags="--formatting=PRETTY_PRINT" ^
 --output_file=deploy/client/perfkit_scripts.js


SET CSS_TEMPFILE=deploy\perfkit_styles_raw.css
ECHO ** Combine the client/*.css stylesheets into a single file.
ECHO. /* Concatenated CSS */ > %CSS_TEMPFILE%
FOR /F %%k in ('dir /b /s /-p client /o:n /a:-d ^| findstr /E .css') DO copy /y /b "%CSS_TEMPFILE%" + "%%k" "%CSS_TEMPFILE%"

java -jar bin/closure-stylesheets.jar --pretty-print --output-file deploy/client/perfkit_styles.css ^
  --allow-unrecognized-functions --allow-unrecognized-properties "%CSS_TEMPFILE%"


ECHO Compilation complete.
