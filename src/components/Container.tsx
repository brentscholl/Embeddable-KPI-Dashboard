import { DataResponse } from '@embeddable.com/react';
import React, { ReactNode, useRef } from 'react';

import useFont from './hooks/useFont';
import useResize from './hooks/useResize';
import Spinner from './Spinner';
import Title from './Title';
import { WarningIcon } from './icons';
import './index.css';
import useDarkMode from './util/useDarkMode.js';


type Props = {
    title?: string;
    results?: DataResponse;
    children?: ReactNode;
    showSpinner?: boolean;
};

export default (props: Props) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [width, height] = useResize(ref);
    const { results, title, children, showSpinner = true } = props;
    const { isLoading, error, data } = results || {};
    const noData = results && !isLoading && !data?.length;
    const { isDarkMode, containerRef } = useDarkMode();

    useFont();

    if (error || noData) {
        return (
            <div className="h-full flex items-center justify-center font-embeddable text-sm">
                <WarningIcon />
                <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{error || 'No data'}</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-full relative font-embeddable text-sm flex flex-col">
            {showSpinner && <Spinner show={isLoading} className="absolute right-4 h-5 w-5 text-gray-300 dark:text-gray-600"/>}
            <Title title={title} />
            <div className="relative grow flex flex-col" ref={ref}>
                {children}
                {results?.isLoading && !results?.data?.length && (
                    <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded dark:bg-gray-700" />
                )}
            </div>
        </div>
    );
};