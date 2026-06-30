import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StudentHub from './pages/StudentHub';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [resources, setResources] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);

  const fetchGlobalData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/resources/all'); // Ensure this matches backend custom 'all' pull endpoint
      setResources(res.data);
    } catch (e) { console.error(e); }
  };

  const refreshRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/requests');
      setStudentRequests(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchGlobalData();
    refreshRequests();
  }, []);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      const pass = prompt("Enter administrative authentication access token passphrase:");
      if (pass === "Urvashi01@umit") {
        setIsAdminMode(true);
      } else if (pass !== null) {
        alert("Invalid access parameters.");
      }
    }
  };

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
      <Navbar onAdminClick={handleAdminToggle} currentView={isAdminMode ? 'admin' : 'student'} />
      <StudentHub resources={resources} fetchGlobalData={fetchGlobalData} isAdminMode={isAdminMode} />
      {isAdminMode && <AdminPanel fetchGlobalData={fetchGlobalData} studentRequests={studentRequests} refreshRequests={refreshRequests} />}
    </div>
  );
}