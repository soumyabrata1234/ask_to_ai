import { Routes, Route } from 'react-router-dom';
import Home from '../screens/Home.jsx';
import Login from '../screens/Login.jsx';
import Signup from '../screens/Signup.jsx';
import UserAuth from '../screens/userauth.jsx';
import Project from '../screens/project.jsx';
import Extraform from '../screens/ExtraForm.jsx';

export default function Routess() {
  return (
    <Routes>
      <Route path="/home" element={<UserAuth><Home /></UserAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/project" element={<Project />} />
      <Route path="/xyz" element={<Extraform />} />
    </Routes>
  );
}
