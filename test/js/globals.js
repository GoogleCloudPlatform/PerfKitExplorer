var CURRENT_USER_EMAIL = 'sample_email@domain.com';
var CURRENT_USER_ADMIN = false;
var DEFAULT_QUERY_PROJECT_ID = 'SAMPLE_PROJECT';

google.load('visualization', '1.1', {packages: [
    'corechart', 'charteditor', 'calendar', 'geochart', 'sankey']});

var INITIAL_CONFIG = {
  'default_project': '',
  'default_dataset': '',
  'default_table': '',
  'analytics_key': '',
  'cache_duration': 0,
  'max_parallel_queries': 5,
  'grant_view_to_public': false,
  'grant_save_to_public': false,
  'grant_query_to_public': false
};
