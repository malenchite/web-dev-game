function NoMatch () {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-desertSand py-12 px-4">
      <main>
        <h1 className="text-red-blackBean mb-10 text-4xl font-bold">Page Not Found</h1>
        <a
          href="/"
          className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-mauveTaupe bg-opacity-60 hover:bg-opacity-70 sm:px-8"
        >
          Home
        </a>
      </main>
    </div>
  );
}

export default NoMatch;