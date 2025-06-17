import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
const Home = () => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setProjectName] = useState("");
  const [projec, setProject] = useState([]);
  const navigate = useNavigate();
  
  


  const handleButtonClick = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
   // console.log("Project Name:", name);
    setProjectName("");
    setIsFormOpen(false);
  // Get the token from local storage
      const response = await axios.post(
        'http://localhost:3000/project/create', 
        {name },
        { withCredentials: true } 
      );
      if (response.status === 200) {
        console.log(response.data); // Handle the response as needed
      }

  };
 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/project/get", {
          withCredentials: true,
        });
        setProject(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
    }, [])

    const handleLogout = () => {
      localStorage.removeItem('token');
        navigate('/login'); // Redirect to login page (change path if needed)
    };


  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex items-start justify-start p-4">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleButtonClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Open Form
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
      <div className="mt-8 w-full"></div>


      {
                    projec.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { name: project.name }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                            <h2
                                className='font-semibold'
                            >{project.name}</h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                                {project.users.length}
                            </div>

                        </div>
                    ))
                }
      

      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="absolute top-56 left-40 bg-gray-800 shadow-lg rounded p-4 w-64"
        >
          <label className="block text-gray-300 mb-2">
            Project Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <div className="flex  gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
          
          <button
            onClick={handleButtonClick}
            className="bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Cancel
          </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Home;