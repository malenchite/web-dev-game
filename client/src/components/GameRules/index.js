import { Fragment } from "react"
import { Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"

export default function GameRules ({ open, closeRules }) {
  return (
    <Transition.Root
      show={open}
      as={Fragment}
    >
      <div className="fixed inset-left-0 overflow-hidden z-50 text-left">
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="fixed inset-y-0 left-0 pl-0 max-w-full flex bg-red-linen">
              <div className="max-w-md">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll scrollbar-thin scrollbar-thumb-red-eggplant scrollbar-track-red-linen border-r border-red-eggplant">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="text-lg font-medium text-gray-900">Game Rules</div>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eggplant"
                          onClick={closeRules}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <p>Welcome to The Web Dev Game! The goal is to have the best-developed application with the fewest bugs at the end of the game. Being in debt will also count against you. Along the way, you will make choices as to when to develop, when to fix bugs, when to seek funding, and when to test your luck and your IRL web dev knowledge to advance (or detract from!) your progress.</p>
                    <br />
                    <p>The game lasts 30 turns total, 15 for each player. The first player is determined randomly. You will start with 2 Funding, but no Front-End, Back-End, or Bugs.</p>
                    <br />
                    <p>On your turn, you will be presented with several options:</p>
                    <br />
                    <ul>
                      <li><strong>Seek Funding</strong>: Generates 0-3 Funding</li>
                      <li><strong>Work on Front-End</strong>: Costs 1 Funding, generates 1-3 Front-End.
                            May develop Bugs up to the number of Front-End generated.</li>
                      <li><strong>Work on Back-End</strong>: Costs 1 Funding. Generates 1-3 Back-End.
                            May develop Bugs up to the number of Back-End generated.</li>
                      <li><strong>Fix Bugs</strong>: Costs 1 Funding. Removes 1-3 Bugs.</li>
                      <li><strong>Draw Card</strong>: This is where the real game is! Draw a card and be posed a web development question. Answer correctly for bonuses. Answer incorrectly and you may take a penalty instead.</li>
                    </ul>
                    <br />
                    <p>And the end of the final turn, the players will be scored with the following points:</p>
                    <br />
                    <ul>
                      <li><strong>App Development</strong>: The lowest of your Front-End and Back-End. It takes both to make a successful app!</li>
                      <li><strong>Bugs</strong>: Subtract 1 point for each remaining bug in your application. Keep that code polished!</li>
                      <li><strong>Funding</strong>: Subtract 1 point for each negative Funding you have. Try to stay out of debt!</li>
                    </ul>
                    <br />
                    <p>Highest score wins!</p>
                  </div>
                </div>
              </div>

            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root >
  )
}
