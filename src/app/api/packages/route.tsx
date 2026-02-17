import { NextRequest, NextResponse } from "next/server";
import { getAllFormulae, getAllCasks } from "@/src/lib/api"; // ✅ corrected import (no /src/)
import type { Formula, Cask } from "@/src/types/homebrew";   // ✅ import types

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "formula";
    const query = searchParams.get("q")?.toLowerCase() || "";

    try {
        const data = type === "formula"
            ? await getAllFormulae() as Formula[]
            : await getAllCasks() as Cask[];

        let filtered = data;
        if (query) {
            filtered = data.filter((item) => {
                if (type === "formula") {
                    const f = item as Formula;
                    return f.name.toLowerCase().includes(query) ||
                        (f.desc?.toLowerCase().includes(query) ?? false);
                } else {
                    const c = item as Cask;
                    return c.token.toLowerCase().includes(query) ||
                        c.name.some((n: string) => n.toLowerCase().includes(query)) ||
                        (c.desc?.toLowerCase().includes(query) ?? false);
                }
            });
        }

        return NextResponse.json(filtered);
    } catch (error) {
        console.error("API error:", error); // ✅ optional logging
        return NextResponse.json(
            { error: "Failed to fetch packages" },
            { status: 500 }
        );
    }
}