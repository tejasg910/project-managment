import { Fragment, useState } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition , useClose} from "@headlessui/react";

export const useConfirm = ( text)=>{
    const [promise, setPromise] = useState(null);
    
      const confirm = () =>
        new Promise((resolve, reject) => {
          setPromise({ resolve });
        });
    
        const handleClose = () => {
            
          
          
              setPromise(null);
        }
        
    
      const handleCancel = async() => {
     await promise?.resolve(false);
        handleClose();
      };
    
      const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
      };
     const ConfirmModal = ()=>
          <Dialog onClose={handleClose} open={promise !== null} as="div" className="relative z-10" >
         
            <div className="fixed inset-0 overflow-y-auto bg-gray-500">
              <div className="flex min-h-full items-center justify-center p-4 text-center">

                
           
                  <DialogPanel transition               className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                  >
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      {text}
                    </DialogTitle>
    
                    
    
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 cursor-pointer rounded bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 font-medium transition duration-200 "
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button onClick={handleConfirm} className="cursor-pointer bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded font-medium transition duration-200 ">
                         Confirm
                        </button>
                      </div>
                       </DialogPanel>
           
              </div>
            </div>
          </Dialog> 
      return [confirm, ConfirmModal]
}