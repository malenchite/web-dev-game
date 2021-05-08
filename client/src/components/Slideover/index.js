/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

export default function Example() {
  const [open, setOpen] = useState(true)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" static className="fixed inset-0 overflow-hidden" open={open} onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="bg-white"
            enterTo="bg-white"
            leave="ease-in-out duration-500"
            leaveFrom="bg-white"
            leaveTo="bg-white"
          >
            <Dialog.Overlay className="absolute inset-0 bg-white" />
          </Transition.Child>

          <div className="fixed inset-y-0 left-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
            >
              <div className="w-screen max-w-md backgroundWhite">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Game Instructions</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eggplant"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <h1>Welcome to The Web Dev Game! The goal is to have the best-developed application with the fewest bugs at the end of the game. Being in debt will also count against you. Along the way, you will make choices as to when to develop, when to fix bugs, when to seek funding, and when to test your luck and your IRL web dev knowledge to advance (or detract from!) your progress.</h1>
                    &nbsp;
                    <h1>The game lasts 30 turns total, 15 for each player. The first player is determined randomly. You will start with 2 Funding, but no Front-End, Back-End, or Bugs.</h1>
                    &nbsp;
                    <h1>On your turn, you will be presented with several options:</h1>
                    &nbsp;
                        <ul>
                            <li>Seek Funding: Generates 0-3 Funding</li> 
                            <li>Work on Front-End: Costs 1 Funding, generates 1-3 Front-End. 
                            May develop Bugs up to the number of Front-End generated.</li>
                            <li>Work on Back-End: Costs 1 Funding. Generates 1-3 Back-End. 
                            May develop Bugs up to the number of Back-End generated.</li> 
                            <li>Fix Bugs: Costs 1 Funding. Removes 1-3 Bugs.</li> 
                            <li>Draw Card: This is where the real game is! Draw a card and be posed a web development question. Answer correctly for bonuses. Answer incorrectly and you may take a penalty instead.</li>
                        </ul>
                    &nbsp;    
                    <h1>And the end of the final turn, the players will be scored with the following points:</h1>
                    &nbsp; 
                        <ul>
                            
                        <li>App Development: The lowest of your Front-End and Back-End. It takes both to make a successful app!</li> 
                        <li>Bugs: Subtract 1 point for each remaining bug in your application. Keep that code polished!</li> 
                        <li>Funding: Subtract 1 point for each negative Funding you have. Try to stay out of debt!</li>

                        </ul>
                    &nbsp;
                    <h1>Highest score wins!</h1>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
