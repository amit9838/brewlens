import { memo, useState, useEffect } from "react";
import { type BrewItem } from "../types";
import { NavLink } from "react-router-dom";
import { FaviconImage } from "./ui/FaviconImage";

interface ItemCardProps {
    item: BrewItem;
    enableBackground?: boolean;
}

export const ItemCard = memo(({ item, enableBackground = false }: ItemCardProps) => {
    const imageUrl = `https://www.google.com/s2/favicons?domain=${item.homepage}&sz=64`;
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!enableBackground) return;
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.onerror = () => setImageLoaded(true);
        img.src = imageUrl;
    }, [imageUrl, enableBackground]);

    const packageStatus = (item: BrewItem) => {
        const isNotInstallable = (item.deprecated || item.disabled);
        const reason = item.deprecated ? "Deprecated" : item.disabled ? "Disabled" : "unknown";
        return { isNotInstallable, reason };
    };

    return (
        <NavLink
            to={`/${item.type}/${item.token}`}
            // Removed overflow-hidden here so your hover:shadow-lg works!
            className="relative block"
            style={
                enableBackground
                    ? ({ '--bg-url': `url(${imageUrl})` } as React.CSSProperties)
                    : undefined
            }
        >
            {/* Dedicated clipping wrapper for the background */}
            {enableBackground && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
                    <div className={`
                        absolute inset-3
                        bg-contain bg-left bg-no-repeat
                        bg-[image:var(--bg-url)]
                        filter blur-[30px] saturate-300
                        transition-opacity duration-700
                        ${imageLoaded ? 'opacity-70 dark:opacity-30' : 'opacity-0'}
                    `} />
                </div>
            )}

            {/* Card content */}
            <div
                className={`relative z-10 flex flex-col p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-green-500 transition-all h-full group ${enableBackground
                        ? "bg-white/80 dark:bg-zinc-900/80"
                        : "bg-white dark:bg-zinc-900/70"
                    }`}
            >
                <div className="flex gap-4 items-start mb-3">
                    <FaviconImage
                        homepage={item.homepage}
                        name={item.name}
                        size={44}
                        className="p-1 border border-gray-200 dark:border-zinc-700"
                    />
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
                        <span className="opacity-60 pb-1 text-xs rounded-full" title={item.version}>
                            {item.raw.tap}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-1">
                    <div className="max-w-[14rem] overflow-hidden text-ellipsis text-nowrap text-zinc-500 dark:text-zinc-400 rounded-full">
                        <span className="bg-gray-100 dark:bg-zinc-700/30 px-3 py-2 text-xs rounded-full" title={item.version}>
                            v{item.version}
                        </span>
                    </div>
                    {item.package.isFoss && (
                        <div className="max-w-[14rem] overflow-hidden text-ellipsis text-nowrap text-blue-500 dark:text-blue-400 rounded-full">
                            <span className="bg-gray-100 dark:bg-blue-700/10 px-3 py-2 text-xs rounded-full">
                                Open Source
                            </span>
                        </div>
                    )}
                    <div className="mt-auto space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            {packageStatus(item).isNotInstallable && (
                                <span className="bg-orange-600/20 text-orange-500 px-2 py-1 rounded-full max-w-[8rem] overflow-hidden text-ellipsis text-nowrap">
                                    {packageStatus(item).reason}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-sm ml-1 text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
                    {item.desc}
                </p>
            </div>
        </NavLink>
    );
});