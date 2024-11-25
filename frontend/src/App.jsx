import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Portfolio from "./components/Portfolio";
import Login from "./components/Login";
import UserDashboard from "./components/userComponents/UserDashboard";
import AuthComponent from './components/userComponents/AuthComponent';

function App() {
  return ( 
    <Router>
      <Routes>
        {/* Redirect / to /admin */}
        <Route path="/" element={<Portfolio />}/>
        <Route path="/login" element={<Login />}/> 
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/userlogin" element={<AuthComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
