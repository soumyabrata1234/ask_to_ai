import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/Usercontext.jsx';   
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios' // Import axios instance
const Login = () => {
    const url = import.meta.env.VITE_BACKEND_URL ; // Define the backend URL
    const navigate = useNavigate(); // Initialize useNavigate
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
  const { setemail } = useContext(UserContext); // Access the setemail function from UserContext

    const handleSubmit = async (e) => {
        e.preventDefault();
       
       setemail(email); 
        setEmail('');
        setPassword('');

      //  navigate('/home'); 

         const response = await axios.post(
        `${url}/user/login`, 
        { email, password },
        { withCredentials: true } 
      );
        console.log(response.data); // Handle the response as needed
        if (response.status === 200) {
            // Assuming the login was successful, navigate to the home page
            localStorage.setItem('token', response.data.token); 
            setemail(email); // Set the email in local storage or context
            navigate('/home');
        } else {
            // Handle error case
            console.error('Login failed:', response.data);
        }
    };
   
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                 <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;