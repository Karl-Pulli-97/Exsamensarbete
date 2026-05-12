import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authApi.login({ email, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.name);
            navigate('/');
        } catch (err) {
            setError('Fel email eller lösenord');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">🎣 Fishing Log</h1>
                    <p className="text-slate-400">Logga in för att fortsätta</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Lösenord</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded transition"
                    >
                        {loading ? 'Loggar in...' : 'Logga in'}
                    </button>

                    <div className="text-center text-sm text-slate-400">
                        Har du inget konto?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">
                            Registrera dig
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}