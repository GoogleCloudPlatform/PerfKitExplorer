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

Stores and provides access to a list of labels and associated values.

This information is used to provide labels and values in 'most-used' order,
rather than alphabetic ones.  In addition to storing the counts of label/values,
it also supports simple string-based serialization to facilitate usage in HTML
and JavaScript.
"""

__author__ = 'joemu@google.com (Joe Allan Muharsky)'

LABEL_BOUNDARY = '|'


class Error(Exception):
  pass


class UnexpectedFormatError(Error):
  """Thrown when the metadata string is improperly formatted."""


class LabelManager(object):
  """Manages a list of labels and values, along with their counts/weights.

  Labels are stored as a JSON list of dictionaries via self.labels.  Example:
    [{'name': 'label1', 'count': 2, 'values': [{'name': 'value1', 'count': 1},
                                               {'name': 'value2', 'count': 1}]},
     {'name': 'label2', 'count': 2, 'values': [{'name': 'value3', 'count': 1}]}]

  The ImportString() methods provide deserialization of
  'packed' labels from the data tier.  Example data for the above labels:
    ['|label1:value1|,|label2:value3|',
     '|label1:value2|,|label2|']

  Attributes:
    labels: A list of dictionaries, where each dict describes a label and its
        associated values.  See docstring above for more detail on this
        structure.
  """

  def __init__(self, labels=None):
    """Initializes the class.

    Args:
      labels: A list of labels and associated values.
    """
    self.labels = labels or []

  def GetLabel(self, label_name, create_if_none=False):
    """Returns the label specified by label_name, or optionally creates it.

    Args:
      label_name: The name of the label that will be located.
      create_if_none: If True, and the label is not found, it will be added
          and returned.

    Returns:
      A dictionary representing the current label.
    """
    label = next((item for item in self.labels
                  if item['name'] == label_name), None)
    if not label and create_if_none:
      label = {'name': label_name, 'count': 0, 'values': []}
      self.labels.append(label)

    return label

  def GetValue(self, label, value_name, create_if_none=False):
    """Returns the value in the given label, or optionally creates it.

    Args:
      label: A dictionary from the labels list.
      value_name: The name of the label that will be located.
      create_if_none: If True, and the value is not found, it will be added
          and returned.

    Returns:
      A dictionary representing the current value.
    """
    value = next((item for item in label['values']
                  if item['name'] == value_name), None)

    if not value and create_if_none:
      value = {'name': value_name, 'count': 0}
      label['values'].append(value)

    return value

  def AddLabel(self, label_name, value_name=None, count=1):
    """Adds a label to the labels list, or increases its count.

    Args:
      label_name: The name of the label to add/increment.
      value_name: The name of the value to add/increment.
      count: The amount to increase the count by.  This defaults to 1.
    """
    label = self.GetLabel(label_name, create_if_none=True)
    label['count'] += count

    if value_name:
      value = self.GetValue(label, value_name, create_if_none=True)
      value['count'] += count

  def ImportString(self, src, count=1):
    """Deserializes a packed string of label/values into the labels list.

    Args:
      src: A string of packed label/values.  The format for packed labels is:
          |label:value|,|label:value|
      count: The amount to increase the count by.  This defaults to 1, and can
          be changed if aggregate/usage data on labels is being loaded.

    Raises:
      UnexpectedFormatError: Raised if the src string is not in the expected
          format.
    """
    if src:
      if not src.startswith(LABEL_BOUNDARY):
        raise UnexpectedFormatError('Labels string must start with a |')
      if not src.endswith(LABEL_BOUNDARY):
        raise UnexpectedFormatError('Labels string must end with a |')

      src = src.strip(LABEL_BOUNDARY)
      label_strings = src.split('{boundary},{boundary}'.format(
          boundary=LABEL_BOUNDARY))
      label_strings.sort()
      for label_string in label_strings:
        label_array = label_string.split(':')

        self.AddLabel(label_name=label_array[0],
                      value_name=label_array[1],
                      count=count)
