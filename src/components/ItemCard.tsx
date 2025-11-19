import { memo, useState } from "react";
import { type BrewItem } from "../types";
import { Button } from "./ui/Button";
import { Check, Copy } from "lucide-react";

export const ItemCard = memo(({ item, onViewJson }: { item: BrewItem, onViewJson: (i: any) => void }) => {
    const [copied, setCopied] = useState(false);

    const copyCmd = () => {
        navigator.clipboard.writeText(item.installCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="flex flex-col p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-green-500 transition-all h-full group">
            <div className="flex gap-4 items-start mb-3 ">
                <img
                    src={`https://www.google.com/s2/favicons?domain=${item.homepage}&sz=64`}
                    onError={(e) => (e.currentTarget.src = "/vite.svg")}
                    className="w-11 h-11  rounded  bg-gray-200 dark:bg-gray-700 p-1 border border-gray-300 dark:border-gray-600"
                    alt=""
                />
                <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-mono truncate">{item.token}</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{item.desc}</p>

            <div className="mt-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded max-w-[8rem] overflow-hidden text-ellipsis text-nowrap" title={item.version}>v{item.version}</span>
                    <span className="cursor-default">|</span>
                    <button onClick={() => onViewJson(item.raw)} className="hover:text-green-500 hover:underline">JSON</button>
                    <span className="cursor-default">|</span>
                    <a href={item.homepage} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">Website</a>
                </div>

                <div className="flex gap-2">
                    <code className="flex-1 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded text-xs font-mono text-gray-700 dark:text-gray-300 truncate border border-transparent group-hover:border-green-500/30">
                        {item.installCmd}
                    </code>
                    <Button variant="secondary" onClick={copyCmd} className="px-3 py-0">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
});