import { WifiOff } from 'lucide-react';
import { EmptyState } from '../ui/kit';

/** Friendly network / API failure state. */
const ErrorState: React.FC<{ error: unknown }> = ({ error }) => {
    if (!error) return null;
    const message = error instanceof Error ? error.message : 'Please check your connection and try again.';
    return (
        <EmptyState
            icon={<WifiOff size={24} />}
            title="Something went wrong"
            text={message}
        />
    );
};

export default ErrorState;
