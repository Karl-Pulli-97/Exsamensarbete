import { Header } from '../components/Header';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
    const userName = localStorage.getItem('userName') || 'Användare';
    const { overview, recentCatches, isLoading, isError } = useDashboard();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <Header />
                <main className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-slate-400">Laddar...</div>
                </main>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <Header />
                <main className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-red-400">Kunde inte hämta data. Försök igen senare.</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif italic text-slate-100">Välkommen {userName}!</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Totalt antal fångster" value={overview?.totalCatches ?? 0} />
                    <StatCard label="Återutsatta" value={overview?.releasedCatches ?? 0} accent="amber" />
                    <StatCard label="Fångster denna månad" value={overview?.catchesThisMonth ?? 0} />
                    <StatCard label="Fiskepass" value={overview?.fishingTrips ?? 0} accent="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <HighlightCard
                            label="Vanligaste art"
                            value={overview?.mostCaughtSpecies ?? 'Ingen data'}
                        />
                        <HighlightCard
                            label="Bästa bete"
                            value={overview?.bestLure ?? 'Ingen data'}
                        />
                        <HighlightCard
                            label="Bästa plats"
                            value={overview?.bestLocation ?? 'Ingen data'}
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
                                {recentCatches && recentCatches.length > 0 ? (
                                    recentCatches.map(c => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-100">{c.speciesName}</div>
                                                <div className="text-sm text-slate-400">{c.locationName ?? 'Okänd plats'}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-amber-400 font-medium">
                                                    {c.weight ? `${c.weight} kg` : '—'} · {c.length ? `${c.length} cm` : '—'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(c.caughtAt).toLocaleDateString('sv-SE')}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-400 text-center py-8">
                                        Inga fångster ännu. Logga din första!
                                    </div>
                                )}
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