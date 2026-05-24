import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

export function Header() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Översikt' },
        { path: '/add', label: 'Logga fångst' },
        { path: '/catches', label: 'Dina fångster' },
        { path: '/stats', label: 'Statistik' },
    ];

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
                    <div className="bg-stone-50 rounded-lg p-1">
                        <Logo variant="icon" className="w-8 h-8" />
                    </div>
                    <span className="font-serif italic text-xl text-slate-100 block">
                        Anglers' Ledger
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${location.pathname === item.path
                                ? 'bg-teal-700/30 text-teal-300'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <UserMenu />

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-950">
                    <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMobileMenu}
                                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${location.pathname === item.path
                                    ? 'bg-teal-700/30 text-teal-300'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}