import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Logo } from '../components/Logo';
import { FormField } from '../components/FormField';

export function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    function validate(): boolean {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Namn är obligatoriskt';
        }

        if (!email.trim()) {
            newErrors.email = 'Email är obligatoriskt';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Ogiltig email-adress';
        }

        if (!password) {
            newErrors.password = 'Lösenord är obligatoriskt';
        } else if (password.length < 8) {
            newErrors.password = 'Lösenordet måste vara minst 8 tecken';
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Lösenordet måste innehålla minst en bokstav och en siffra';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) return;

        setErrors({});
        setLoading(true);

        try {
            const response = await authApi.register({ email, name, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('userEmail', response.email);
            navigate('/');
        } catch {
            setErrors({ general: 'Det gick inte att registrera. Email kanske används redan.' });
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
                    noValidate
                    className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-5 shadow-2xl"
                >
                    <FormField
                        label="Namn"
                        value={name}
                        onChange={setName}
                        placeholder="Ditt namn"
                        error={errors.name}
                    />

                    <FormField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="din@email.se"
                        error={errors.email}
                    />

                    <FormField
                        label="Lösenord"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Minst 8 tecken, en bokstav och en siffra"
                        error={errors.password}
                    />

                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2.5 rounded-lg">
                            {errors.general}
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