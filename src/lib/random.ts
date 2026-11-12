/**
 * @file random.ts
 * Shuffling and category-balanced drawing for the curated lanes on Discover
 * (featured carousel, Editor's Picks).
 */

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

/**
 * Draws `count` tokens from category pools, one category at a time, so a single
 * draw spans many categories instead of filling up from the biggest. The category
 * order is random but weighted by pool size, so an app in a big category is about
 * as likely to be shown as one in a small category.
 *
 * - `exclude`: never drawn (e.g. what another lane already shows).
 * - `avoid`: drawn only after everything else in its category (e.g. the last visit's picks).
 */
export function drawBalanced(
    pools: Record<string, readonly string[]>,
    count: number,
    { exclude = new Set<string>(), avoid = new Set<string>() }: { exclude?: ReadonlySet<string>; avoid?: ReadonlySet<string> } = {},
): string[] {
    const queues = weightedOrder(Object.values(pools)).map((pool) => {
        const usable = pool.filter((t) => !exclude.has(t));
        return [...shuffle(usable.filter((t) => !avoid.has(t))), ...shuffle(usable.filter((t) => avoid.has(t)))];
    });

    const drawn: string[] = [];
    while (drawn.length < count && queues.some((q) => q.length > 0)) {
        for (const queue of queues) {
            // A token listed in two categories is only drawn once.
            while (queue.length > 0 && drawn.includes(queue[0])) queue.shift();
            const token = queue.shift();
            if (token) drawn.push(token);
            if (drawn.length === count) break;
        }
    }
    return drawn;
}

/** Random order where longer pools tend to come first (weighted shuffle, Efraimidis–Spirakis). */
function weightedOrder(pools: readonly (readonly string[])[]): (readonly string[])[] {
    return pools
        .map((pool) => ({ pool, key: Math.random() ** (1 / Math.max(pool.length, 1)) }))
        .sort((a, b) => b.key - a.key)
        .map(({ pool }) => pool);
}
