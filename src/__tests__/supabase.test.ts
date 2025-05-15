import { describe, it, expect, vi  } from "vitest";
import * as SupabaseClient from "../lib/supabaseClient";

vi.mock("../lib/supabaseClient", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                data: [{ id: 1, name: "Mock User" }],
                error: null,
            })),
        })),
    },
}));

describe("Supabase client", () => {
    it("should return mocked data", async () => {
        const { data, error } = await SupabaseClient.supabase.from('e_employee').select();
        expect(data).toEqual([{ id: 1, name: "Mock User" }]);
        expect(error).toBeNull();
    })
})