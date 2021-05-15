export default function Splash () {
  return (
    <div className="bg-white">
      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0 bg-red-desertSand">
                <div
                  className="absolute inset-0 bg-gradient-to-r"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-red-mauveTaupe">Get ready to test your</span>
                  <span className="block text-red-blackBean">
                    web development
                  </span>
                  <span className="block text-red-mauveTaupe">knowledge</span>
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-red-blackBean sm:max-w-3xl">
                  The Web Dev Game is a two-player strategy game in which you challenge your knowledge by challenging your friends.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <a
                      href="/signup"
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                    >
                      Register
                    </a>
                    <a
                      href="/login"
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                    >
                      Log In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
