"""Utility functions for dealing with BigQuery results."""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import datetime
import logging


class Error(Exception):
  pass


class NotSupportedError(Error):
  pass


class FieldTypes(object):
  """Enumerates the field types in a BigQuery table/result.

  see https://developers.google.com/bigquery/docs/tables#tables for more detail.
  """

  STRING = 'STRING'
  INTEGER = 'INTEGER'
  FLOAT = 'FLOAT'
  BOOLEAN = 'BOOLEAN'
  TIMESTAMP = 'TIMESTAMP'


class Formats(object):
  """Class to enumerate constants for supported result formats."""

  BIGQUERY = 'bigquery'
  TEMPLATE = 'template'
  GVIZ = 'gviz'

  @classmethod
  def All(cls):
    """Returns all known environments."""
    return [cls.BIGQUERY, cls.TEMPLATE, cls.GVIZ]


class ReplyFormatter(object):
  """Collection of utility methods used to format BigQuery replies."""

  @classmethod
  def BQTypeToGVizType(cls, typename):
    """Returns the GViz type for a given BQ column type.

    Args:
      typename: The BigQuery type name to convert.

    Returns:
      The appropriate GViz DataTable type name.
    """
    return {
        FieldTypes.STRING: 'string',
        FieldTypes.INTEGER: 'number',
        FieldTypes.FLOAT: 'number',
        FieldTypes.BOOLEAN: 'boolean',
        FieldTypes.TIMESTAMP: 'datetime'}[typename]

  @classmethod
  def FormatResponse(cls, response, response_format=None, replace_rows=False):
    """Transforms the provided reply to the specified format.

    Args:
      response: The BigQuery response to process.  The ['schema'] and ['rows']
          entries describe the structure and data, respectively.
      response_format: A string that specifies the format to use.  Defaults to
          Formats.GVIZ, which returns a format suitable for DataTable
          consumption and chart binding.
      replace_rows: If True, replaces ['rows'] with the result of the
          transformation.  Defaults to False.

    Returns:
      A transformed representation of response['rows'].

    Raises:
      NotSupportedError: Raised if response_format is provided and does not
          match one of the formats in Formats.All().
    """
    response_format = response_format.lower() or Formats.GVIZ

    if response_format == Formats.BIGQUERY:
      return response['rows']
    elif response_format == Formats.TEMPLATE:
      rows = cls.RowsToTemplateFormat(response)
    elif response_format == Formats.GVIZ:
      rows = cls.RowsToDataTableFormat(response)
    else:
      logging.error('"%s" is not a supported format.', response_format)
      raise NotSupportedError(
          'FormatResponse failed: "%s" is not a supported format.'.format(
              response_format))

    if replace_rows:
      response['rows'] = rows
    return rows

  @classmethod
  def RowsToTemplateFormat(cls, reply):
    """Reformats BigQuery data to be a typed dict of fields and values.

    BigQuery by default returns row data as a generic collection of values:
        {'schema':{
            'fields':[{'name':'col1'},
                      {'name':'col2'}]},
         'rows':[{'f':[{'v':'foo'},
                       {'v':'bar'}]}]}

    This is helpful for binding, but not templates (Django, Soy).  This
    function transforms rows into a formal dictionary:
        {'schema':{
            'fields':[{'name':'col1'},
                      {'name':'col2'}]},
         'rows':[{'col1':'foo', 'col2':'bar'}]}

    Args:
      reply: The BigQuery reply object.

    Returns:
      Data from the reply, refactored to a formal list of field/value dicts.
    """
    target_rows = []
    fields = reply['schema']['fields']

    for source_row in reply['rows']:
      target_row = {}
      source_values = source_row['f']

      for ctr in xrange(len(fields)):
        field = fields[ctr]
        field_values = source_values[ctr]
        field_name = field['name']
        field_value = field_values['v']

        target_row[field_name] = field_value

      target_rows.append(target_row)

    return target_rows

  @classmethod
  def RowsToDataTableFormat(cls, reply):
    """Reformats BigQuery data to be a typed dict of fields and values.

    BigQuery by default returns row data as a generic collection of values:
        {'schema':{
            'fields':[{'name':'col1'},
                      {'name':'col2'}]},
         'rows':[{'f':[{'v':'foo'},
                       {'v':'bar'}]}]}

    This is helpful for binding, but not Google Visualization DataTables, which
      expect:
        {
            cols: [{id: 'A', label: 'NEW A', type: 'string'},
                   {id: 'B', label: 'B-label', type: 'number'},
                   {id: 'C', label: 'C-label', type: 'date'}
                  ],
            rows: [{c:[{v: 'a'}, {v: 1.0, f: 'One'},
                       {v: new Date(2008, 1, 28, 0, 31, 26),
                        f: '2/28/08 12:31 AM'}]},
                   {c:[{v: 'b'}, {v: 2.0, f: 'Two'},
                       {v: new Date(2008, 2, 30, 0, 31, 26),
                        f: '3/30/08 12:31 AM'}]},
                   {c:[{v: 'c'}, {v: 3.0, f: 'Three'},
                       {v: new Date(2008, 3, 30, 0, 31, 26),
                        f: '4/30/08 12:31 AM'}]}
                  ],
            p: {foo: 'hello', bar: 'world!'}
        }
    For more information on this format, see:
        https://developers.google.com/chart/interactive/docs/reference#DataTable_toJSON

    Args:
      reply: The BigQuery reply object.

    Returns:
      Data from the reply, refactored to a GViz DataTable Json object.
    """
    result_cols = []
    result_rows = []
    result = {'cols': result_cols, 'rows': result_rows}

    fields = reply['schema']['fields']

    for field_row in fields:
      result_cols.append({'id': field_row['name'], 'label': field_row['name'],
                          'type': cls.BQTypeToGVizType(field_row['type'])})

    for source_row in reply['rows']:
      target_cells = []
      target_row = {'c': target_cells}

      for values in source_row['f']:
        target_cells.append({'v': values['v']})

      result_rows.append(target_row)

    return result

  @classmethod
  def ConvertValuesToTypedData(cls, reply):
    """Converts non-string columns (int, etc.) to appropriately typed values."""
    if 'schema' not in reply:
      logging.warning(
          'schema was not defined in the reply, see bug 8854364:\n%s', reply)
    fields = reply['schema']['fields']

    for source_row in reply['rows']:
      for ctr in xrange(len(source_row['f'])):
        field = fields[ctr]
        values = source_row['f'][ctr]
        values['v'] = GetTypedValue(field['type'], values['v'])


def GetTypedValue(field_type, value):
  """Returns a typed value based on a schema description and string value.

  BigQuery's Query() method returns a JSON string that has all values stored
  as strings, though the schema contains the necessary type information.  This
  method provides conversion services to make it easy to persist the data in
  your JSON as "typed" data.

  Args:
    field_type: The field type (as defined by BigQuery).
    value: The field value, typed as a string.

  Returns:
    A value of the appropriate type.

  Raises:
    NotSupportedError: Raised if the field type is not supported.
  """
  if value is None:
    return None
  if field_type == FieldTypes.STRING:
    return value
  if field_type == FieldTypes.INTEGER:
    if value == 'NaN':
      return None
    else:
      return int(value)
  if field_type == FieldTypes.FLOAT:
    if value == 'NaN':
      return None
    else:
      return float(value)
  if field_type == FieldTypes.TIMESTAMP:
    if value == 'NaN':
      return None
    else:
      dt = datetime.datetime.utcfromtimestamp(float(value))
      return dt.isoformat(' ')
  if field_type == FieldTypes.BOOLEAN:
    return value.lower() == 'true'
  else:
    raise NotSupportedError(
        'Type {field_type} is not supported.'.format(field_type=field_type))
