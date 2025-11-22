
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Lock, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side validation
    // In a real backend app, this would verify against a server
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-stone-900 p-8 text-center">
          <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Admin Access</h2>
          <p className="text-stone-400 text-sm mt-1">Please enter your credentials</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-stone-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors outline-none"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button fullWidth size="lg" variant="secondary" type="submit">
              Login to Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/">
              <button className="text-stone-400 hover:text-stone-600 text-sm flex items-center justify-center gap-2 w-full transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-8 text-xs text-stone-300">Default password: admin123</p>
    </div>
  );
};
