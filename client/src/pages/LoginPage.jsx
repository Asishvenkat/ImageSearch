import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import LoginButtons from '../components/LoginButtons';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-10 font-sans">
      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 bg-white/20 text-white border-none px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer mb-6 backdrop-blur-lg hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl px-12 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">Welcome Back</h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Sign in to access your personalized image search experience
            </p>
          </div>

          <div className="relative text-center my-8">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4 text-sm text-gray-600 font-medium z-10">
              Choose your login method
            </span>
          </div>

          <LoginButtons />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-700 mb-2 flex items-center justify-center gap-2">
              <Lock size={16} />
              Secure OAuth authentication
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
