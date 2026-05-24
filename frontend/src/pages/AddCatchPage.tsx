import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '../components/Header';
import { useReferenceData } from '../hooks/useReferenceData';
import { catchesApi } from '../api/catchesApi';
import type { CatchEntryRequest } from '../types/catch';
import { AddNewInline } from '../components/AddNewInline';
import { speciesApi, locationsApi, luresApi } from '../api/referenceDataApi';

const techniques = [
    'Spinnfiske',
    'Haspelfiske',
    'Multifiske',
    'Mete',
    'Bottenmete',
    'Flugfiske',
    'Trolling',
    'Pimpel',
    'Ismete',
];

export function AddCatchPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { species, locations, lures, isLoading } = useReferenceData();

    const [speciesId, setSpeciesId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [lureId, setLureId] = useState('');
    const [caughtAt, setCaughtAt] = useState(getNowDateTimeLocal());
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [released, setReleased] = useState(false);
    const [technique, setTechnique] = useState('');
    const [weather, setWeather] = useState('');
    const [waterTemperature, setWaterTemperature] = useState('');
    const [addingNew, setAddingNew] = useState<'species' | 'location' | 'lure' | null>(null);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);

    const createMutation = useMutation({
        mutationFn: (data: CatchEntryRequest) => catchesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['catches'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            navigate('/');
        },
        onError: () => {
            setError('Kunde inte spara fångsten. Försök igen.');
        }
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const data: CatchEntryRequest = {
            speciesId,
            locationId: locationId || undefined,
            lureId: lureId || undefined,
            caughtAt: new Date(caughtAt).toISOString(),
            weight: weight ? parseFloat(weight) : undefined,
            length: length ? parseFloat(length) : undefined,
            released,
            technique: technique || undefined,
            weather: weather || undefined,
            waterTemperature: waterTemperature || undefined,
            notes: notes || undefined,
        };

        createMutation.mutate(data);
    }

    if (isLoading) {
        return (
            <div className="bg-slate-950 text-slate-100">
                <Header />
                <main className="max-w-2xl mx-auto px-4 py-8">
                    <div className="text-slate-400">Laddar...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif italic text-slate-100">Logga ny fångst</h1>
                    <p className="text-slate-400 mt-1">Fyll i detaljerna nedan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Section title="Vad fångade du?">
                        <Field label="Art" required>
                            <div className="flex gap-2">
                                <select
                                    value={speciesId}
                                    onChange={(e) => setSpeciesId(e.target.value)}
                                    required
                                    className="select-input flex-1"
                                >
                                    <option value="">Välj art...</option>
                                    {species.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setAddingNew(addingNew === 'species' ? null : 'species')}
                                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                    title="Lägg till ny art"
                                >
                                    +
                                </button>
                            </div>
                            {addingNew === 'species' && (
                                <AddNewInline
                                    placeholder="Namn på art (t.ex. Lake)"
                                    onAdd={async (name) => {
                                        const newSpecies = await speciesApi.create(name);
                                        await queryClient.invalidateQueries({ queryKey: ['species'] });
                                        setSpeciesId(newSpecies.id);
                                        setAddingNew(null);
                                    }}
                                    onCancel={() => setAddingNew(null)}
                                />
                            )}
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Vikt (kg)">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="text-input"
                                    placeholder="0"
                                />
                            </Field>
                            <Field label="Längd (cm)">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                    className="text-input"
                                    placeholder="0"
                                />
                            </Field>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer pt-2">
                            <input
                                type="checkbox"
                                checked={released}
                                onChange={(e) => setReleased(e.target.checked)}
                                className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-teal-600 focus:ring-teal-500/50"
                            />
                            <span className="text-slate-200">Återutsatt</span>
                        </label>
                    </Section>

                    <Section title="Var och när?">
                        <Field label="Plats">
                            <div className="flex gap-2">
                                <select
                                    value={locationId}
                                    onChange={(e) => setLocationId(e.target.value)}
                                    className="select-input flex-1"
                                >
                                    <option value="">Välj plats...</option>
                                    {locations.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setAddingNew(addingNew === 'location' ? null : 'location')}
                                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                    title="Lägg till ny plats"
                                >
                                    +
                                </button>
                            </div>
                            {addingNew === 'location' && (
                                <AddNewInline
                                    placeholder="Namn på plats (t.ex. Vänern)"
                                    onAdd={async (name) => {
                                        const newLocation = await locationsApi.create(name);
                                        await queryClient.invalidateQueries({ queryKey: ['locations'] });
                                        setLocationId(newLocation.id);
                                        setAddingNew(null);
                                    }}
                                    onCancel={() => setAddingNew(null)}
                                />
                            )}
                        </Field>

                        <Field label="Datum och tid" required>
                            <input
                                type="datetime-local"
                                value={caughtAt}
                                onChange={(e) => setCaughtAt(e.target.value)}
                                required
                                className="text-input"
                            />
                        </Field>
                    </Section>

                    <Section title="Hur fiskade du?">
                        <Field label="Bete">
                            <div className="flex gap-2">
                                <select
                                    value={lureId}
                                    onChange={(e) => setLureId(e.target.value)}
                                    className="select-input flex-1"
                                >
                                    <option value="">Välj bete...</option>
                                    {lures.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setAddingNew(addingNew === 'lure' ? null : 'lure')}
                                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                                    title="Lägg till nytt bete"
                                >
                                    +
                                </button>
                            </div>
                            {addingNew === 'lure' && (
                                <AddNewInline
                                    placeholder="Namn på bete (t.ex. Abu Garcia Toby)"
                                    onAdd={async (name) => {
                                        const newLure = await luresApi.create(name);
                                        await queryClient.invalidateQueries({ queryKey: ['lures'] });
                                        setLureId(newLure.id);
                                        setAddingNew(null);
                                    }}
                                    onCancel={() => setAddingNew(null)}
                                />
                            )}
                        </Field>

                        <Field label="Teknik">
                            <select
                                value={technique}
                                onChange={(e) => setTechnique(e.target.value)}
                                className="select-input"
                            >
                                <option value="">Välj teknik...</option>
                                {techniques.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Väder">
                            <input
                                type="text"
                                value={weather}
                                onChange={(e) => setWeather(e.target.value)}
                                className="text-input"
                                placeholder="exempel (Soligt, 18°C, lätt vind)"
                            />
                        </Field>

                        <Field label="Vattentemperatur">
                            <input
                                type="text"
                                value={waterTemperature}
                                onChange={(e) => setWaterTemperature(e.target.value)}
                                className="text-input"
                                placeholder="exempel (12°C)"
                            />
                        </Field>
                    </Section>

                    <Section title="Anteckningar">
                        <Field label="Övrigt">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="text-input resize-none"
                                placeholder="Något särskilt att komma ihåg?"
                            />
                        </Field>
                    </Section>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-lg transition"
                        >
                            Avbryt
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="flex-1 bg-teal-700 hover:bg-teal-600 disabled:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-lg shadow-teal-900/30"
                        >
                            {createMutation.isPending ? 'Sparar...' : 'Spara fångst'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-serif italic text-slate-200 border-b border-slate-800 pb-3">
                {title}
            </h2>
            {children}
        </div>
    );
}

interface FieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
                {label}
                {required && <span className="text-amber-400 ml-1">*</span>}
            </label>
            {children}
        </div>
    );
}

function getNowDateTimeLocal(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}