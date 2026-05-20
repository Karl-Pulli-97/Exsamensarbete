import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCatches } from '../hooks/useCatches';
import { useReferenceData } from '../hooks/useReferenceData';
import type { CatchFilter } from '../types/catch';

export function CatchesPage() {
    const [filter, setFilter] = useState<CatchFilter>({});
    const { data: catches, isLoading, isError } = useCatches(filter);
    const { species, locations, lures } = useReferenceData();

    function updateFilter(key: keyof CatchFilter, value: string | boolean | undefined) {
        setFilter(prev => {
            const next = { ...prev };
            if (value === '' || value === undefined) {
                delete next[key];
            } else {
                (next as Record<string, unknown>)[key] = value;
            }
            return next;
        });
    }

    function clearFilters() {
        setFilter({});
    }

    const hasActiveFilters = Object.keys(filter).length > 0;

    return (
        <div className="bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif italic text-slate-100">Fångster</h1>
                        <p className="text-slate-400 mt-1">
                            {catches ? `Antal fångster: ${catches.length}` : 'Laddar...'}
                        </p>
                    </div>
                    <Link
                        to="/add"
                        className="bg-teal-700 hover:bg-teal-600 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-lg shadow-teal-900/30"
                    >
                        + Logga ny fångst
                    </Link>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-serif italic text-slate-200">Filter</h2>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-amber-400 hover:text-amber-300"
                            >
                                Rensa filter
                            </button>
                        )}
                    </div>

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
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Bete</label>
                            <select
                                value={filter.lureId ?? ''}
                                onChange={(e) => updateFilter('lureId', e.target.value)}
                                className="select-input"
                            >
                                <option value="">Alla beten</option>
                                {lures.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-slate-400">Status</label>
                            <select
                                value={filter.released === undefined ? '' : String(filter.released)}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    updateFilter('released', v === '' ? undefined : v === 'true');
                                }}
                                className="select-input"
                            >
                                <option value="">Alla</option>
                                <option value="true">Återutsatta</option>
                                <option value="false">Behållna</option>
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

                {isLoading && <div className="text-slate-400">Laddar...</div>}
                {isError && <div className="text-red-400">Kunde inte hämta fångster.</div>}

                {catches && catches.length === 0 && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-12 text-center">
                        <div className="text-slate-400 mb-2">Inga fångster matchade dina filter</div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-teal-400 hover:text-teal-300"
                            >
                                Rensa filter
                            </button>
                        )}
                    </div>
                )}

                {catches && catches.length > 0 && (
                    <div className="space-y-3">
                        {catches.map(c => (
                            <div
                                key={c.id}
                                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-medium text-slate-100">{c.speciesName}</h3>
                                            {c.released && (
                                                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                    Återutsatt
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1">
                                            {c.locationName ?? 'Okänd plats'}
                                            {c.lureName && ` · ${c.lureName}`}
                                            {c.technique && ` · ${c.technique}`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-amber-400 font-medium">
                                            {c.weight ? `${c.weight} kg` : '—'} · {c.length ? `${c.length} cm` : '—'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {new Date(c.caughtAt).toLocaleString('sv-SE', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {(c.weather || c.notes) && (
                                    <div className="mt-3 pt-3 border-t border-slate-800 text-sm">
                                        {c.weather && (
                                            <div className="text-slate-400">
                                                <span className="text-slate-500">Väder:</span> {c.weather}
                                            </div>
                                        )}
                                        {c.notes && (
                                            <div className="text-slate-300 italic mt-1">"{c.notes}"</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}