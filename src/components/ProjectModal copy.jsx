// components/ProjectModal.jsx
"use client";

import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export default function ProjectModal({
  isOpen,
  setIsOpen,
  project,
  onAddProject,
  onUpdateProject,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        address: project.address,
        city: project.city,
      });
    } else {
      reset({
        name: "",
        address: "",
        city: "",
      });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    try {
      if (project) {
        // Update existing project
        const response = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedProject = await response.json();
          onUpdateProject(updatedProject);
          closeModal();
        } else {
          alert("Failed to update project");
        }
      } else {
        // Create new project
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newProject = await response.json();
          onAddProject(newProject);
          closeModal();
        } else {
          alert("Failed to create project");
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred while saving the project");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
     
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {project ? "Edit Project" : "Add New Project"}
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 font-medium transition duration-200 "
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded font-medium transition duration-200 ">
                      {project ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}