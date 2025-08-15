import React, { useState, useEffect, useCallback, useRef, Suspense, lazy, useMemo } from 'react';
import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useDataTableColumns } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import { Search, X, FileText, Columns, RefreshCw, Eye, EyeOff, GripVertical, ChevronDown, Filter } from 'lucide-react';
import get from 'lodash/get';

// Lazy-loaded heavy components
const Tippy = lazy(() => import('@tippyjs/react').then(m => ({ default: m.default })));

// Dynamically import icons on demand
const IconCaretDown = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconCaretDown })));
const IconRefresh = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconRefresh })));
const IconX = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconX })));
const IconFile = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconFile })));
const IconFilter = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconFilter })));
const IconColumns = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconColumns })));
const IconGripVertical = lazy(() => import('@tabler/icons-react').then(m => ({ default: m.IconGripVertical })));

// Local components with lazy loading

// Utils with optimized imports
import IconLoader from '../Icon/IconLoader';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import Dropdown from '../Dropdown';

export type ColumnDefinition = {
    accessor: string;
    title: string;
    sortable?: boolean;
    hidden?: boolean;
    draggable?: boolean;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    textAlign?: 'left' | 'center' | 'right';
    render?: (item: any) => React.ReactNode;
    ellipsis?: boolean; // Add ellipsis option
    wrap?: boolean; // Add text wrapping option
};

type DraggableDataTableProps = {
    data: any[];
    columns: Array<ColumnDefinition>;
    loading?: boolean;
    title: string;
    quickCheckFields?: string[];
    exportFileName?: string;
    storeKey?: string; // Key for storing column preferences
    onRefreshData?: () => void;
    onSearch?: (query: string) => void;
    allowSelection?: boolean;
    actionButtons?: React.ReactNode;
    // Change bulkActions to a function that receives selected records
    bulkActions?: (selectedRecords: any[]) => React.ReactNode;
    extraFilters?: React.ReactNode;
    headerContent?: React.ReactNode;
    // Optional: Add onSelectionChange to expose selection changes to parent
    onSelectionChange?: (selected: any[]) => void;
    selectedRecords?: any[]; // Add selectedRecords as a prop to control from parent
    onClearFilters?: () => void; // Add callback for clearing filters
    hasActiveFilters?: boolean; // Add prop to indicate if filters are active
};

const DraggableDataTable: React.FC<DraggableDataTableProps> = ({
    data,
    columns: initialColumns,
    loading,
    title,
    exportFileName = 'exported-data',
    storeKey = 'data-table-columns', // Default storage key
    onRefreshData,
    onSearch,
    allowSelection = true,
    actionButtons,
    bulkActions,
    quickCheckFields = ['id', 'name', 'title', 'email', 'phone', 'invoice_number'],
    extraFilters,
    headerContent,
    onSelectionChange,
    selectedRecords: externalSelectedRecords, // Receive from props if provided
    onClearFilters,
    hasActiveFilters = false,
}) => {
    // Get state from localStorage if available
    const loadVisibleColumns = () => {
        try {
            const saved = localStorage.getItem(`${storeKey}-visibility`);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading column visibility', error);
        }
        return initialColumns.filter((col) => !col.hidden).map((col) => col.accessor);
    };

    // Local state for column visibility management
    const [visibleColumns, setVisibleColumns] = useState<string[]>(loadVisibleColumns());

    // Save visibility state to localStorage
    useEffect(() => {
        localStorage.setItem(`${storeKey}-visibility`, JSON.stringify(visibleColumns));
    }, [visibleColumns, storeKey]);

    // Prepare columns with draggable property
    const visibleColumnsWithDraggable = useMemo(() => {
        if (!Array.isArray(initialColumns)) {
            console.error('initialColumns is not an array:', initialColumns);
            return [];
        }
        
        return initialColumns
            .filter((col) => visibleColumns.includes(col.accessor))
            .map((col) => ({
                ...col,
                draggable: true,
            }));
    }, [initialColumns, visibleColumns]);

    // Use Mantine's built-in column management hook - only for visible columns
    const { effectiveColumns = [], setColumnsOrder, resetColumnsOrder } = useDataTableColumns({
        key: storeKey,
        columns: visibleColumnsWithDraggable || [],
    });

    // Ref for column dropdown to prevent it from closing on toggle click
    const columnDropdownRef = useRef<any>(null);

    // Custom toggleColumnVisibility function with event stopping
    const toggleColumnVisibility = useCallback((accessor: string, event?: React.MouseEvent) => {
        // Stop event propagation to prevent dropdown from closing
        event?.stopPropagation();

        setVisibleColumns((prev) => {
            // If it's already visible, hide it
            if (prev.includes(accessor)) {
                return prev.filter((a) => a !== accessor);
            }
            // Otherwise show it
            return [...prev, accessor];
        });
    }, []);

    // Custom reset function
    const handleResetColumns = useCallback(
        (event?: React.MouseEvent) => {
            // Stop event propagation
            event?.stopPropagation();

            // Reset visibility
            const defaultVisible = initialColumns.filter((col) => !col.hidden).map((col) => col.accessor);
            setVisibleColumns(defaultVisible);

            // Reset order
            resetColumnsOrder();
        },
        [initialColumns, resetColumnsOrder]
    );

    // State management
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>(data);
    // Use external selected records if provided, otherwise use local state
    const [internalSelectedRecords, setInternalSelectedRecords] = useState<any[]>([]);
    const selectedRecords = externalSelectedRecords !== undefined ? externalSelectedRecords : internalSelectedRecords;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: initialColumns[0]?.accessor || 'id',
        direction: 'asc',
    });

    // Handle selection changes
    const handleSelectionChange = useCallback(
        (records: any[]) => {
            // Only update internal state if external records not provided
            if (externalSelectedRecords === undefined) {
                setInternalSelectedRecords(records);
            }
            // Also notify parent component if callback provided
            onSelectionChange?.(records);
        },
        [onSelectionChange, externalSelectedRecords]
    );

    // Update filtered data when data changes
    useEffect(() => {
        if (Array.isArray(data)) {
            setFilteredData(data);
        } else {
            console.error('Data is not an array:', data);
            setFilteredData([]);
        }
    }, [data]);

    // Optimized column-focused search function
    useEffect(() => {
        if (!search.trim()) {
            setFilteredData(data);
            return;
        }

        const searchLower = search.toLowerCase();
        const accessors = initialColumns.map((col) => ({
            path: col.accessor,
            render: col.render,
        }));

        const result = data.filter((item) => {
            // First try exact matches on key identifiers for better performance
            // These quick checks can avoid more expensive operations for common searches
            for (const field of quickCheckFields) {
                const value = get(item, field);
                if (value && String(value).toLowerCase().includes(searchLower)) {
                    return true;
                }
            }

            // Then check each column accessor
            return accessors.some(({ path, render }) => {
                // Get value using the accessor path
                const value = get(item, path);

                // Skip undefined/null values
                if (value === null || value === undefined) {
                    return false;
                }

                // For primitive values, do direct string comparison
                if (typeof value !== 'object') {
                    return String(value).toLowerCase().includes(searchLower);
                }

                // For dates, check formatted strings
                if (value instanceof Date) {
                    return value.toLocaleDateString().toLowerCase().includes(searchLower) || value.toISOString().toLowerCase().includes(searchLower);
                }

                // For objects (like nested entities)
                if (typeof value === 'object') {
                    // Check common name properties first
                    const nameProps = ['name', 'title', 'label', 'full_name', 'description'];
                    for (const prop of nameProps) {
                        if (value[prop] && String(value[prop]).toLowerCase().includes(searchLower)) {
                            return true;
                        }
                    }

                    // Check all string properties for small objects
                    if (Object.keys(value).length < 10) {
                        for (const [key, val] of Object.entries(value)) {
                            if (typeof val === 'string' && val.toLowerCase().includes(searchLower)) {
                                return true;
                            }
                        }
                    }

                    // As a fallback, stringify the object, but only for smaller objects to avoid performance issues
                    if (Object.keys(value).length < 10) {
                        try {
                            return JSON.stringify(value).toLowerCase().includes(searchLower);
                        } catch (e) {
                            // If stringification fails, skip
                            return false;
                        }
                    }
                }

                return false;
            });
        });

        setFilteredData(result);
    }, [data, search, initialColumns, quickCheckFields]);

    // Handle search input change
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearch(value);
            onSearch?.(value);
        },
        [onSearch]
    );

    // Export data to Excel
    const handleExportExcel = useCallback(async () => {
        const { downloadExcel } = await import('react-export-table-to-excel');
        const visibleColumnsData = effectiveColumns;

        const header = visibleColumnsData.map((col) => col.title);
        const body = filteredData.map((item) =>
            visibleColumnsData.map((col) => {
                // Handle nested properties
                const getNestedValue = (obj: any, path: string): any => {
                    const parts = path.split('.');
                    if (parts.length === 1) return obj?.[path];

                    const [first, ...rest] = parts;
                    const restPath = rest.join('.');
                    return obj?.[first] ? getNestedValue(obj[first], restPath) : undefined;
                };

                const value = getNestedValue(item, String(col.accessor));
                return value !== undefined ? String(value) : '';
            })
        );

        try {
            downloadExcel({
                fileName: exportFileName,
                sheet: title,
                tablePayload: {
                    header: header as unknown as string[],
                    body,
                },
            });
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data. Please try again.');
        }
    }, [effectiveColumns, filteredData, exportFileName, title]);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearch('');
        onSearch?.('');
    }, [onSearch]);

    const NoRecordsFound = () => (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7v10c0 3-1 4-4 4H7c-3 0-4-1-4-4V7c0-3 1-4 4-4h10c3 0 4 1 4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h8M8 17h5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <p>No records found</p>
        </div>
    );

    return (
        <div className="panel mt-6 overflow-hidden rounded-xl bg-white dark:bg-gray-800/95 shadow-sm border border-gray-200/80 dark:border-gray-700/80">
            {/* Header content if provided */}
            {headerContent && (
                <div className="border-b border-gray-200/80 dark:border-gray-700/80">
                    {headerContent}
                </div>
            )}

            {/* Title and action buttons */}
            <div className="flex md:items-center md:flex-row flex-col gap-4 p-5 border-b border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800/95">
                {/* Title with styled badge */}
                <div className="flex items-center">
                    <h5 className="font-semibold text-lg text-gray-800 dark:text-white">{title}</h5>
                    {filteredData.length > 0 && (
                        <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
                            {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 md:ml-auto w-full md:w-auto">
                    {/* Search input with enhanced styling */}
                    <div className="relative flex-grow md:flex-grow-0 w-full md:w-64">
                        <input
                            type="text"
                            className="form-input w-full pl-9 pr-10 py-2 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/80 focus:border-primary dark:focus:border-primary focus:ring focus:ring-primary/20 dark:focus:ring-primary/40 transition-colors shadow-sm"
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                        {search && (
                            <button 
                                type="button" 
                                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
                                onClick={clearSearch}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Controls Group - Export, Column Toggle, Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Export button */}
                        <button 
                            type="button" 
                            className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/80 flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                            onClick={handleExportExcel}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Export</span>
                        </button>

                        {/* Column visibility dropdown with enhanced styling */}
                        <Dropdown
                            ref={columnDropdownRef}
                            placement="bottom-start"
                            btnClassName="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/80 transition-colors shadow-sm hover:shadow"
                            button={
                                <>
                                    <IconColumns className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Columns</span>
                                    <IconCaretDown className="w-4 h-4 ml-2" />
                                </>
                            }
                            dropdownClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg py-2"
                            closeOnSelect={false} // Important: Prevent closing on selection
                        >
                            <div
                                className="p-3 bg-white dark:bg-gray-800 min-w-[250px] rounded-md"
                                onClick={(e) => e.stopPropagation()} // Stop event propagation at the container level
                            >
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Manage Columns</span>
                                    <button
                                        className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 px-2 py-1 rounded-md transition-colors font-medium"
                                        onClick={(e) => handleResetColumns(e)}
                                        title="Reset to default columns"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <ul className="max-h-[250px] overflow-y-auto space-y-1">
                                    {initialColumns.map((column) => {
                                        const isVisible = visibleColumns.includes(column.accessor);
                                        return (
                                            <li key={column.accessor} className="mb-1">
                                                <label
                                                    className={`flex items-center py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                                        isVisible ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                                                    }`}
                                                    onClick={(e) => e.stopPropagation()} // Stop propagation on the label too
                                                >
                                                    <div className="mr-2">
                                                        {isVisible ? 
                                                            <IconEye className="w-4 h-4 text-blue-500 dark:text-blue-400" /> :
                                                            <IconEyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        }
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex-1">{column.title}</span>
                                                    <div className="ml-auto flex items-center">
                                                        <button 
                                                            type="button" 
                                                            className="relative inline-flex items-center cursor-pointer" 
                                                            onClick={(e) => toggleColumnVisibility(column.accessor, e)}
                                                            title={`${isVisible ? 'Hide' : 'Show'} ${column.title} column`}
                                                        >
                                                            <input type="checkbox" checked={isVisible} readOnly className="sr-only peer" />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </button>
                                                        <IconGripVertical className="ml-2 text-gray-400 w-4 h-4" />
                                                    </div>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Dropdown>

                        {/* Filter button - if we have extra filters */}
                        {extraFilters && (
                            <Dropdown
                                placement="bottom-end"
                                btnClassName="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/80 transition-colors shadow-sm hover:shadow"
                                button={
                                    <>
                                        <IconFilter className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Filters</span>
                                        {hasActiveFilters && (
                                            <span className="ml-1 w-2 h-2 bg-red-500 rounded-full" title="Active filters"></span>
                                        )}
                                    </>
                                }
                                dropdownClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg py-2"
                            >
                                <div className="p-3 bg-white dark:bg-gray-800 min-w-[250px] rounded-md">
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Filters</span>
                                        {hasActiveFilters && onClearFilters && (
                                            <div className="flex justify-end mb-2">
                                                <button
                                                    onClick={onClearFilters}
                                                    className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1"
                                                    title="Clear all active filters"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        )}
                                        {extraFilters}
                                    </div>
                                </div>
                            </Dropdown>
                        )}

                        {/* Refresh button */}
                        {onRefreshData && (
                            <Tippy content="Refresh data">
                                <button
                                    type="button"
                                    className="btn bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-9 h-9 p-0 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600/80 text-gray-700 dark:text-gray-300 transition-colors shadow-sm hover:shadow"
                                    onClick={onRefreshData}
                                >
                                    <IconRefresh className="w-5 h-5" />
                                </button>
                            </Tippy>
                        )}
                    </div>

                    {/* Action buttons */}
                    {actionButtons}
                </div>
            </div>

            {/* Bulk actions bar - Fixed at top with conditional rendering */}
            {selectedRecords.length > 0 && bulkActions && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800/50">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 pl-2">
                        {selectedRecords.length} {selectedRecords.length === 1 ? 'item' : 'items'} selected
                    </span>
                    <div className="flex items-center gap-1">
                        {bulkActions(selectedRecords)}
                    </div>
                </div>
            )}

            {/* Data table with enhanced styling */}
            <div className="datatables p-5">
                <DataTable
                    className="bg-white dark:bg-gray-800/90 rounded-lg overflow-hidden border-gray-200 dark:border-gray-700"
                    records={Array.isArray(filteredData) ? filteredData : []}
                    columns={Array.isArray(effectiveColumns) ? effectiveColumns.map(col => ({
                        ...col,
                        // Add proper width and text handling
                        width: col.width || 150,
                        // Remove minWidth and maxWidth (not supported by DataTableColumn)
                        ellipsis: col.ellipsis !== false, // Default to true
                        textAlign: col.textAlign || 'left',
                        // Add custom cell rendering for better text handling
                        render: (item: any) => {
                            // If custom render function exists, use it
                            if (col.render) {
                                return col.render(item);
                            }
                            
                            // Handle nested accessors (e.g., 'category.name')
                            const value = get(item, String(col.accessor));
                            
                            // Handle different data types
                            if (value === null || value === undefined) {
                                return <span className="text-gray-400 dark:text-gray-500">-</span>;
                            }
                            
                            if (typeof value === 'boolean') {
                                return (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        value 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {value ? 'Yes' : 'No'}
                                    </span>
                                );
                            }
                            
                            if (value instanceof Date) {
                                return (
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {value.toLocaleDateString()}
                                    </span>
                                );
                            }
                            
                            // For objects (like nested entities), try to get a meaningful display value
                            if (typeof value === 'object' && value !== null) {
                                // Check for common display properties
                                const displayProps = ['name', 'title', 'label', 'full_name', 'description'];
                                for (const prop of displayProps) {
                                    if (value[prop]) {
                                        return (
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {String(value[prop])}
                                            </span>
                                        );
                                    }
                                }
                                // Fallback to JSON string for small objects
                                if (Object.keys(value).length < 5) {
                                    return (
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {JSON.stringify(value)}
                                        </span>
                                    );
                                }
                                return <span className="text-gray-400 dark:text-gray-500">-</span>;
                            }
                            
                            // For long text, add ellipsis
                            const textValue = String(value);
                            if (textValue.length > 50 && col.ellipsis !== false) {
                                return (
                                    <div className="max-w-full">
                                        <span 
                                            className="text-sm text-gray-700 dark:text-gray-300 truncate block"
                                            title={textValue}
                                        >
                                            {textValue}
                                        </span>
                                    </div>
                                );
                            }
                            
                            return (
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {textValue}
                                </span>
                            );
                        }
                    })) as DataTableColumn<unknown>[] : []}
                    fetching={loading}
                    customLoader={
                        <div className="flex flex-col items-center justify-center h-40">
                            <IconLoader className="w-10 h-10 animate-spin text-primary mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
                        </div>
                    }
                    totalRecords={(filteredData || []).length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    selectedRecords={Array.isArray(selectedRecords) ? selectedRecords : []}
                    onSelectedRecordsChange={handleSelectionChange}
                    striped
                    minHeight={300}
                    shadow="sm"
                    withTableBorder
                    withColumnBorders
                    highlightOnHover={true}
                    storeColumnsKey={storeKey}
                    paginationText={({ from, to, totalRecords }) => (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {from} to {to} of <span className="font-medium text-gray-700 dark:text-gray-300">{totalRecords}</span> entries
                        </div>
                    )}
                    rowClassName={({ id }, index) =>
                        selectedRecords.some((record) => record.id === id) 
                            ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                            : index % 2 === 0 
                                ? 'bg-white dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700/70' 
                                : 'bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100/70 dark:hover:bg-gray-700/70'
                    }
                    // Enhanced header styling with better column management
                    styles={{
                        header: {
                            backgroundColor: 'var(--mantine-color-body)',
                            borderBottom: '1px solid var(--mantine-color-gray-3)',
                        },
                        pagination: {
                            borderTop: '1px solid var(--mantine-color-gray-3)',
                            padding: '0.75rem 1rem',
                        },
                        table: {
                            fontSize: '0.875rem',
                            display: 'table',
                            width: '100%',
                        },
                        headerCell: {
                            padding: '0.75rem 0.5rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--mantine-color-gray-0)',
                            borderBottom: '1px solid var(--mantine-color-gray-3)',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default DraggableDataTable; 