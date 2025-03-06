import { Dialog, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Input } from "./Input";

interface ModalProps {
  onSnooze: () => void;
  onDelete: () => void;
  open: boolean;
  AlarmTitle: string;
  AlarmTime: string;
  sound: boolean;
}

export default function AlarmModal({
  open,
  onDelete,
  onSnooze,
  AlarmTitle,
  AlarmTime,
  sound,
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                <div className=" bg-[#6da7fa] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <img
                        className="animate-bounce"
                        src="./alarm-clock.svg"
                        alt=""
                      />
                      <audio autoPlay>
                        <source src="Tic-Tac-Mechanical-Alarm-Clock-2-chosic.com_.mp3" />
                        {sound}
                      </audio>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg pt-1 font-bold leading-6 text-gray-900">
                        Alarm{" "}
                        <span className="px-2 text-white/90">{AlarmTitle}</span>{" "}
                        is now Active
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-3 py-4 ">
                    <label>Extend Time of Alarm</label>
                  </div>
                  <div>
                    <Input type="time" value={AlarmTime} />
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 sm:justify-between bg-[#2a4263]">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center border-2 border-white rounded-md px-3 py-2 text-sm font-semibold hover:text-white shadow-blue-300/60 shadow-lg  bg-[#61687e] hover:bg-blue-950 sm:ml-3 sm:w-auto disabled:bg-grayApp disabled:hover:text-black"                  >
                    Extend Time
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="mt-3 inline-flex w-full justify-center rounded-md border-white hover:text-white shadow-blue-300/60 shadow-lg bg-[#e1363b] hover:bg-red-400 px-3 py-2 text-sm font-semibold text-gray-900 border-2 sm:mt-0 sm:w-auto"                  >
                    Delete Alarm
                  </button>
                  <button
                    type="button"
                    onClick={onSnooze}
                    className="mt-3 inline-flex w-full justify-center rounded-md border-white hover:text-white shadow-blue-300/60 shadow-lg bg-gray-300/80 hover:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 border-2 sm:mt-0 sm:w-auto"
                  >
                    Turn Off Alarm
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
