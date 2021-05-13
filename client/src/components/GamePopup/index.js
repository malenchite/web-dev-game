function GamePopup ({ children }) {
  return (
    <div className="absolute top-12 w-full">
      <div className="flex items-end justify-center text-center">
        <div className="inline-block align-bottom rounded-lg px-4 pt-1 pb-4 shadow-xl bg-red-linen w-5/6">
          {children}
        </div>
      </div>
    </div >
  );
}

export default GamePopup;