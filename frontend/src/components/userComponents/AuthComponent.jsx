import { useState } from 'react';
import axios from 'axios';

const AuthComponent = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios.post('/api/account/google');
      if (response.data.success) {
        window.location.href = '/user';
      } else {
        throw new Error('Google Sign-In failed.');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bms-ef6q.onrender.com/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed.');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      if (data.success) {
        setError('');
        alert('Registration successful! Redirecting to Sign In...');
        setIsSignUp(false);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Sign-Up Error:', error.message);
      setError(error.message || 'Sign-Up failed. Please try again.');
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bms-ef6q.onrender.com/api/account/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);  // Log the full response for debugging
        throw new Error(errorData.error || 'Sign-In failed.');
      }
  
      const data = await response.json();
      console.log('Sign-In Response:', data); // Log response data
  
      if (data.success) {
        window.location.href = '/user';
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Sign-In Error:', error.message);
      setError('Invalid email or password.');
    }
  };
  
  return (
    <div className="bg-[url('./assets/bg.jpg')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-blue-500 mb-4"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h2 className="text-2xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l2.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.86-2.59 3.3-4.51 6.16-4.51z" fill="#EA4335" />
          </svg>
          {isSignUp ? 'Sign Up' : 'Sign In'} with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
          {isSignUp && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account? ' : 'Don’t have an account? '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
