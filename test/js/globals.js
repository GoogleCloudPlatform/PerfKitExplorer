var CURRENT_USER_EMAIL = 'sample_email@domain.com';
var CURRENT_USER_ADMIN = false;
var DEFAULT_QUERY_PROJECT_ID = 'SAMPLE_PROJECT';

google.load('visualization', '1.1', {packages: [
    'corechart', 'charteditor', 'calendar', 'geochart', 'sankey']});

// TODO: Break this out into a GVizMock library.
/**var google = {
  visualization: {
    DataTable: function() {},
    DataView: function() {}
  }
};
**/