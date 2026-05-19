import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

const dummySpecies = [
    { id: '1', name: 'Abborre' },
    { id: '2', name: 'Gädda' },
    { id: '3', name: 'Gös' },
    { id: '4', name: 'Öring' },
    { id: '5', name: 'Regnbåge' },
    { id: '6', name: 'Mört' },
];

const dummyLocations = [
    { id: '1', name: 'Vänern' },
    { id: '2', name: 'Vättern' },
    { id: '3', name: 'Hornborgasjön' },
    { id: '4', name: 'Unden' },
    { id: '5', name: 'Grosken' },
];

const dummyLures = [
    { id: '1', name: 'Abu Garcia Toby' },
    { id: '2', name: 'Rapala Original' },
    { id: '3', name: 'Abu Garcia Droppen' },
    { id: '4', name: 'Kopito Shad' },
    { id: '5', name: 'Salmo Hornet' },
    { id: '6', name: 'Woolly Bugger' },
    { id: '7', name: 'Daggmask' },
];

const techniques = ['Spinnfiske', 'Mete', 'Flugfiske', 'Trolling', 'Pimpel'];

export function AddCatchPage() {
    const navigate = useNavigate();

    const [speciesId, setSpeciesId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [lureId, setLureId] = useState('');
    const [caughtAt, setCaughtAt] = useState(getNowDateTimeLocal());
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [released, setReleased] = useState(false);
    const [technique, setTechnique] = useState('');
    const [weather, setWeather] = useState('');
    const [notes, setNotes] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log({
            speciesId, locationId, lureId, caughtAt,
            weight, length, released, technique, weather, notes
        });
        alert('Fångst sparad! (Dummy - backend ej kopplat än)');
        navigate('/catches');
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif italic text-slate-100">Logga ny fångst</h1>
                    <p className="text-slate-400 mt-1">Fyll i detaljerna nedan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Section title="Vad fångade du?">
                        <Field label="Art" required>
                            <select
                                value={speciesId}
                                onChange={(e) => setSpeciesId(e.target.value)}
                                required
                                className="select-input"
                            >
                                <option value="">Välj art...</option>
                                {dummySpecies.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
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
                            <select
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                className="select-input"
                            >
                                <option value="">Välj plats...</option>
                                {dummyLocations.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
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
                            <select
                                value={lureId}
                                onChange={(e) => setLureId(e.target.value)}
                                className="select-input"
                            >
                                <option value="">Välj bete...</option>
                                {dummyLures.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
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
                            className="flex-1 bg-teal-700 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition shadow-lg shadow-teal-900/30"
                        >
                            Spara fångst
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