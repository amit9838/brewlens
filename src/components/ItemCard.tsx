import { memo } from "react";
import { type BrewItem } from "../types";
import { NavLink } from "react-router-dom";
export const ItemCard = memo(({ item }: { item: BrewItem }) => {

    const packageStatus = (item: BrewItem) => {
        const isNotInstallable = (item.deprecated || item.disabled);
        const reason = item.deprecated ? "Deprecated" : item.disabled ? "Disabled" : "unknown";
        return { isNotInstallable, reason };
    }

    return (
        <NavLink
            to={`/${item.type}/${item.token}`}
            state={{ caskData: item }} // Pass the object here
        >
            <div className="flex flex-col p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg hover:border-green-500 transition-all h-full group">
                <div className="flex gap-4 items-start mb-3 ">
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${item.homepage}&sz=64`}
                        onError={(e) => (e.currentTarget.src = "/vite.svg")}
                        className="w-11 h-11 rounded-full bg-gray-200 dark:bg-zinc-700 p-1 border-0 border-gray-300 dark:border-gray-600"
                        alt=""
                    />
                    <div className="min-w-0 ">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
                        <div className="max-w-[14rem] overflow-hidden text-ellipsis text-nowrap text-zinc-500 dark:text-zinc-400 rounded-full">
                            <span className=" bg-gray-100 dark:bg-zinc-700/30 px-2 py-1 text-xs rounded-full " title={item.version}>v{item.version}</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{item.desc}</p>
                <div className="mt-auto space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        {packageStatus(item).isNotInstallable &&
                            <span className="bg-orange-600/20 text-orange-500 px-2 py-1 rounded-full max-w-[8rem] overflow-hidden text-ellipsis text-nowrap" >{packageStatus(item).reason}</span>
                        }
                    </div>
                </div>
            </div>
        </NavLink>
    );
});