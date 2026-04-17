/**
 * @file QuickSearchModal.tsx
 * Standardized Quick Search category shortcuts.
 */
import { Sparkles } from "lucide-react";
import { useModal } from "../contexts/ModalContexts";
import { Button } from "./Button";
import { ModalHeader, ModalBody } from './Modal';

const SEARCH_TERMS = [
    { label: "3D", term: "3d" },
    { label: "AI", term: "ai" },
    { label: "Agent", term: "agent" },
    { label: "API", term: "api" },
    { label: "Automation", term: "automation" },
    { label: "Backup", term: "backup" },
    { label: "Browser", term: "browser" },
    { label: "Calculator", term: "calculator" },
    { label: "Calendar", term: "calendar" },
    { label: "Chat", term: "chat" },
    { label: "Cloud Storage", term: "cloud storage" },
    { label: "Code Editor", term: "code editor" },
    { label: "Color", term: "color" },
    { label: "Container", term: "container" },
    { label: "Database", term: "database" },
    { label: "Design", term: "design" },
    { label: "Document", term: "document" },
    { label: "Email", term: "email" },
    { label: "Extension", term: "extension" },
    { label: "File Manager", term: "file manager" },
    { label: "Font", term: "font" },
    { label: "Forum", term: "forum" },
    { label: "Git", term: "git" },
    { label: "Gaming", term: "gaming" },
    { label: "Google", term: "google" },
    { label: "IDE", term: "ide" },
    { label: "Image Editor", term: "image editor" },
    { label: "Machine Learning", term: "machine learning" },
    { label: "Map", term: "map" },
    { label: "Meeting", term: "meeting" },
    { label: "Messaging", term: "messaging" },
    { label: "Microsoft", term: "microsoft" },
    { label: "Music", term: "music" },
    { label: "Notes", term: "notes" },
    { label: "Password", term: "password" },
    { label: "PDF", term: "pdf" },
    { label: "Podcast", term: "podcast" },
    { label: "Project", term: "project" },
    { label: "QR", term: "qr" },
    { label: "Recorder", term: "recorder" },
    { label: "Screenshot", term: "screenshot" },
    { label: "Social Media", term: "social media" },
    { label: "Spreadsheet", term: "spreadsheet" },
    { label: "Streaming", term: "streaming" },
    { label: "Todo", term: "todo" },
    { label: "Terminal", term: "terminal" },
    { label: "Translator", term: "translator" },
    { label: "Video", term: "video" },
    { label: "Video Call", term: "video call" },
    { label: "VPN", term: "vpn" },
    { label: "Weather", term: "weather" },
    { label: "Web", term: "web" },
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
        <>
            <ModalHeader 
                title="Quick Search" 
                subtitle="Instantly find apps by common category"
                icon={<Sparkles size={20} />}
            />
            
            <ModalBody>
                <div className="flex flex-wrap gap-2">
                    {SEARCH_TERMS.map(({ label, term }) => (
                        <Button
                            key={term}
                            onClick={() => handleSelect(term)}
                            variant="secondary"
                            isPill={true}
                            size="sm"
                            className="hover:border-green-500 hover:text-green-600 dark:hover:text-green-400"
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </ModalBody>
        </>
    );
}
