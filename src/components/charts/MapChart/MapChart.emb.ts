import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { Dataset, Dimension, Measure, loadData } from '@embeddable.com/core';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'MapChart',
    label: 'Map Chart',
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title',
            description: 'The title for the chart'
        },
        {
            name: 'ds',
            type: 'dataset',
            label: 'Dataset',
            description: 'Dataset',
            defaultValue: false
        },
        {
            name: 'segments',
            type: 'dimension',
            label: 'States',
            config: {
                dataset: 'ds'
            }
        },
        {
            name: 'statuses',
            type: 'dimension',
            label: 'Statuses',
            config: {
                dataset: 'ds'
            }
        },
        {
            name: 'metric',
            type: 'measure',
            label: 'Metric',
            config: {
                dataset: 'ds'
            }
        }
    ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
    props: (inputs: Inputs<typeof meta>) => {
        return {
            ...inputs,
            db: loadData({
                from: inputs.ds,
                dimensions: [inputs.segments, inputs.statuses],
                measures: [inputs.metric],
                limit: 10000
            })
        };
    }
});