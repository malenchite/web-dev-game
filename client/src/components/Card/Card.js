import React from "react";

export default function Card(props) {
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
