import { WifiOffIcon } from 'lucide-react';

interface Props {
    error: any;
}

const ErrorState: React.FC<Props> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="flex min-h-[600px] w-full flex-col items-center justify-center rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
            {/* Icon with soft pulse effect */}
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <WifiOffIcon size={32} />
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-20"></span>
            </div>

            {/* Text Content */}
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-zinc-200">
                Something went wrong
            </h2>
            <p className="mb-8 max-w-xs text-sm text-slate-500">
                {error.message}
            </p>
        </div>
    );
};

export default ErrorState;