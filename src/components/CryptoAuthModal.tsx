import { Dialog, Transition } from '@headlessui/react';
import * as React from 'react';

export const Web3AuthModal = ({
  open,
  onModalClose,
  children,
}: {
  open: boolean;
  onModalClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Transition appear show={open} as={React.Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onModalClose}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-[rgba(18,19,23,0.7)]" />
            </Transition.Child>
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl origin-top-right divide-gray-100 rounded-md border bg-[rgb(18,18,24)] p-[0.1rem] font-semibold leading-6 text-gray-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] ring-1 ring-black ring-opacity-5 backdrop-blur-md focus:outline-none">
                <Dialog.Title
                  as="h3"
                  className="pt-6 text-xl font-normal leading-6 tracking-wide text-gray-200 antialiased"
                >
                  Connection method
                </Dialog.Title>
                <div className="w-ful flex h-full justify-between divide-x pt-8 pb-5">
                  {children}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
