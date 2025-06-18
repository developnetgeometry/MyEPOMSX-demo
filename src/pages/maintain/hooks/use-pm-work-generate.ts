import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const createWorkOrderIndividual = async ({
    pm_schedule_id,
    start_date,
    end_date,
    created_by,
    due_date,
}: {
    pm_schedule_id: number;
    start_date: string;
    end_date: string;
    created_by: string;
    due_date: string;
}) => {
    try {
        // Step 1: Insert into e_pm_wo_generate
        const { data: pmWoGenerateData, error: pmWoGenerateError } = await supabase
            .from("e_pm_wo_generate")
            .insert([
                {
                    created_by,
                    start_date,
                    end_date,
                    is_individual: true,
                },
            ])
            .select("id")
            .single();

        if (pmWoGenerateError) {
            console.error("Error inserting into e_pm_wo_generate:", pmWoGenerateError);
            throw pmWoGenerateError;
        }

        const pmWoGenerate = pmWoGenerateData?.id;

        if (!pmWoGenerate) {
            throw new Error("Failed to retrieve pmWoGenerate ID after insertion.");
        }

        // Step 2: Insert into e_wo_pm_schedule
        const { data: woPmScheduleData, error: woPmScheduleError } = await supabase
            .from("e_wo_pm_schedule")
            .insert([
                {
                    created_by,
                    pm_schedule_id,
                    pm_wo_generate: pmWoGenerate,
                    due_date,
                },
            ]);

        if (woPmScheduleError) {
            console.error("Error inserting into e_wo_pm_schedule:", woPmScheduleError);
            throw woPmScheduleError;
        }

        return { pmWoGenerate, woPmScheduleData };
    } catch (err) {
        console.error("Unexpected error in createWorkOrderIndividual:", err);
        throw err;
    }
};


export const createWorkOrderMany = async ({
  start_date,
  end_date,
  created_by,
  pm_schedule_ids,
  frequency_ids,
  due_dates,
}: {
  start_date: string;
  end_date: string;
  created_by: string;
  pm_schedule_ids: number[];
  frequency_ids: number[];
  due_dates: string[];
}) => {
  try {
    // Prepare data for insertion
    const multipleGenerateData = pm_schedule_ids.map((pm_schedule_id, index) => ({
      start_date,
      end_date,
      pm_schedule_id,
      frequency_id: frequency_ids[index],
      due_date: due_dates[index], // Include due_date
      created_by,
    }));

    // Insert into e_pm_wo_multiple_generate
    const { data: insertedData, error } = await supabase
      .from("e_pm_wo_multiple_generate")
      .insert(multipleGenerateData);

    if (error) {
      console.error("Error inserting into e_pm_wo_multiple_generate:", error);
      throw error;
    }

    return insertedData;
  } catch (err) {
    console.error("Unexpected error in createWorkOrderMany:", err);
    throw err;
  }
};