interface Props {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export function FormField({ label, type = 'text', value, onChange, placeholder, error }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-slate-950/50 border rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition ${error
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/50'
                    }`}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}