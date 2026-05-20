import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const userName = localStorage.getItem('userName') || 'Användare';
    const userEmail = localStorage.getItem('userEmail') || '';
    const initial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        navigate('/login');
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-slate-800 rounded-lg p-1 pr-2 transition"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white font-medium border border-teal-500/30">
                    {initial}
                </div>
                <span className="text-sm text-slate-300 hidden md:block">{userName}</span>
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-800">
                        <div className="font-medium text-slate-100">{userName}</div>
                        {userEmail && (
                            <div className="text-xs text-slate-400 mt-0.5">{userEmail}</div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logga ut
                    </button>
                </div>
            )}
        </div>
    );
}