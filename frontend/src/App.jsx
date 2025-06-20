import React from 'react'
import Routess from './routes/Routess.jsx'
import { UserProvider } from './context/Usercontext.jsx'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const isHome = window.location.pathname === '/';
  const navigate = useNavigate(); // 🟢 This handles client-side navigation

  return (
    <UserProvider>
      {isHome && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
              Welcome to the Project Management App
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Please log in to access your projects and collaborate with your team.<br />
              If you don't have an account, please sign up.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded transition"
                onClick={() => navigate('/login')} // ✅ Client-side navigation
              >
                Login
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold py-2 px-6 rounded transition"
                onClick={() => navigate('/signup')} // ✅ Client-side navigation
              >
                Sign Up
              </button>
            </div>
            <div className="flex justify-center mt-6">
              <button
                className="text-sm text-gray-500 dark:text-gray-400 underline"
                onClick={() => {
                  document.documentElement.classList.toggle('dark');
                }}
              >
                Toggle Dark Mode
              </button>
            </div>
          </div>
        </div>
      )}
      <Routess />
    </UserProvider>
  )
}

export default App
