"use client";

import { Fragment, useEffect, useTransition } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjects } from "@/hooks/useProject";
import { useProjectCreate } from "@/hooks/useProjectCreate";
import { useProjectUpdate } from "@/hooks/useProjectUpdate";
import { useToast } from "@/hooks/useToast";

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
  onSuccess

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

const [_, startTransition] = useTransition()
  const {createProject , loading, createLoading}  = useProjectCreate();
  const {updateProject, loading: updateLoading} = useProjectUpdate();
const {showError} = useToast()
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
     
        await updateProject({...data, id: project?.id});

        startTransition(()=>{
          onSuccess()
        })
      } else {
       await  createProject(data)
      
       startTransition(()=>{
        onSuccess()
      })
      }

      
    } catch (error) {
showError("Error while performing this action")
    }
    finally{
      closeModal()
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
     
        <div className="fixed inset-0 overflow-y-auto bg-gray-500">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
       
              <DialogPanel transition               className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              >
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {project ? "Edit Project" : "Add New Project"}
                </DialogTitle>

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
                      className="px-4 py-2 cursor-pointer rounded bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 font-medium transition duration-200 "
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button disabled={createLoading || updateLoading} type="submit" className={`cursor-pointer bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded font-medium transition duration-200 ${(createLoading || updateLoading) ? "cursor-not-allowed" : ""} `}>
                      {(createLoading || updateLoading) ? "Loading" :    project ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </DialogPanel>
       
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}