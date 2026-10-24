function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-white text-center">
        Bienvenue sur notre plateforme !
      </h1>

      <p className="text-slate-400 mt-4 text-center">
        La communauté africaine des développeurs.
      </p>

      <button className="mt-8 px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors">
        Rejoindre la communauté
      </button>
    </div>
  )
}

export default App