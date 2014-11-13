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

Query class for a list of labels and values for a single product.

This query is used to provide the label/value dropdowns in the Explorer UI,
and includes the count for each label/value to allow for "order by usage".
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

import explorer_method
import label_manager


class ProductLabelsQuery(explorer_method.ExplorerQueryBase):
  """Returns per-product labels and values usage data.

  After execution, the 'rows' list will contain dictionaries of labels, values
  and counts.  This raw data will be processed by a LabelManager into a
  queryable structure.
  """

  def _Initialize(self):
    """Set up the query configuration (fields, tables, etc.)."""
    # pylint: disable=protected-access
    super(ProductLabelsQuery, self)._Initialize()

    self.tables = ['metadata_cube']

    self.fields = ['label', 'value', 'SUM(count) AS count']
    self.groups = ['label', 'value']
    self.orders = ['label', 'value']

    self.reply_processors += [self._ProcessReply]
    self.max_rows = 2000

  def Execute(self,
              start_date=None,
              end_date=None,
              product_name=None,
              test=None,
              metric=None):
    """Retrieves a list of labels and values for a specific product."""
    if start_date:
      start_date_expr = self.GetTimestampFromFilterExpression(start_date)
      self.wheres.append('day_timestamp >= %s' % start_date_expr)

    if end_date:
      end_date_expr = self.GetTimestampFromFilterExpression(end_date, True)
      self.wheres.append('day_timestamp <= %s' % end_date_expr)

    if product_name:
      self.wheres.append('product_name = "%s"' % product_name)

    if test:
      self.wheres.append('test = "%s"' % test)

    if metric:
      self.wheres.append('metric = "%s"' % metric)

    return super(ProductLabelsQuery, self).Execute()

  def _ProcessReply(self, reply):
    """Transforms the raw labels data into a JSON list."""
    rows = reply['rows']

    labels = label_manager.LabelManager()
    for row in rows:
      labels.AddLabel(row['label'], row['value'], row['count'])

    reply['labels'] = labels.labels
