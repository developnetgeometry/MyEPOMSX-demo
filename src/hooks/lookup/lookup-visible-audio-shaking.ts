import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useVisibleAudioShakingData = () => {
    return useQuery({
        queryKey: ["i-visible-audio-shaking-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("i_visible_audio_shaking")
                .select("id, name, value")
                .order("id");

            if (error) {
                console.error("Error fetching i_visible_audio_shaking data:", error);
                throw error;
            }

            return data;
        },
    });
};