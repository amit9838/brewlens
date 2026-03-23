/**
 * @file QuickSearchModal.tsx
 * Pre-defined search term shortcuts for common app categories.
 * Clicking a term calls `onSelect(term)` and closes the modal,
 * instantly populating the search field in BrewList.
 */
import { useModal } from "../contexts/ModalContexts";
import { Button } from "./Button";

const SEARCH_TERMS = [
    { label: "3d", term: "3d" },
    { label: "ai", term: "ai" },
    { label: "agent", term: "agent" },
    { label: "api", term: "api" },
    { label: "automation", term: "automation" },
    { label: "backup", term: "backup" },
    { label: "browser", term: "browser" },
    { label: "calculator", term: "calculator" },
    { label: "calendar", term: "calendar" },
    { label: "chat", term: "chat" },
    { label: "cloud storage", term: "cloud storage" },
    { label: "code editor", term: "code editor" },
    { label: "color", term: "color" },
    { label: "container", term: "container" },
    { label: "database", term: "database" },
    { label: "design", term: "design" },
    { label: "document", term: "document" },
    { label: "email", term: "email" },
    { label: "extension", term: "extension" },
    { label: "file manager", term: "file manager" },
    { label: "font", term: "font" },
    { label: "forum", term: "forum" },
    { label: "git", term: "git" },
    { label: "gaming", term: "gaming" },
    { label: "google", term: "google" },
    { label: "ide", term: "ide" },
    { label: "image editor", term: "image editor" },
    { label: "machine learning", term: "machine learning" },
    { label: "map", term: "map" },
    { label: "meeting", term: "meeting" },
    { label: "messaging", term: "messaging" },
    { label: "microsoft", term: "microsoft" },
    { label: "music", term: "music" },
    { label: "notes", term: "notes" },
    { label: "password", term: "password" },
    { label: "pdf", term: "pdf" },
    { label: "podcast", term: "podcast" },
    { label: "project", term: "project" },
    { label: "qr", term: "qr" },
    { label: "recorder", term: "recorder" },
    { label: "screenshot", term: "screenshot" },
    { label: "social media", term: "social media" },
    { label: "spreadsheet", term: "spreadsheet" },
    { label: "streaming", term: "streaming" },
    { label: "todo", term: "todo" },
    { label: "terminal", term: "terminal" },
    { label: "translator", term: "translator" },
    { label: "video", term: "video" },
    { label: "video call", term: "video call" },
    { label: "vpn", term: "vpn" },
    { label: "weather", term: "weather" },
    { label: "web", term: "web" },
];
interface Props {
    onSelect: (term: string) => void;
}

export default function QuickSearchModal({ onSelect }: Props) {
    const { closeModal } = useModal();

    const handleSelect = (term: string) => {
        onSelect(term);
        closeModal();
    };

    return (
        <div className="p-4 max-w-lg min-w-[20rem] md:min-w-[32rem]">
            <h2 className="text-lg font-bold mb-1 text-zinc-900 dark:text-zinc-100">Quick Search</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Click a term to search instantly</p>
            <div className="flex flex-wrap gap-2">
                {SEARCH_TERMS.map(({ label, term }) => (
                    <Button
                        key={term}
                        onClick={() => handleSelect(term)}
                        variant="outline"
                        isPill={true}
                        size="sm"
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
