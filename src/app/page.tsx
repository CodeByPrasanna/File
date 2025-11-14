import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚨</span>
              </div>
              <span className="font-bold text-xl">Disaster Management</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/sos" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Emergency SOS
              </Link>
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            AI-Driven Real-Time
            <span className="text-red-600"> Disaster Management</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Emergency-first interface for real-time disaster alerts, SOS services, and intelligent coordination with predictive analytics powered by machine learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sos"
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🚨 Emergency SOS
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg"
            >
              📊 View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Emergency SOS</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              One-tap emergency alert with auto-location detection and voice activation for immediate assistance.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Maps</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Live disaster mapping with severity heatmaps and evacuation route planning.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Resource Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Real-time ambulance and hospital availability with intelligent resource allocation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              LSTM-powered disaster forecasting with 24-72 hour risk assessments.
            </p>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Emergency Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl mb-2">🚑</div>
              <div className="font-semibold">Ambulance</div>
              <div className="text-2xl font-mono font-bold text-red-600">108</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl mb-2">🚔</div>
              <div className="font-semibold">Police</div>
              <div className="text-2xl font-mono font-bold text-blue-600">100</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-3xl mb-2">🚒</div>
              <div className="font-semibold">Fire</div>
              <div className="text-2xl font-mono font-bold text-orange-600">101</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl mb-2">☎️</div>
              <div className="font-semibold">Disaster</div>
              <div className="text-2xl font-mono font-bold text-green-600">112</div>
            </div>
          </div>
        </div>

        {/* Language Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Available in English, Hindi (हिन्दी), and Marathi (मराठी)
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>© 2025 AI-Driven Disaster Management System. Save lives with technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
