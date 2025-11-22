
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ClientBooking } from './components/ClientBooking';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { StorageService } from './services/storage';
import { ShopSettings } from './types';
import { Sparkles, ShieldCheck } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<ShopSettings>(StorageService.getSettings());

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">
                                    {settings.shopName}
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                           <Link to="/admin" className="text-stone-400 hover:text-brand-600 transition-colors p-2">
                                <ShieldCheck className="w-5 h-5" />
                           </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-stone-100 py-8 mt-auto">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-stone-500 text-sm font-serif italic">
                        "Beauty begins at your fingertips."
                    </p>
                    <div className="mt-4 text-xs text-stone-400">
                        © {new Date().getFullYear()} {settings.shopName}. All rights reserved.
                    </div>
                    <div className="mt-2 text-[10px] text-stone-300 font-medium">
                        Developed by Johnny Frantz T Rene
                    </div>
                </div>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
    // Check session storage for existing login session
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('admin_auth') === 'true';
    });

    const handleLogin = () => {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
    };

    return (
        <HashRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<ClientBooking />} />
                    <Route 
                        path="/admin" 
                        element={
                            isAuthenticated ? (
                                <AdminDashboard onLogout={handleLogout} />
                            ) : (
                                <AdminLogin onLogin={handleLogin} />
                            )
                        } 
                    />
                </Routes>
            </Layout>
        </HashRouter>
    );
};

export default App;
