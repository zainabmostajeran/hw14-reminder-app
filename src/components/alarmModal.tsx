import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { AiFillSound } from "react-icons/ai";
import { Fragment } from "react";

interface ModalProps {
  onSnooze: () => void;
  onDelete: () => void;
  open: boolean;
  AlarmTime: string;
}

export default function AlarmModal({
  open,
  onDelete,
  onSnooze,
  AlarmTime,
}: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onDelete}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className=" flex flex-col fixed inset-0 overflow-y-auto">
          <div className="flex flex-col min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center shadow-lg animate-pulse rounded-full bg-red-100">
                    <AiFillSound
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600 "
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-xl text-gray-600 mt-2">{AlarmTime}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={onSnooze}
                    className="inline-flex justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Snooze
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="ml-2 inline-flex justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
