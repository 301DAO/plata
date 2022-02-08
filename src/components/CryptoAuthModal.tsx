import { Dialog, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import * as React from "react";
import { useConnect } from "wagmi";
import { Coinbase, Metamask, WalletConnect } from "./icons/CryptoWallets";

type ConnectIcon = {
  name: "MetaMask" | "WalletConnect" | "Coinbase Wallet";
  icon: React.ReactNode;
};

const connectIcons: ConnectIcon[] = [
  {
    name: "MetaMask",
    icon: <Metamask w={12} h={12} />,
  },
  {
    name: "WalletConnect",
    icon: <WalletConnect w={12} h={12} />,
  },
  {
    name: "Coinbase Wallet",
    icon: <Coinbase />,
  },
];

export const WalletIcon = ({ name }: { name: string }) => (
  <>{connectIcons.find((icon) => icon.name === name)?.icon}</>
);

export const Web3AuthModal = ({
  open,
  onModalClose,
  callback,
}: {
  open: boolean;
  onModalClose: () => void;
  callback?: () => Promise<void>;
}) => {
  const [
    {
      data: { connected, connectors },
    },
    connect,
  ] = useConnect();
  return (
    <>
      <Transition appear show={open && !connected} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onModalClose}
        >
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
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
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
              <div className="inline-block w-full max-w-xl p-[0.1rem] origin-top-right divide-gray-100 rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none font-semibold leading-6 text-gray-300 bg-[rgb(18,18,24)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md border">
                <Dialog.Title
                  as="h3"
                  className="pt-6 antialiased text-xl font-normal tracking-wide leading-6 text-gray-200"
                >
                  Connection method
                </Dialog.Title>
                <div className="pt-8 pb-5 flex justify-between w-ful h-full divide-x">
                  {connectors.map((connector, idx) => (
                    <button
                      disabled={!connector.ready}
                      key={connector.name}
                      className="pt-3 w-full flex flex-col items-center justify-end pb-4 gap-y-2 hover:text-white hover:bg-[rgb(31,32,53)] focus:outline-none antialiased text-xl font-normal tracking-wide hover:cursor-pointer"
                      onClick={() => connect(connector)}
                    >
                      <WalletIcon name={connector.name} />
                      {connector.name}
                    </button>
                  ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
