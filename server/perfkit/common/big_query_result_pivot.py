"""Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Transforms BigQuery data with a single-row/column pivot.

A Pivot transformation lets you take a standard, tabular result set and
produce a column for each unique value in a specified field.  Pivots are
especially helpful in converting a column to a series in a chart.  A Pivot
is based on three key fields, chosen from the 'reply' parameter:
  Row: This field appears as the first column in the result.
  Column: For each unique value in this field, a column will be added to
      the result.
  Value: This field appears as the column value for the corresponding row.

To illustrate this, take the following 'reply':

date     size      cost    notes
Jan 1    small     25      The notes column
Jan 1    medium    35      will not be
Jan 1    large     45      specified in the
Feb 1    small     27      pivot, so it can
Feb 1    medium    35      be ignored.
Feb 1    large     52

And we transform it with the following settings:
row='date', column='size', value='cost'

We would get the following result:

date     small     medium     large
Jan 1    25        35         45
Feb 1    27        35         52

Note the following restrictions:
* For efficiency, the result set must be reduced to a single value per row/
    column.  A TooManyValuesError will be raised if more than one is found.
"""


import logging


class Error(Exception):
  pass


class DuplicateValueError(Error):
  pass


class BigQueryPivotTransformer(object):
  """Transforms a BigQuery reply by pivoting it."""

  def __init__(self, reply, rows_name, columns_name, values_name):
    """Initializes a new transformer.  See module docstring for a description.

    Args:
      reply: The BigQuery reply object.  A row in the result will appear for
          each row in the reply.
      rows_name: The column name that will appear as the first column of the
          Pivot.  The information in this column is copied as-is.
      columns_name: Each unique value in this column name will appear as a
          column in the target.
      values_name: Each value in this column name will appear in the matching
          column/row.
    """
    self.reply = reply
    self.rows_name = rows_name
    self.columns_name = columns_name
    self.values_name = values_name

    self.transformed_schema = None
    self.transformed_rows = None

    self.Initialize()

  def Initialize(self):
    self.transformed_schema = {'fields': []}
    self.transformed_rows = []

  def Transform(self, modify_reply=True, initialize_first=True):
    """Transforms a BigQuery reply with a pivot.

    Note that the pivot is "ragged", in that rows will only contain values up
    until the "last" column with data.  This format is acceptable for GViz, and
    the data will load as though all "missing" columns existed with a value of
    None.

    Args:
      modify_reply: If True, the 'rows' and 'schema' attributes will be
          modified by this method.  Otherwise, they are still accessible after
          Transform() by self.transformed_schema and self.transformed_rows.
      initialize_first: If True, transformed_schema and _rows will be erased
          before processing begins.

    Raises:
      ValueError: Raised if a column value matches the row name.
      DuplicateValueError: Raised if a value already exists for a provided
          row/column.
    """
    if initialize_first:
      self.Initialize()

    rows_field = self.GetColumn(self.reply['schema'], self.rows_name)
    columns_field = self.GetColumn(self.reply['schema'], self.columns_name)
    values_field = self.GetColumn(self.reply['schema'], self.values_name)

    row_headers = {}
    row_count = 0
    column_headers = {}
    column_count = 0

    source_rows_field_index = self.reply['schema']['fields'].index(
        rows_field)
    source_columns_field_index = self.reply['schema']['fields'].index(
        columns_field)
    source_values_field_index = self.reply['schema']['fields'].index(
        values_field)

    self.AddPivotField(
        field_name=rows_field['name'],
        field_type=rows_field['type'],
        field_mode=rows_field['mode'])

    for data_row in self.reply['rows']:
      row_name = data_row['f'][source_rows_field_index]['v']
      column_name = data_row['f'][source_columns_field_index]['v']
      value = data_row['f'][source_values_field_index]['v']

      # Find or create the row entry matching the current value.
      if row_name in row_headers:
        row_index = row_headers[row_name]
        row = self.transformed_rows[row_index]
      else:
        row = {'f': [{'v': row_name}]}
        self.transformed_rows.append(row)
        row_index = row_count
        row_headers[row_name] = row_count
        row_count += 1

      # Find or create the column entry matching the current value.
      if column_name in column_headers:
        column_index = column_headers[column_name]
      else:
        self.AddPivotField(
            field_name=column_name,
            field_type=values_field['type'],
            field_mode='NULLABLE')
        column_index = column_count + 1
        column_headers[column_name] = column_index
        column_count += 1

      # If a 'column' value is the same as the 'row' heading, raise an error.
      if column_index == 0:
        raise ValueError(
            'Column value \'%s\' is the same as the row heading name.'
            % column_name)

      # If there aren't enough values in the current row, add empty values.
      while column_index > (len(self.transformed_rows[row_index]['f']) - 1):
        self.transformed_rows[row_index]['f'].append({'v': None})

      # If the target cell already has a value, throw an error.
      if self.transformed_rows[row_index]['f'][column_index]['v']:
        logging.error(
            'Pivot failed: value already exists at row "%s", col "%s".',
            row_name, column_name)
        raise DuplicateValueError()

      # Set the value of the target cell.
      self.transformed_rows[row_index]['f'][column_index]['v'] = value

    if modify_reply:
      self.reply['schema'] = self.transformed_schema
      self.reply['rows'] = self.transformed_rows

  def GetColumn(self, schema, field_name):
    """Returns a BQ column reference from transformed_schema.

    Args:
      schema: The BigQuery schema object to search.
      field_name: A value.  The type is dependent on the 'type' attribute of
          field_schema.

    Returns:
      A BigQuery field object.

    Raises:
      ValueError: Raised if field_name cannot be found.
    """
    result = next((field for field in schema['fields']
                   if field['name'] == field_name), None)

    if not result:
      raise ValueError(
          'Field name "%s" not found in Pivot Columns.' % field_name)

    return result

  def AddPivotField(self, field_name, field_type, field_mode):
    """Adds a BQ field definition to the schema.

    For more info on BQ fields and the JSON schema, see:
      https://developers.google.com/bigquery/docs/reference/v2/jobs

    Args:
      field_name: The name of the field to create.
      field_type: The type of the field to create.
      field_mode: The mode of the field to create.

    Returns:
      An object representing a BQ column definition.
    """
    field = {'name': field_name, 'type': field_type, 'mode': field_mode}
    self.transformed_schema['fields'].append(field)

    return field
