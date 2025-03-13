// components/ProjectList.jsx
"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ProjectModal from "./ProjectModal";
import { useSWRProjects } from "@/hooks/useProject";
import { Pencil, ShowerHead, Trash } from 'lucide-react';
import { useConfirm } from "@/hooks/useConfirm";
import { useProjectDelete } from "@/hooks/useProjectDelete";
import { useToast } from "@/hooks/useToast";

export default function ProjectList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  // const [tableData, setTableData] = useState(projects);
const [confirm, ConfirmModal] = useConfirm("Are your sure to delete this project?");

const {deleteProject} = useProjectDelete()
  const {projects : tableData, isLoading , isError} = useSWRProjects()

  const columnHelper = createColumnHelper();
  
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Project Name",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("city", {
      header: "City",
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
            className="text-red-600 hover:text-red-900 cursor-pointer "
          >
            <Trash className="size-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleEdit = (project) => {
    setEditProject(project);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {

const ok = await confirm()

if(!ok) return;


        await deleteProject(id);

    
    
  };



  const openAddModal = () => {
    setEditProject(null);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="px-4 py-2 cursor-pointer rounded font-medium transition duration-200  flex items-center bg-primary-600 text-white hover:bg-primary-700"
        >

          <span>Add Project</span>
        </button>
      </div>

      <div className="overflow-x-auto">
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
          </thead>
     {  isLoading ?    <tbody><tr>
  <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">Loading</td></tr></tbody> : <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
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
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No projects found. Add a project to get started.
                </td>
              </tr>
            )}
          </tbody>}
        </table>
      </div>

      <ConfirmModal />

      <ProjectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        project={editProject}
      
      />
    </div>
  );
}