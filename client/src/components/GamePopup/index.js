function GamePopup ({ children }) {
  return (
    <div className="absolute top-16 w-full z-20">
      <div className="flex items-end justify-center text-center">
        <div className="inline-block align-bottom rounded-lg px-4 pt-1 pb-4 shadow-2xl bg-red-linen w-5/6 border-2 border-red-eggplant">
          {children}
        </div>
      </div>
    </div >
  );
}

export default GamePopup;