PerfKit Explorer Installation Guide
===================================
PerfKit is a service & web front end for composing queries and dashboards, and sharing the results.

Note the installation instructions below are based on using a Google Cloud Platform Compute instance, using the
Debian Backports image. Instructions for platform installation may vary depending on your operating system and
patch levels.

Set up your workstation
=======================

1. Install prerequisite packages:

         sudo apt-get install python2.7 openjdk-7-jdk git nodejs nodejs-legacy npm

   * Python 2.7 runtime
   * Java 7 SDK
   * Git
   * NodeJS (nodejs-legacy provides the required /usr/bin/node symlink)
   * Node Package Manager (NPM)

1. Install the [Google Cloud SDK](https://developers.google.com/cloud/sdk/):

         curl https://sdk.cloud.google.com | bash

   * note: Restart your shell after installing gcloud to initialize the relevant paths.

1. Install the [Google App Engine SDK for Python](https://cloud.google.com/appengine/downloads).

   * note: You will need to add the App Engine SDK to your PATH so that you can find appcfg.py.

1. Create a root folder for your source code (i.e.: `~/projects`) and navigate to it.

1. (Optional) If you are planning to participate in the open source project, create
   a GitHub account at http://www.github.com and make an editable copy of the
   [PerfKitExplorer repository](https://github.com/GoogleCloudPlatform/PerfKitExplorer)
   by clicking the "Fork" button at the top right. You can also set
   this up later, but it's easier to make the fork now before cloning it.

1. Clone the repository:

         git clone https://github.com/GoogleCloudPlatform/PerfKitExplorer.git

   or, if you created your own fork in the step above:

         git clone https://github.com/MY_GITHUB_ID/PerfKitExplorer.git

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

1. Change to the PerfKitExplorer folder and download the Closure Tools, which
    are included as a submodule in the project:

         git submodule update --init

1. Install the NPM packages for Gulp and dependencies, this will
    create a node_modules directory in the project.

         npm install


Create the App Engine project
=============================

1. Authorize your workstation to connect to Google Cloud resources:

         gcloud auth login

1. Create a Google Cloud project at https://console.developers.google.com/project.
1. In "APIs & Auth > APIs", enable the BigQuery service.
   * This is enabled by default for new projects.

Create the BigQuery repository
==============================
1. Create a Google Cloud project, or use the same one you used for the App
   Engine project.

1. Enable billing for your Cloud Project (available from links on the left-hand side)
   https://console.developers.google.com/project/MY_PROJECT_ID/settings
   * _MY_PROJECT_ID_ is the unique "Project ID", not the human-readable project name.

1. Create a dataset (ex: samples_mart):

         bq mk --project=MY_PROJECT_ID samples_mart

1. Upload sample data to a new table in your dataset (ex: results):

         pushd ~/projects/PerfKitExplorer/data/samples_mart

         bq load --project=MY_PROJECT_ID \
           --source_format=NEWLINE_DELIMITED_JSON \
           samples_mart.results \
           ./sample_results.json \
           ./results_table_schema.json

         popd

1. If the App Engine and BigQuery projects are separate, add the
   service account from your App Engine project as an authorized use
   of your BigQuery project.

Compile and Deploy PerfKit Explorer
===================================
1. Navigate to the PerfKitExplorer directory:

         cd ~/projects/PerfKitExplorer

1. Modify the `app.yaml` file so that the
   [instance class](https://cloud.google.com/appengine/docs/adminconsole/performancesettings)
   is appropriate for your needs, and the application name matches the
   project id you created in the 'Create the App Engine project' step,
   and the version string is set appropriately. For example:

         application: perfkit-explorer-demo
         version: beta
         instance_class: F2

1. Modify the `config/data_source_config.json` so that the production tags are
   appropriate for the repository you created in the previous step. For example:

         project_id: perfkit-explorer-demo
         project_name: perfkit-samples
         samples-mart: perfkit-samples.samples_mart
         analytics-key: UA-12345

1. Compile the application.

         bash compile.sh

1. You will now find a `~/projects/PerfKitExplorer/deploy` folder.

1. Deploy PerfKit Explorer to App Engine.

         appcfg.py --oauth2 update deploy

1. By default the application will be deployed to a build/version specific to
   your client. For example, with the following values:

         application: MY_PROJECT_ID
         version: 15

    will deploy to http://15-dot-MY_PROJECT_ID.appspot.com

Set up a PerfKit dashboard
==========================

1. Open the project URL http://15-dot-MY_PROJECT_ID.appspot.com in your browser.

1. Click "Edit Config" in the gear icon at the top right and set
   "default project" to the project id.

1. In Perfkit Dashboard Administration, click "Upload", and select
   the sample dashboard file: *PerfKitExplorer/data/samples_mart/sample_dashboard.json*
