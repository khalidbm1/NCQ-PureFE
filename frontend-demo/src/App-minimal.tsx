import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            🚀 NCQ Platform Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Interactive Demo is Loading Successfully!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">✅ React</h3>
              <p className="text-sm text-blue-600">Working correctly</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">✅ Tailwind CSS</h3>
              <p className="text-sm text-green-600">Styles loading</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">✅ TypeScript</h3>
              <p className="text-sm text-purple-600">Compiling properly</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
            <p className="text-sm text-gray-600">
              The full NCQ Platform demo with interactive tours, 
              dashboards, and all modules will load here.
            </p>
          </div>

          <button 
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert('🎉 Demo is working! Ready for full experience.')}
          >
            Test Interaction
          </button>
        </div>
      </div>
    </div>
  )
}

export default App