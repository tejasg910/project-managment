"use client";

import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import ProjectModal from "./ProjectModal";
import { useProjectsFetch, useSWRProjects } from "@/hooks/useProject";
import { Pencil, Trash, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Plus, RefreshCcw } from 'lucide-react';
import { useConfirm } from "@/hooks/useConfirm";
import { useProjectDelete } from "@/hooks/useProjectDelete";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProjectList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    address: "",
    city: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const debouncedColumnFilters = useDebounce(columnFilters, 300);

  const [confirm, ConfirmModal] = useConfirm("Are you sure you want to delete this project?");
  const { deleteProject } = useProjectDelete();
  const { projects: allData, isLoading, isError,  mutate } = useSWRProjects();

  const columnHelper = createColumnHelper();
  
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: info => info.getValue(),
      enableSorting: false,
      size: 80,
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Project Name
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("address", {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Address
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("city", {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          City
          <ArrowUpDown className="ml-2 size-4" />
        </div>
      ),
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
          >
           <Pencil className="size-4"/>
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-900 cursor-pointer"
          >
            <Trash className="size-4" />
          </button>
        </div>
      ),
      enableSorting: false,
    }),
  ];

  // Apply column filters to the data
  const filteredData = useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    return allData.filter(item => {
      return (
        (debouncedColumnFilters.name === "" || 
          item.name.toLowerCase().includes(debouncedColumnFilters.name.toLowerCase())) &&
        (debouncedColumnFilters.address === "" || 
          item.address.toLowerCase().includes(debouncedColumnFilters.address.toLowerCase())) &&
        (debouncedColumnFilters.city === "" || 
          item.city.toLowerCase().includes(debouncedColumnFilters.city.toLowerCase()))
      );
    });
  }, [allData, debouncedColumnFilters]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleEdit = (project) => {
    setEditProject(project);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = await confirm();
    if (!ok) return;
    await deleteProject(id);
    mutate();
  };

  const openAddModal = () => {
    setEditProject(null);
    setIsOpen(true);
  };

  const handleColumnFilterChange = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <div className="flex gap-1">

      
        <button
          onClick={openAddModal}
          className="p-1 rounded-full cursor-pointer  font-medium transition duration-200 flex items-center bg-primary-600 text-white hover:bg-primary-700"
        >
          <Plus/>
        </button>
        <button
          onClick={()=>mutate()}
          className={`p-1 rounded-full cursor-pointer  font-medium transition duration-200 flex items-center bg-gray-600 text-white hover:bg-gray-700 ${isLoading ? "animate-spin" :""}`}
        >
      <RefreshCcw/>
        </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
          <Search className="text-gray-400 size-4 mr-2" />
          <input
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm"
            placeholder="Search all columns..."
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th className="px-6 py-2"></th>
              {/* Column filter inputs */}
              <th className="px-6 py-2">
                <input
                  value={columnFilters.name}
                  onChange={e => handleColumnFilterChange('name', e.target.value)}
                  placeholder="Filter name..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  value={columnFilters.address}
                  onChange={e => handleColumnFilterChange('address', e.target.value)}
                  placeholder="Filter address..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-2">
                <input
                  value={columnFilters.city}
                  onChange={e => handleColumnFilterChange('city', e.target.value)}
                  placeholder="Filter city..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-2"></th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
                    <span className="ml-2">Loading projects...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : isError ?  <tbody>
          <tr>
            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
                <span className="ml-2">Error while fetching projects</span>
              </div>
            </td>
          </tr>
        </tbody> : (
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500">
                    No projects found. Add a project to get started.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Show 
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mx-2 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            per page
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" />
          </button>
          <button
            className="p-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </button>
          
          <div className="flex items-center">
            <input
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-12 bg-white border border-gray-300 rounded px-2 py-1 text-sm text-center"
            />
            <span className="px-1">of</span>
            <span>{table.getPageCount()}</span>
          </div>
          
          <button
            className="p-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            className="p-1 border border-gray-300 rounded disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" />
          </button>
        </div>
      </div>

      <ConfirmModal />

      <ProjectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        project={editProject}
        onSuccess={mutate}
      />
    </div>
  );
}