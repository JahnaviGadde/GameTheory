import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Userdashboard from "./pages/Userdashboard";
import Signin from './pages/Signin';
import Bookslots from "./pages/Bookslots";
import Createslots from "./pages/Createslots";
import Viewslots from "./pages/CentreSchedule";
import { AuthContextProvider } from "./context/AuthContext";
import Monitorslots from "./pages/Monitorslots";


function App() {
  return (
    <AuthContextProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/bookslots/:bookingId" element={<Bookslots />} />
        <Route path="/createslots" element={<Createslots />} />
        <Route path="/dashboard/:username" element={<Userdashboard />} />
        <Route path="/centreschedule/:centreId" element={<Viewslots />} />
        <Route path= "/monitorslots/:centreId" element = {<Monitorslots/>}/>
      </Routes>
    </Router>
    </AuthContextProvider>
  );
}

export default App;
