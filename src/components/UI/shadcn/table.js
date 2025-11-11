import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

// Table Container
export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  /* Remove border and scroll for nested tables */
  &.custom-draggable-table {
    border: none;
    overflow: visible;
  }
`;

// Table Element
export const TableElement = styled.table`
  width: 100%;
  caption-side: bottom;
  border-collapse: collapse;
  font-size: 14px;
`;

// Table Header
export const TableHeader = styled.thead`
  background: hsl(var(--muted));
  transition: background-color 0.3s ease;
  
  tr {
    border-bottom: 1px solid hsl(var(--border));
  }
`;

// Table Body
export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid hsl(var(--border));
    transition: all 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:not(.sub-action-row):hover {
      background: hsl(var(--muted) / 0.5);
    }
    
    &.selected {
      background: hsl(var(--primary) / 0.1);
    }
    
    &.clickable {
      cursor: pointer;
    }
  }
`;

// Table Footer
export const TableFooter = styled.tfoot`
  background: hsl(var(--muted));
  border-top: 1px solid hsl(var(--border));
  font-weight: 500;
  transition: background-color 0.3s ease;
`;

// Table Row
export const TableRow = styled.tr`
  border-bottom: 1px solid hsl(var(--border));
  transition: background-color 0.15s ease, border-color 0.3s ease;
  
  /* Regular row hover - exclude expanded rows */
  &:not(.expanded-row):hover {
    background: hsl(var(--muted) / 0.5);
  }
  
  &.selected {
    background: hsl(var(--accent));
  }
  
  &.clickable {
    cursor: pointer;
  }
  
  /* Expanded row styling - no hover, different background */
  &.expanded-row {
    background: transparent;
    
    &:hover {
      background: transparent;
    }
    
    td {
      padding: 16px 16px 16px 40px !important;
      border-bottom: none;
    }
  }
  
  /* Parent row of expanded content - remove bottom border */
  &.has-expanded-content {
    border-bottom: none;
  }
`;

// Table Head Cell
export const TableHead = styled.th`
  height: 48px;
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
  font-weight: 600;
  color: hsl(var(--foreground));
  white-space: nowrap;
  transition: color 0.3s ease;
  
  &.sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      color: hsl(var(--primary));
    }
  }
  
  &.align-center {
    text-align: center;
  }
  
  &.align-right {
    text-align: right;
  }
`;

// Table Cell
export const TableCell = styled.td`
  padding: 12px 16px;
  vertical-align: middle;
  color: hsl(var(--foreground));
  transition: color 0.3s ease;
  
  &.align-center {
    text-align: center;
  }
  
  &.align-right {
    text-align: right;
  }
`;

// Sort Icon Component
const SortIcon = ({ direction }) => {
  if (direction === 'asc') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }}
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    );
  }
  if (direction === 'desc') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle', opacity: 0.3 }}
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
};

// Main Table Component (Ant Design compatible API)
export function Table({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  pagination = false,
  loading = false,
  onRow,
  rowSelection,
  expandable,
  className,
  expandedRowKeys: controlledExpandedRowKeys,
  onExpand,
  showHeader = true,
  ...props
}) {
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState(rowSelection?.selectedRowKeys || []);
  const [internalExpandedRowKeys, setInternalExpandedRowKeys] = useState([]);
  
  // Use controlled expandedRowKeys if provided, otherwise use internal state
  const expandedRowKeys = controlledExpandedRowKeys !== undefined 
    ? controlledExpandedRowKeys 
    : internalExpandedRowKeys;

  // Handle sorting
  const handleSort = (column) => {
    if (!column.sorter) return;

    const { key, dataIndex } = column;
    const columnKey = key || dataIndex;
    
    let direction = 'asc';
    if (sortedInfo.columnKey === columnKey) {
      if (sortedInfo.order === 'asc') direction = 'desc';
      else if (sortedInfo.order === 'desc') direction = null;
    }

    setSortedInfo(direction ? { columnKey, order: direction } : {});
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortedInfo.columnKey) return dataSource;

    const column = columns.find(col => (col.key || col.dataIndex) === sortedInfo.columnKey);
    if (!column || !column.sorter) return dataSource;

    const sorted = [...dataSource].sort((a, b) => {
      if (typeof column.sorter === 'function') {
        return column.sorter(a, b);
      }
      
      const aVal = a[column.dataIndex];
      const bVal = b[column.dataIndex];
      
      if (aVal < bVal) return sortedInfo.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortedInfo.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [dataSource, sortedInfo, columns]);

  // Handle row selection
  const handleSelectRow = (record) => {
    if (!rowSelection) return;

    const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];
    const newSelectedKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter(k => k !== key)
      : [...selectedRowKeys, key];

    setSelectedRowKeys(newSelectedKeys);
    rowSelection.onChange?.(newSelectedKeys, sortedData.filter(r => 
      newSelectedKeys.includes(typeof rowKey === 'function' ? rowKey(r) : r[rowKey])
    ));
  };

  const handleSelectAll = (checked) => {
    if (!rowSelection) return;

    const newSelectedKeys = checked 
      ? sortedData.map(r => typeof rowKey === 'function' ? rowKey(r) : r[rowKey])
      : [];

    setSelectedRowKeys(newSelectedKeys);
    rowSelection.onChange?.(newSelectedKeys, checked ? sortedData : []);
  };

  // Handle row expansion
  const handleExpandRow = (record, event) => {
    if (!expandable) return;

    const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];
    const isExpanding = !expandedRowKeys.includes(key);
    
    // If expandedRowKeys is controlled, call onExpand callback
    if (controlledExpandedRowKeys !== undefined && onExpand) {
      onExpand(isExpanding, record);
    } else {
      // Otherwise use internal state
      const newExpandedKeys = isExpanding
        ? [...expandedRowKeys, key]
        : expandedRowKeys.filter(k => k !== key);
      setInternalExpandedRowKeys(newExpandedKeys);
    }
  };

  if (loading) {
    return (
      <TableContainer>
        <div style={{ padding: '40px', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
          <div style={{ marginBottom: '12px' }}>Loading...</div>
        </div>
      </TableContainer>
    );
  }

  if (!sortedData || sortedData.length === 0) {
    return (
      <TableContainer>
        <div style={{ padding: '40px', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
          <div style={{ marginBottom: '12px' }}>No data</div>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer className={className} {...props}>
      <TableElement>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {rowSelection && (
                <TableHead style={{ width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRowKeys.length === sortedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}
              {expandable && <TableHead style={{ width: '48px' }}></TableHead>}
              {columns.map((column, index) => {
              const columnKey = column.key || column.dataIndex || index;
              const isSorted = sortedInfo.columnKey === columnKey;
              
              return (
                <TableHead
                  key={columnKey}
                  className={`${column.sorter ? 'sortable' : ''} ${column.align ? `align-${column.align}` : ''}`}
                  onClick={() => column.sorter && handleSort(column)}
                  style={{ width: column.width }}
                >
                  {column.title}
                  {column.sorter && <SortIcon direction={isSorted ? sortedInfo.order : null} />}
                </TableHead>
              );
            })}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {sortedData.map((record, recordIndex) => {
            const key = typeof rowKey === 'function' ? rowKey(record, recordIndex) : record[rowKey] || recordIndex;
            const isSelected = selectedRowKeys.includes(key);
            const isExpanded = expandedRowKeys.includes(key);
                  const rowProps = onRow?.(record, recordIndex) || {};
                  
                  // Handle expandRowByClick
                  const handleRowClick = (e) => {
                    if (expandable?.expandRowByClick && !e.target.closest('button, a, input, [role="button"]')) {
                      handleExpandRow(record, e);
                    }
                    rowProps.onClick?.(e);
                  };

                  return (
                    <React.Fragment key={key}>
                      <TableRow
                        className={`${isSelected ? 'selected' : ''} ${rowProps.onClick || expandable?.expandRowByClick ? 'clickable' : ''} ${isExpanded ? 'has-expanded-content' : ''}`}
                        {...rowProps}
                        onClick={handleRowClick}
                      >
                  {rowSelection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(record)}
                      />
                    </TableCell>
                  )}
                  {expandable && (
                    <TableCell style={{ width: '48px', paddingRight: '8px' }}>
                      {expandable.expandIcon ? (
                        expandable.expandIcon({
                          expanded: isExpanded,
                          onExpand: (record, e) => handleExpandRow(record, e),
                          record
                        })
                      ) : (
                        <button
                          onClick={(e) => handleExpandRow(record, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => {
                    const columnKey = column.key || column.dataIndex || colIndex;
                    const value = column.dataIndex ? record[column.dataIndex] : undefined;
                    const content = column.render 
                      ? column.render(value, record, recordIndex)
                      : value;

                    return (
                      <TableCell
                        key={columnKey}
                        className={column.align ? `align-${column.align}` : ''}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
                      {expandable && isExpanded && expandable.expandedRowRender && (
                        <TableRow className={`expanded-row ${expandable.expandedRowClassName?.() || ''}`}>
                          <TableCell 
                            colSpan={columns.length + (rowSelection ? 1 : 0) + 1}
                          >
                            <div style={{
                              position: 'relative',
                              marginLeft: '24px',
                              paddingLeft: '24px',
                              borderLeft: '2px solid hsl(var(--primary) / 0.3)',
                            }}>
                              <div style={{
                                background: 'hsl(var(--muted) / 0.15)',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)'
                              }}>
                                {expandable.expandedRowRender(record, recordIndex)}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </TableElement>
    </TableContainer>
  );
}

export default Table;

