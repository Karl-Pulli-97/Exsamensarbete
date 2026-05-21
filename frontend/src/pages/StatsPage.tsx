import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { Header } from '../components/Header';
import { useStats } from '../hooks/useStats';
import { useReferenceData } from '../hooks/useReferenceData';
import type { CatchFilter } from '../types/catch';

const COLORS = ['#0d9488', '#0891b2', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

export function StatsPage() {
    const [filter, setFilter] = useState<CatchFilter>({});
    const { overview, bySpecies, byLure, byLocation, byMonth, isLoading } = useStats(filter);
    const { species, locations } = useReferenceData();

    const showSpeciesChart = !filter.speciesId;
    const showLureChart = !filter.lureId;
    const showLocationChart = !filter.locationId;

    function updateFilter(key: keyof CatchFilter, value: string) {
        setFilter(prev => {
            const next = { ...prev };
            if (value === '') {
                delete next[key];
            } else {
                (next as Record<string, unknown>)[key] = value;
            }
            return next;
        });
    }

    const monthData = (() => {
        if (!byMonth || byMonth.length === 0) return [];

        const sorted = [...byMonth].sort((a, b) =>
            a.year !== b.year ? a.year - b.year : a.month - b.month
        );
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const dataMap = new Map(
            byMonth.map(m => [`${m.year}-${m.month}`, m.count])
        );

        const result = [];
        let year = first.year;
        let month = first.month;

        while (year < last.year || (year === last.year && month <= last.month)) {
            result.push({
                name: `${MONTHS[month - 1]} ${String(year).slice(2)}`,
                count: dataMap.get(`${year}-${month}`) ?? 0,
            });

            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
        }

        return result;
    })();

    return (
        <div className="bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif italic text-slate-100">Statistik</h1>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
                    <h2 className="text-lg font-serif italic text-slate-200 mb-4">Filtrera statistik</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Art</label>
                            <select
                                value={filter.speciesId ?? ''}
                                onChange={(e) => updateFilter('speciesId', e.target.value)}
                                className="select-input"
                            >
                                <option value="">Alla arter</option>
                                {species.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Plats</label>
                            <select
                                value={filter.locationId ?? ''}
                                onChange={(e) => updateFilter('locationId', e.target.value)}
                                className="select-input"
                            >
                                <option value="">Alla platser</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Från datum</label>
                            <input
                                type="date"
                                value={filter.from ?? ''}
                                onChange={(e) => updateFilter('from', e.target.value)}
                                className="text-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Till datum</label>
                            <input
                                type="date"
                                value={filter.to ?? ''}
                                onChange={(e) => updateFilter('to', e.target.value)}
                                className="text-input"
                            />
                        </div>
                    </div>
                </div>

                {isLoading && <div className="text-slate-400">Laddar statistik...</div>}

                {!isLoading && overview && overview.totalCatches === 0 && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-12 text-center">
                        <div className="text-slate-400">Inga fångster matchar dina filter</div>
                    </div>
                )}

                {!isLoading && overview && overview.totalCatches > 0 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MiniStat label="Fångster" value={overview.totalCatches} />
                            <MiniStat label="Återutsatta" value={overview.releasedCatches} />
                            <MiniStat label="Fiskepass" value={overview.fishingTrips} />
                            <MiniStat label="Tyngsta fisk" value={overview.largestWeight ? `${overview.largestWeight} kg` : '—'} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {showSpeciesChart && (
                                <ChartCard title="Fångster per art">
                                    {bySpecies && bySpecies.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={bySpecies}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                                <XAxis dataKey="speciesName" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" allowDecimals={false} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#0f172a',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart />
                                    )}
                                </ChartCard>
                            )}

                            {showLureChart && (
                                <ChartCard title="Bästa beten">
                                    {byLure && byLure.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={byLure}
                                                    dataKey="count"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={90}
                                                >
                                                    {byLure.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#0f172a',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    iconType="circle"
                                                    wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart />
                                    )}
                                </ChartCard>
                            )}

                            {showLocationChart && (
                                <ChartCard title="Bästa platser">
                                    {byLocation && byLocation.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={byLocation} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                                <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={130} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#0f172a',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <Bar dataKey="count" fill="#d97706" radius={[0, 8, 8, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart />
                                    )}
                                </ChartCard>
                            )}

                            <ChartCard title="Fångster över tid">
                                {monthData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={monthData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#0f172a',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#0d9488"
                                                strokeWidth={3}
                                                dot={{ fill: '#0d9488', r: 5 }}
                                                isAnimationActive={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyChart />
                                )}
                            </ChartCard>
                        </div>

                        {showSpeciesChart && bySpecies && bySpecies.length > 0 && (
                            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                                <h2 className="text-xl font-serif italic text-slate-100 mb-4">Detaljer per art</h2>

                                {/* Desktop: Tabell */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-slate-400 border-b border-slate-800">
                                                <th className="py-2 px-3">Art</th>
                                                <th className="py-2 px-3 text-right">Antal</th>
                                                <th className="py-2 px-3 text-right">Snittvikt</th>
                                                <th className="py-2 px-3 text-right">Tyngsta</th>
                                                <th className="py-2 px-3 text-right">Snittlängd</th>
                                                <th className="py-2 px-3 text-right">Längsta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bySpecies.map(s => (
                                                <tr key={s.speciesName} className="border-b border-slate-800/50">
                                                    <td className="py-3 px-3 font-medium text-slate-100">{s.speciesName}</td>
                                                    <td className="py-3 px-3 text-right text-teal-400">{s.count}</td>
                                                    <td className="py-3 px-3 text-right text-slate-300">
                                                        {s.averageWeight ? `${s.averageWeight.toFixed(2)} kg` : '—'}
                                                    </td>
                                                    <td className="py-3 px-3 text-right text-amber-400">
                                                        {s.largestWeight ? `${s.largestWeight} kg` : '—'}
                                                    </td>
                                                    <td className="py-3 px-3 text-right text-slate-300">
                                                        {s.averageLength ? `${s.averageLength.toFixed(1)} cm` : '—'}
                                                    </td>
                                                    <td className="py-3 px-3 text-right text-amber-400">
                                                        {s.largestLength ? `${s.largestLength} cm` : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="md:hidden space-y-3">
                                    {bySpecies.map(s => (
                                        <div
                                            key={s.speciesName}
                                            className="bg-slate-950/50 border border-slate-800 rounded-xl p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                                <h3 className="font-medium text-slate-100">{s.speciesName}</h3>
                                                <span className="text-teal-400 font-medium">{s.count} st</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <div className="text-xs text-slate-500">Snittvikt</div>
                                                    <div className="text-slate-300">
                                                        {s.averageWeight ? `${s.averageWeight.toFixed(2)} kg` : '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Tyngsta</div>
                                                    <div className="text-amber-400">
                                                        {s.largestWeight ? `${s.largestWeight} kg` : '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Snittlängd</div>
                                                    <div className="text-slate-300">
                                                        {s.averageLength ? `${s.averageLength.toFixed(1)} cm` : '—'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Längsta</div>
                                                    <div className="text-amber-400">
                                                        {s.largestLength ? `${s.largestLength} cm` : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

interface MiniStatProps {
    label: string;
    value: string | number;
}

function MiniStat({ label, value }: MiniStatProps) {
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-semibold text-teal-400">{value}</div>
        </div>
    );
}

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-serif italic text-slate-200 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="flex items-center justify-center h-[300px] text-slate-500">
            Ingen data att visa
        </div>
    );
}