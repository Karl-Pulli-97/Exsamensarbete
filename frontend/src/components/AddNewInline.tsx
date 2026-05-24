import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
    placeholder: string;
    onAdd: (name: string) => Promise<void>;
    onCancel: () => void;
}

export function AddNewInline({ placeholder, onAdd, onCancel }: Props) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);

        try {
            await onAdd(name.trim());
            setName('');
            toast.success('Sparat!');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Kunde inte spara.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-2 p-3 bg-slate-950/50 border border-teal-700/30 rounded-lg space-y-2">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholder}
                className="text-input"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                    if (e.key === 'Escape') onCancel();
                }}
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !name.trim()}
                    className="flex-1 bg-teal-700 hover:bg-teal-600 disabled:bg-slate-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
                >
                    {isLoading ? 'Sparar...' : 'Spara'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 px-3 rounded-lg transition"
                >
                    Avbryt
                </button>
            </div>
        </div>
    );
}