'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-600">NCQ Smart Hospitality Design Test</h1>
          <p className="text-gray-600 mt-2">Testing the green design and glass effect</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Primary Color</h2>
            <p className="text-gray-600">Using NCQ green (#16a34a)</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Glass Effect</h2>
            <p className="text-gray-600">Testing backdrop blur</p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Active</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">Inactive</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Gradient Card</h2>
            <p className="text-green-50">Testing green gradient background</p>
            <button className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30">
              Glass Button
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white/60 backdrop-blur-lg rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Glass Panel Test</h2>
          <p className="text-gray-600 mb-4">
            This panel uses a semi-transparent white background with backdrop blur to create the glass effect.
            The effect should be visible in both light and dark modes.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Primary Action
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}