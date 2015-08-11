# README

This folder contains a pre-built summary dashboard for all benchmarks in PerfKitBenchmarker
(https://github.com/GoogleCloudPlatform/PerfKitBenchmarker/blob/master/README.md)
.


## Setup dashboards
* Once PerfKitExplorer is deployed, configure the the dashboards with your BIGQUERY_PROJECT_ID, BIGQUERY_DATASET and BIGQUERY_TABLE used by PerfKitExplorer by running the following command in this directory:

        sed -i  's/{{ project_id }}/BIGQUERY_PROJECT_ID/g' *.json
        sed -i  's/{{ dataset_name }}/BIGQUERY_DATASET/g' *.json
        sed -i  's/{{ table_name }}/BIGQUERY_TABLE/g' *.json

* Click "Upload" button in the "PerfKit Dashboard Administration" page to upload the dashboards.

        
