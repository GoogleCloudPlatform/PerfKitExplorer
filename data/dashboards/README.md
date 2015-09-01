# README

This folder contains a pre-built summary dashboard for all benchmarks in PerfKitBenchmarker
(https://github.com/GoogleCloudPlatform/PerfKitBenchmarker/blob/master/README.md)
.


## Setup dashboards
* Once PerfKitExplorer is deployed, create a BigQuery table containing default machine types for various cloud providers:

        bq load --source_format=NEWLINE_DELIMITED_JSON --replace=true samples_mart.providers providers.json provider_schema.json

* Configure the the dashboards with your BIGQUERY_PROJECT_ID used by PerfKitExplorer by running the following command in this directory:

        sed -i  's/{{ project_id }}/BIGQUERY_PROJECT_ID/g' *.json

* Click "Upload" button in the "PerfKit Dashboard Administration" page to upload the dashboards.

        
