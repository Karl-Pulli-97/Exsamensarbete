import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Logo } from '../components/Logo';

export function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authApi.register({ email, name, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('userEmail', response.email);
            navigate('/');
        } catch (err) {
            setError('Det gick inte att registrera. Email kanske används redan.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-stone-50 rounded-2xl mb-8 shadow-2xl max-w-[300px] mx-auto">
                    <Logo variant="main" className="w-full" />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-5 shadow-2xl"
                >
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Namn
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition"
                            placeholder="Ditt namn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition"
                            placeholder="din@email.se"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Lösenord
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition"
                            placeholder="Minst 6 tecken"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition shadow-lg shadow-teal-900/30"
                    >
                        {loading ? 'Registrerar...' : 'Skapa konto'}
                    </button>

                    <div className="text-center text-sm text-slate-400 pt-2">
                        Har du redan ett konto?{' '}
                        <Link
                            to="/login"
                            className="text-amber-400 hover:text-amber-300 font-medium"
                        >
                            Logga in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}