import { Transition } from '@headlessui/react';
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Notification() {
  return <Toaster position="top-right" toastOptions={{ duration: 2000 }} />;
}

export enum NotificationType {
  Success,
  Error,
  Info,
}

export interface NotifyProps {
  message: string;
  type: NotificationType;
}

function getIconForNotificationType(type: NotificationType) {
  switch (type) {
    case NotificationType.Success:
      return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
    case NotificationType.Error:
      return <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />;
    case NotificationType.Info:
      return <InformationCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />;
  }
}

export function notify({ message, type }: NotifyProps) {
  console.log('notify:  ', message, type);

  toast.custom(t => {
    if (type === NotificationType.Error) {
      t.duration = 4000;
    }
    return (
      <>
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={t.visible}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">{getIconForNotificationType(type)}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">{message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      className="inline-flex rounded-md bg-gray-900 text-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        toast.dismiss(t.id);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </>
    );
  });
}
