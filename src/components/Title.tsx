import React from 'react';

export default ({ title, color }: { title?: string; color?: string }) =>
    !!title && (
        <h2 className={`w-full text-base font-bold font-embeddable justify-start flex leading-6 mb-4 ${color ? `text-${color}-500` : 'text-gray-500 dark:text-gray-400'}`}>
            {title}
        </h2>
    );
