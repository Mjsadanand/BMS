import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Store token securely based on remember me choice
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
        } else {
          sessionStorage.setItem("token", response.data.token);
        }

        // Navigate based on user role
        if (response.data.user.role === "admin") {
          navigate('/admin');
        } else {
          navigate('/dashboard');  // Updated route
        }
        alert('Login Successful');
      }
    } catch (err) {
      setError(
        err.response && err.response.data && !err.response.data.success
          ? err.response.data.error
          : "Server Error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('./assets/bg.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-play font-bold mb-6 text-white text-center drop-shadow-[0_0_6px_black]">
          BillBoard Management System
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-7">Login</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 text-gray-800 border-0 rounded-md p-3 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="abc@gmail.com"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 text-gray-800 border-0 rounded-md p-3 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="********"
              required
            />

            <div className="flex items-center justify-between flex-wrap">
              <label
                htmlFor="remember-me"
                className="text-sm text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="remember-me"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-blue-500 hover:underline mb-0.5"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
