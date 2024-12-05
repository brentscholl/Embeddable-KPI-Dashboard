import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { DimensionOrMeasure, DataResponse, OrderBy, OrderDirection } from '@embeddable.com/core';
import { useEmbeddableState } from '@embeddable.com/react';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeaderCell } from '@tremor/react';

import useFont from '../../hooks/useFont';
import useResize from '../../hooks/useResize';

import Title from '../../Title';
import Spinner from '../../Spinner';
import { ChevronRight, ChevronLeft, SortDown, SortUp, WarningIcon } from '../../icons';

type Props = {
  title?: string;
  limit?: number;
  columns: DimensionOrMeasure[];
  maxPageRows?: number;
  tableData: DataResponse;
  defaultSort?: OrderBy[];
  debug: boolean;
};

const getEmbeddableState = (debug: boolean) =>
  debug
    ? (initialState: any) => [initialState, (newState: any) => (initialState = newState)]
    : useEmbeddableState;

const TableComponent: React.FC<Props> = (props) => {
  const { title, columns, tableData, debug, defaultSort } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [width, height] = useResize(ref);
  const embeddableState = getEmbeddableState(debug);

  const [meta, setMeta] = embeddableState({
    page: 0,
    maxRowsFit: 0,
    sort: defaultSort,
  });

  useFont();

  // Format cell content based on type
  const format = (text: any, column: DimensionOrMeasure) => {
    if (typeof text === 'number') {
      return new Intl.NumberFormat().format(text);
    }
    if (text && column.nativeType === 'time') {
      return text.endsWith('T00:00:00.000')
        ? new Intl.DateTimeFormat().format(new Date(text))
        : new Date(text).toLocaleString();
    }
    return text;
  };

  // Update sorting when column header is clicked
  const updateSort = useCallback(
    (column: DimensionOrMeasure) => {
      if (!meta) return;

      const sort = [...(meta.sort || [])];
      const invertDirection = { asc: 'desc', desc: 'asc' };
      const index = sort.findIndex((c) => c.property.name === column.name);

      if (index === 0) {
        sort[0] = { ...sort[0], direction: invertDirection[sort[0].direction] as OrderDirection };
      } else {
        const [newOrder] = sort.splice(index, 1);
        sort.unshift(newOrder);
      }

      setMeta({ ...meta, sort, page: 0 });
    },
    [meta, setMeta]
  );

  // Dynamically calculate max rows based on height
  useEffect(() => {
    const timeout = setTimeout(() => {
      const heightWithoutHead = height - 40; // Adjust height for table header
      const maxRowsFit = Math.floor(heightWithoutHead / 45); // Row height of 45px
      setMeta({ ...meta, maxRowsFit });
    }, 100);

    return () => clearTimeout(timeout);
  }, [height, setMeta]);

  // Map table data to rows
  const rows = useMemo(
    () =>
      tableData?.data?.map((record) =>
        columns?.map((prop) => {
          if (!prop) return '';
          const parsed = parseFloat(record[prop.name]);
          return `${parsed}` === record[prop.name] ? parsed : record[prop.name] || '';
        }) || []
      ) || [],
    [tableData, columns]
  );

  // Handle table data errors
  if (tableData?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{tableData?.error}</div>
      </div>
    );
  }

  return (
    <div className="h-full relative flex flex-col">
      <Title title={title} />
      <div className="grow flex flex-col justify-start w-full overflow-x-auto font-embeddable text-sm">
        <div
          className="grow overflow-hidden relative"
          style={{ minWidth: `${columns.length * 100}px` }}
          ref={ref}
        >
          {!!meta && !(tableData?.isLoading && !tableData?.data?.length) && (
            <Table className="overflow-visible">
              <TableHead className="border-y border-[#B8BDC6]">
                <TableRow>
                  {columns.map((header, index) => {
                    const sortIndex =
                      meta?.sort?.findIndex((c) => c.property.name === header.name) || 0;

                    return (
                      <TableHeaderCell
                        key={index}
                        onClick={() => updateSort(header)}
                        className="bg-white select-none cursor-pointer text-[#333942] p-3"
                      >
                        <div className="flex items-center font-bold text-sm">
                          <span className="block text-ellipsis overflow-hidden">{header.title}</span>
                          <div
                            className={`ml-1 ${
                              sortIndex === 0 ? 'text-[#FF6B6C]' : 'text-[#333942]'
                            }`}
                          >
                            {meta?.sort?.[sortIndex]?.direction === 'asc' ? (
                              <SortUp fill="currentcolor" />
                            ) : (
                              <SortDown fill="currentcolor" />
                            )}
                          </div>
                        </div>
                      </TableHeaderCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-400/5">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-sm text-dark p-3">
                        <span className="text-overflow-dynamic-container">
                          <span
                            className="text-overflow-dynamic-ellipsis"
                            title={format(cell, columns[cellIndex])}
                          >
                            {format(cell, columns[cellIndex])}
                          </span>
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!meta || (tableData?.isLoading && !tableData?.data?.length) ? (
            <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded" />
          ) : null}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex mt-2 items-center justify-center text-[12px] font-bold text-[#333942]">
        <ChevronLeft
          onClick={() => setMeta({ ...meta, page: Math.max(0, (meta.page || 0) - 1) })}
          className={`cursor-pointer w-8 h-8 p-1 border ${
            meta?.page === 0 ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
        <span className="mx-4">Page {meta?.page + 1}</span>
        <ChevronRight
          onClick={() => setMeta({ ...meta, page: (meta.page || 0) + 1 })}
          className={`cursor-pointer w-8 h-8 p-1 border ${
            props.limit && rows.length < props.limit ? 'opacity-50 pointer-events-none' : ''
          }`}
        />
      </div>
      <Spinner show={!meta || tableData?.isLoading} />
    </div>
  );
};

export default TableComponent;
