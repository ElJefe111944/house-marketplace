import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
// import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<Signin />} />
          <Route path="/sign-in" element={<Signup />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgotten-password" element={<ForgotPassword />} />
        </Routes>
        {/* Navbar */}
        <Navbar />
      </Router>
    </>
  );
}

export default App;
