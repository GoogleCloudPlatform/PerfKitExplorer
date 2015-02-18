PerfKit Explorer Installation Guide
===================================
PerfKit is a service & web front end for composing queries and dashboards, and sharing the results.

Note the installation instructions below are based on using a Google Cloud Platform Compute instance, using the
Debian Backports image. Instructions for platform installation may vary depending on your operating system and
patch levels.

Set up your workstation
=======================

1. Install the Python 2.7 SDK:

         sudo apt-get install python2.7

2. Install the Java 7 SDK:

         sudo apt-get install openjdk-7-jdk

3. Install Git:

         sudo apt-get install git

4. Install the [Google Cloud SDK](https://developers.google.com/cloud/sdk/):

         curl https://sdk.cloud.google.com | bash

   * note: Choose "Python & PHP" from the languages options.
   * note: Restart your shell after installing gcloud to initialize the relevant paths.

5. Authorize your workstation to connect to Google Cloud resources:

         gcloud auth login

6. Install the [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads).

   * note: You will need to add the App Engine SDK to your PATH so that you can find appcfg.py.

7. Create a root folder for your source code (i.e.: `~/projects`) and navigate to it.

8. Create a GitHub account at http://www.github.com.

9. Clone this repository:

         git clone https://github.com/GoogleCloudPlatform/PerfKitExplorer.git

   If you have connected and authenticated correctly, the source code for
   PerfKit Explorer will download.
   Your projects folder will contain:

         (projects)
           PerfKitExplorer
             bin
             client
             ...
             compile.sh
             app.yaml

10. Change to the PerfKitExplorer folder and download the Closure Tools, which
    are included as a submodule in the project:

         git submodule update --init

11. Install NodeJS.

         sudo apt-get install nodejs

12. Install the Node Package Manager (NPM) packages for Gulp and dependencies.

         npm install --global gulp
         npm install --save-dev gulp
         npm install --global gulp-ng-html2js
         npm install --global gulp-minify-html
         npm install --global gulp-concat
         npm install --global gulp-uglify


Create the App Engine project
=============================
1. Create a Google Cloud project at https://console.developers.google.com/project.
2. Under the API's tab, enable the BigQuery service.

Create the BigQuery repository
==============================
1. Create a Google Cloud project, or user the same one you used for the App
   Engine project.

2. Enable billing for your Cloud Project (available from links on the left-hand side)
   https://console.developers.google.com/project/apps~MYPROJECT/settings

3. Create a dataset (ex: samples_mart):

         bq mk --project=MYPROJECT samples_mart

4. Change folders to the sample data folder:

         pushd ~/projects/PerfKitExplorer/data/samples_mart

5. Upload the sample data to a new table in your dataset (ex: results):

         bq load --project=MYPROJECT \
           --source_format=NEWLINE_DELIMITED_JSON \
           samples_mart.results \
           ./sample_results.json \
           ./results_table_schema.json

         popd

6. Add the service account from your App Engine project as an authorized use of your BigQuery project.

Compile and Deploy PerfKit Explorer
===================================
1. Navigate to the PerfKitExplorer directory:

         cd ~/projects/PerfKitExplorer

2. Modify the `app.yaml` file so that the application name matches the project id you created in
   the 'Create the App Engine project' step, and the version string is set appropriately. For example:

         application: perfkit-explorer-demo
         version: beta

3. Modify the `config/data_source_config.json` so that the production tags are
   appropriate for the repository you created in the previous step. For example:

         project_id: perfkit-explorer-demo
         project_name: perfkit-samples
         samples-mart: perfkit-samples.samples_mart
         analytics-key: UA-12345

4. Compile the application.

         bash compile.sh

5. You will now find a `~/projects/PerfKitExplorer/deploy` folder. Navigate to it.

6. Deploy PerfKit Explorer to App Engine.

         appcfg.py --oauth2 update .

7. By default the application will be deployed to a build/version specific to
   your client. For example, with the following values:

         version: 15
         application: MYPERFKIT

    will deploy to http://15-dot-MYPERFKIT.appspot.com
