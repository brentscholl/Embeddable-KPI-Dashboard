import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { Dataset, Dimension, Measure, loadData, Value } from '@embeddable.com/core';

import Component from './index';

export const meta: EmbeddedComponentMeta = {
    name: 'TrackingStatusFilter',
    label: 'Tracking Status Filter',
    classNames: ['on-top'],
    inputs: [
        {
            name: 'title',
            type: 'string',
            label: 'Title'
        },
        {
            name: 'ds',
            type: 'dataset',
            label: 'Dataset',
            description: 'Dataset',
            category: 'Set Filter Options'
        },
        {
            name: 'property',
            type: 'dimension',
            label: 'Property',
            config: {
                dataset: 'ds'
            },
            category: 'Set Filter Options'
        },
        {
            name: 'defaultValue',
            type: 'string',
            array: true,
            label: 'Default value',
            category: 'Set Filter Options'
        },
    ],
    events: [
        {
            name: 'onChange',
            label: 'Change',
            properties: [
                {
                    name: 'value',
                    type: 'string',
                    array: true
                }
            ]
        }
    ],
    variables: [
        {
            name: 'selected statuses',
            type: 'string',
            array: true,
            defaultValue: Value.noFilter(),
            inputs: ['defaultValue'],
            events: [{ name: 'onChange', property: 'value' }]
        }
    ]
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs: Inputs<typeof meta>, [embState]) => {
        return {
            ...inputs,
            options: loadData({
                from: inputs.ds,
                dimensions: [inputs.property],
            })
        };
    },
    events: {
        onChange: (value) => ({ value: value.length > 0 ? value : Value.noFilter() })
    }
});
