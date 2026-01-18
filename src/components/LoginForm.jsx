import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
    } else {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!formData.password) {
        setError('New password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authService.login(formData.username, formData.password);
      if (result.success) {
        setLoading(false);
        onLoginSuccess(result.user);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authService.forgotPassword(formData.username, formData.password);
      if (result.success) {
        setLoading(false);
        setMessage('Password updated successfully! You can now login with your new password.');
        setTimeout(() => {
          setFormData({ username: '', password: '', confirmPassword: '' });
          setIsLogin(true);
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update password. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      handleForgotPassword(e);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

    return (
      <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-10 transition-all duration-500">
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
                {isLogin ? (
                  <Shield className="h-8 w-8 text-white" />
                ) : (
                  <KeyRound className="h-8 w-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Reset Password'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isLogin 
                  ? 'Please enter your details to sign in' 
                  : 'Enter your username and new password'}
              </p>
            </div>
  
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
  
            {message && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
                {message}
              </div>
            )}
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                  {isLogin ? 'Password' : 'New Password'}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                    placeholder={isLogin ? 'Enter your password' : 'Enter new password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
  
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}
  
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 px-4 rounded-xl font-bold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 mt-4 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Signing in...' : 'Updating...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Update Password'
                )}
              </button>
            </form>
  
            <div className="mt-8 text-center">
              <button
                onClick={toggleMode}
                className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
              >
                {isLogin 
                  ? "Forgot your password?" 
                  : "Back to sign in"}
              </button>
            </div>
          </div>
  
          <div className="text-center mt-8">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Hospital Management System
            </p>
          </div>
        </div>
      </div>
    );
};

export default LoginForm;
