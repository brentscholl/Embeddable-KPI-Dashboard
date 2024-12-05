import React, {useRef} from 'react';
import useResize from './hooks/useResize';
import Loading from './util/Loading'
import Error from './util/Error'
import {WarningIcon} from './icons';
import Spinner from './Spinner';
import Title from './Title';
import useDarkMode from './util/useDarkMode.js';


type Props = {
    title?: string;
    results?: DataResponse; // { isLoading, error, data: [{ <name>: <value>, ... }] }
    children?: JSX.Element;
};

export default (props: Props) => {

    const ref = useRef<HTMLDivElement | null>(null);
    const [width, height] = useResize(ref);

    const {results, title, children} = props;
    const {isLoading, error} = results;
    const {isDarkMode, containerRef} = useDarkMode();


    if (results?.error) {
        return (
            <div className="h-full flex items-center justify-center font-embeddable text-sm">
                <WarningIcon/>
                <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{results.error}</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-full">
            <div
                className="h-full relative font-embeddable text-sm flex flex-col p-4 rounded-md shadow border bg-white dark:bg-gray-800 dark:border-gray-800">
                <Spinner show={isLoading} className="absolute right-4 h-5 w-5 text-gray-300 dark:text-gray-600"/>
                <Title title={title}/>
                <div className="relative grow" ref={ref} style={{height: height + 'px'}}>
                    {children}
                    {results?.isLoading && !results?.data?.length && (
                        <div
                            className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded dark:bg-gray-700"/>
                    )}
                </div>
            </div>
        </div>
    );
};