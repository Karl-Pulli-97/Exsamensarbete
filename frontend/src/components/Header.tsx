import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

export function Header() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/catches', label: 'Fångster' },
        { path: '/add', label: 'Logga fångst' },
        { path: '/stats', label: 'Statistik' },
    ];

    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-stone-50 rounded-lg p-1">
                        <Logo variant="icon" className="w-8 h-8" />
                    </div>
                    <span className="font-serif italic text-xl text-slate-100 hidden sm:block">
                        Anglers' Ledger
                    </span>
                </Link>

                <nav className="flex items-center gap-1">
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

                <UserMenu />

            </div>
        </header>
    );
}