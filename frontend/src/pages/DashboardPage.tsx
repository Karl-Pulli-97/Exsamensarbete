import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Användare';

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">🎣 Välkommen, {userName}!</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition"
                    >
                        Logga ut
                    </button>
                </div>

                <p className="text-slate-400">
                    Här kommer din dashboard med statistik och fångster snart att visas.
                </p>
            </div>
        </div>
    );
}