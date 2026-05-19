import { Header } from '../components/Header';

export function DashboardPage() {
    const userName = localStorage.getItem('userName') || 'Användare';

    const stats = {
        totalCatches: 40,
        releasedCatches: 22,
        mostCaughtSpecies: 'Abborre',
        bestLure: 'Abu Garcia Toby',
        bestLocation: 'Vänern',
    };

    const recentCatches = [
        { id: '1', species: 'Gädda', location: 'Vänern', weight: 5.2, length: 78, caughtAt: '2026-05-15' },
        { id: '2', species: 'Abborre', location: 'Hornborgasjön', weight: 1.1, length: 38, caughtAt: '2026-05-12' },
        { id: '3', species: 'Gös', location: 'Vättern', weight: 3.4, length: 62, caughtAt: '2026-05-10' },
        { id: '4', species: 'Öring', location: 'Unden', weight: 2.1, length: 48, caughtAt: '2026-05-08' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif italic text-slate-100">Välkommen {userName}!</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Totalt antal fångster" value={stats.totalCatches} />
                    <StatCard label="Återutsatta" value={stats.releasedCatches} accent="amber" />
                    <StatCard label="Fångster denna månad" value={8} />
                    <StatCard label="Fiskepass" value={15} accent="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <HighlightCard
                            label="Vanligaste art"
                            value={stats.mostCaughtSpecies}
                        />
                        <HighlightCard
                            label="Bästa bete"
                            value={stats.bestLure}
                        />
                        <HighlightCard
                            label="Bästa plats"
                            value={stats.bestLocation}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-serif italic text-slate-100">Senaste fångsterna</h2>
                                <a href="/catches" className="text-sm text-teal-400 hover:text-teal-300">
                                    Visa alla →
                                </a>
                            </div>
                            <div className="space-y-3">
                                {recentCatches.map(c => (
                                    <div
                                        key={c.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition"
                                    >
                                        <div>
                                            <div className="font-medium text-slate-100">{c.species}</div>
                                            <div className="text-sm text-slate-400">{c.location}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-amber-400 font-medium">{c.weight} kg · {c.length} cm</div>
                                            <div className="text-xs text-slate-500">{c.caughtAt}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    accent?: 'teal' | 'amber';
}

function StatCard({ label, value, accent = 'teal' }: StatCardProps) {
    const accentColor = accent === 'amber' ? 'text-amber-400' : 'text-teal-400';

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="text-sm text-slate-400 mb-1">{label}</div>
            <div className={`text-3xl font-semibold ${accentColor}`}>{value}</div>
        </div>
    );
}

interface HighlightCardProps {
    label: string;
    value: string;
}

function HighlightCard({ label, value }: HighlightCardProps) {
    return (
        <div className="bg-gradient-to-br from-teal-900/30 to-slate-900/70 border border-teal-800/30 rounded-2xl p-5">
            <div className="text-sm text-slate-400 mb-1">{label}</div>
            <div className="text-xl font-serif italic text-slate-100">{value}</div>
        </div>
    );
}