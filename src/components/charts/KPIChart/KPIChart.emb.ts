import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'KPIChart',
  label: 'KPI',
  defaultWidth: 200,
  defaultHeight: 150,
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Configure chart'
    },
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Configure chart'
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'KPI',
      config: {
        dataset: 'ds'
      },
      category: 'Configure chart'
    },
    {
      name: 'prefix',
      type: 'string',
      label: 'Prefix',
      description: 'Prefix',
      category: 'Chart settings'
    },
    {
      name: 'suffix',
      type: 'string',
      label: 'Suffix',
      description: 'Suffix',
      category: 'Chart settings'
    },
    {
      name: 'color',
      type: 'string',
      label: 'Color',
      description: 'Use tailwind colors. ex: primary, secondary, red, green, blue, indigo, etc',
      category: 'Chart settings'
    },
    {
      name: 'filterName',
      type: 'string',
      label: 'Filter Name',
      description: 'To pass a url query parameter to our app when clicked',
      category: 'Filter Settings'
    },
    {
      name: 'filterValue',
      type: 'string',
      label: 'Filter Value',
      description: 'To pass a url query parameter to our app when clicked',
      category: 'Filter Settings'
    }
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      value: loadData({
        from: inputs.ds,
        measures: [inputs.metric]
      })
    };
  },
});
