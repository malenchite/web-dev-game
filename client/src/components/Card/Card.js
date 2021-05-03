import React from "react";

export const Card = (props) => {
  return (
    <div className="card mt-5" style={{ maxHeight: 770, backgroundColor: '#f8f9f8' }}>
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h5 className="text-lg leading-6 font-medium text-gray-900">{props.title}</h5>
      </div>
      <div className="card-body">
        {props.children}
      </div>
    </div>
  )
}
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <div class="font-bold text-xl mb-2 text-center">Question</div>
  <p class="text-gray-700 text-base"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</p>
  <hr></hr>
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2 text-center">Answer</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
    </p>
  </div>
</div>