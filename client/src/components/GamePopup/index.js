import { Transition } from "@headlessui/react";

function GamePopup ({ show, children }) {
  return (
    <Transition
      show={show}
      enter="transform transition duration-300"
      enterFrom="scale-0 -rotate-90 translate-y-44 -translate-x-24"
      enterTo="rotate-0 scale-100 translate-y-0 translate-x-0"
    >
      <div className="absolute top-16 w-full z-20">
        <div className="flex items-end justify-center text-center">
          <div className="inline-block align-bottom rounded-lg px-4 pt-1 pb-4 shadow-2xl bg-red-linen w-5/6 border-2 border-red-eggplant">
            {children}
          </div>
        </div>
      </div >
    </Transition>
  );
}

export default GamePopup;