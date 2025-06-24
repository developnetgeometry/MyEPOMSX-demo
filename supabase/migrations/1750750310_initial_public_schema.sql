

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."admin_create_user"("user_email" "text", "user_full_name" "text", "user_type_id" "uuid") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    temp_password TEXT;
    user_type_name TEXT;
BEGIN
    -- Validate user type exists
    SELECT name INTO user_type_name 
    FROM public.user_type 
    WHERE id = user_type_id AND is_active = true;
    
    IF user_type_name IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid user type selected'
        );
    END IF;
    
    -- Generate a temporary password (user should change on first login)
    temp_password := 'TempPass' || floor(random() * 10000)::text;
    
    -- Note: This function prepares the data but actual user creation
    -- needs to be handled by your frontend using Admin API
    -- This is because SQL cannot directly call Supabase Auth Admin API
    
    RETURN json_build_object(
        'success', true,
        'message', 'User data validated, ready for creation',
        'user_type_name', user_type_name,
        'temp_password', temp_password
    );
END;
$$;


ALTER FUNCTION "public"."admin_create_user"("user_email" "text", "user_full_name" "text", "user_type_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_update_user_password"("user_id" "uuid", "new_password" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  caller_user_type TEXT;
BEGIN
  -- Check if the caller has admin rights
  SELECT ut.name INTO caller_user_type
  FROM public.profiles p
  JOIN public.user_type ut ON p.user_type_id = ut.id
  WHERE p.id = auth.uid();
  
  -- Only allow admin users to update passwords
  IF caller_user_type = 'Admin' THEN
    -- Update the password in auth.users
    UPDATE auth.users
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only admin users can update passwords for other users';
  END IF;
END;
$$;


ALTER FUNCTION "public"."admin_update_user_password"("user_id" "uuid", "new_password" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."assign_user_to_project"("p_user_id" "uuid", "p_project_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Check if the assignment already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_projects
    WHERE user_id = p_user_id AND project_id = p_project_id
  ) THEN
    -- Insert the assignment with proper typing
    INSERT INTO public.user_projects (
      user_id,
      project_id,
      created_at
    ) VALUES (
      p_user_id,
      p_project_id,
      NOW()
    );
  END IF;
END;
$$;


ALTER FUNCTION "public"."assign_user_to_project"("p_user_id" "uuid", "p_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_downtime"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Calculate downtime only when BOTH timestamps are provided
    IF NEW.time_failed IS NOT NULL AND NEW.time_resume IS NOT NULL THEN
        -- Calculate hours difference with fractional hours
        UPDATE e_cm_general
        SET downtime = EXTRACT(EPOCH FROM (NEW.time_resume - NEW.time_failed)) / 3600.0
        WHERE id = NEW.cm_general_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calculate_downtime"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_admin_user"("user_email" "text", "user_password" "text", "user_full_name" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_user_id UUID;
    admin_type_id UUID;
BEGIN
    -- Get admin user type ID
    SELECT id INTO admin_type_id FROM public.user_type WHERE name = 'admin' LIMIT 1;
    
    IF admin_type_id IS NULL THEN
        RETURN json_build_object('error', 'Admin user type not found');
    END IF;
    
    -- This would need to be called from your backend with service role
    -- as direct auth user creation from SQL is limited
    
    RETURN json_build_object(
        'success', true,
        'message', 'Admin user creation initiated',
        'admin_type_id', admin_type_id
    );
END;
$$;


ALTER FUNCTION "public"."create_admin_user"("user_email" "text", "user_password" "text", "user_full_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."direct_query"("query_text" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_catalog'
    AS $$
DECLARE
    result JSONB;
    is_query BOOLEAN;
    query_type TEXT;
BEGIN
    -- Check if it's a SELECT query (reads) or a DML query (writes)
    query_type := UPPER(TRIM(SUBSTRING(query_text FROM 1 FOR 6)));
    is_query := query_type = 'SELECT';
    
    IF is_query THEN
        -- For SELECT queries, return results as JSON
        EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query_text || ') t' INTO result;
        RETURN COALESCE(result, '[]'::JSONB);
    ELSE
        -- For INSERT, UPDATE, DELETE queries, execute them and return affected rows
        -- The RETURNING clause must be included in the original query for DML operations
        IF query_type IN ('INSERT', 'UPDATE', 'DELETE') AND query_text ILIKE '%RETURNING%' THEN
            EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query_text || ') t' INTO result;
            RETURN COALESCE(result, '[]'::JSONB);
        ELSE
            -- Execute the DML query without returning data
            EXECUTE query_text;
            RETURN jsonb_build_object('affected_rows', 1);
        END IF;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Return error information
    RETURN jsonb_build_object(
        'error', SQLERRM,
        'detail', SQLSTATE
    );
END;
$$;


ALTER FUNCTION "public"."direct_query"("query_text" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."direct_query"("query_text" "text") IS 'Executes direct SQL queries for emergency schema access. Security definer function with limited permissions.';



CREATE OR REPLACE FUNCTION "public"."func_five"("p_new_work_order_id" integer, "p_pm_work_order_id" integer, "p_pm_schedule_id" integer, "p_wo_pm_schedule_id" integer, "p_next_due_date" timestamp without time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- 1. Update due_date in e_pm_schedule
    UPDATE e_pm_schedule
    SET due_date = p_next_due_date
    WHERE id = p_pm_schedule_id;

    -- 2. Update wo_id in e_wo_pm_schedule
    UPDATE e_wo_pm_schedule
    SET wo_id = p_new_work_order_id
    WHERE id = p_wo_pm_schedule_id;
END;
$$;


ALTER FUNCTION "public"."func_five"("p_new_work_order_id" integer, "p_pm_work_order_id" integer, "p_pm_schedule_id" integer, "p_wo_pm_schedule_id" integer, "p_next_due_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_four"("p_frequency_id" integer, "p_due_date" timestamp without time zone) RETURNS timestamp without time zone
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_new_due_date TIMESTAMP;
BEGIN
    CASE p_frequency_id
        WHEN 1 THEN
            v_new_due_date := p_due_date + INTERVAL '7 days';
        WHEN 2 THEN
            v_new_due_date := p_due_date + INTERVAL '1 month';
        WHEN 3 THEN
            v_new_due_date := p_due_date + INTERVAL '2 months';
        WHEN 4 THEN
            v_new_due_date := p_due_date + INTERVAL '3 months';
        WHEN 5 THEN
            v_new_due_date := p_due_date + INTERVAL '1 year';
        ELSE
            v_new_due_date := p_due_date; -- fallback
    END CASE;

    RETURN v_new_due_date;
END;
$$;


ALTER FUNCTION "public"."func_four"("p_frequency_id" integer, "p_due_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_many_master_wo"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_id INTEGER := NEW.id;
    v_pm_schedule_id INTEGER := NEW.pm_schedule_id;
    v_created_by UUID := NEW.created_by;
    v_start_date TIMESTAMP := NEW.start_date;
    v_end_date TIMESTAMP := NEW.end_date;
    v_due_date TIMESTAMP := NEW.due_date;
    v_frequency_id INTEGER := NEW.frequency_id;

    v_generate_id INTEGER;
    v_new_due_date TIMESTAMP := v_due_date;
BEGIN
    -- Create the generation record once
    SELECT func_many_one(
        v_created_by,
        v_start_date,
        v_end_date,
        v_pm_schedule_id
    ) INTO v_generate_id;

    -- Loop through due dates
    WHILE v_new_due_date >= v_start_date AND v_new_due_date <= v_end_date LOOP
        -- Insert schedule entry using current v_new_due_date
        PERFORM func_many_two(
            v_pm_schedule_id,
            v_generate_id,
            v_created_by,
            v_new_due_date
        );

        -- Calculate next due date
        SELECT func_many_three(
            v_frequency_id,
            v_new_due_date
        ) INTO v_new_due_date;
    END LOOP;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."func_many_master_wo"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_many_one"("p_created_by" "uuid", "p_start_date" timestamp without time zone, "p_end_date" timestamp without time zone, "p_pm_schedule_id" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_generate_id INTEGER;
BEGIN
    INSERT INTO e_pm_wo_generate (
        created_by,
        start_date,
        end_date,
        pm_schedule_id
    )
    VALUES (
        p_created_by,
        p_start_date,
        p_end_date,
        p_pm_schedule_id
    )
    RETURNING id INTO v_generate_id;

    RETURN v_generate_id;
END;
$$;


ALTER FUNCTION "public"."func_many_one"("p_created_by" "uuid", "p_start_date" timestamp without time zone, "p_end_date" timestamp without time zone, "p_pm_schedule_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_many_three"("p_frequency_id" integer, "p_due_date" timestamp without time zone) RETURNS timestamp without time zone
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_new_due_date TIMESTAMP;
BEGIN
    CASE p_frequency_id
        WHEN 1 THEN
            v_new_due_date := p_due_date + INTERVAL '7 days';
        WHEN 2 THEN
            v_new_due_date := p_due_date + INTERVAL '1 month';
        WHEN 3 THEN
            v_new_due_date := p_due_date + INTERVAL '2 months';
        WHEN 4 THEN
            v_new_due_date := p_due_date + INTERVAL '3 months';
        WHEN 5 THEN
            v_new_due_date := p_due_date + INTERVAL '1 year';
        ELSE
            v_new_due_date := p_due_date; -- fallback if frequency is invalid
    END CASE;

    RETURN v_new_due_date;
END;
$$;


ALTER FUNCTION "public"."func_many_three"("p_frequency_id" integer, "p_due_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_many_two"("p_pm_schedule_id" integer, "p_generate_id" integer, "p_created_by" "uuid", "p_due_date" timestamp without time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO e_wo_pm_schedule (
        pm_schedule_id,
        pm_wo_generate,
        created_by,
        due_date
    )
    VALUES (
        p_pm_schedule_id,
        p_generate_id,
        p_created_by,
        p_due_date
    );
END;
$$;


ALTER FUNCTION "public"."func_many_two"("p_pm_schedule_id" integer, "p_generate_id" integer, "p_created_by" "uuid", "p_due_date" timestamp without time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_master_wo"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    v_pm_schedule_id INTEGER := NEW.pm_schedule_id;
    v_id INTEGER := NEW.id;
    v_pm_wo_generate INTEGER := NEW.pm_wo_generate;
    v_created_by UUID := NEW.created_by;
    v_due_date TIMESTAMP := NEW.due_date;

    v_wo_record e_pm_work_order%ROWTYPE;
    v_new_work_order_id INTEGER;
    v_next_due_date TIMESTAMP;
BEGIN
    -- 1. Call func_one to insert into e_pm_work_order and get full row
    SELECT * INTO v_wo_record FROM func_one(v_pm_schedule_id, v_created_by);

    -- 2. Call func_two to copy related records
    PERFORM func_two(v_wo_record.id, v_pm_schedule_id);

    -- 3. Call func_three to insert into e_work_order and get the new id
    SELECT func_three(
        v_created_by,
        v_wo_record.task_id,
        v_wo_record.asset_id,
        v_wo_record.pm_description,
        v_due_date,
        v_wo_record.id,
        v_wo_record.facility_id
    ) INTO v_new_work_order_id;

    -- 4. Call func_four to get the next due date
    SELECT func_four(
        v_wo_record.frequency_id,
        v_wo_record.due_date
    ) INTO v_next_due_date;

    -- 5. Call func_five to update schedule and wo_id
    PERFORM func_five(
        v_new_work_order_id,
        v_wo_record.id,
        v_pm_schedule_id,
        v_id,
        v_next_due_date
    );

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."func_master_wo"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."e_pm_work_order" (
    "id" integer NOT NULL,
    "due_date" timestamp without time zone,
    "maintenance_id" integer,
    "is_active" boolean DEFAULT true,
    "priority_id" integer,
    "work_center_id" integer,
    "discipline_id" integer,
    "task_id" integer,
    "frequency_id" integer,
    "asset_id" integer,
    "system_id" integer,
    "package_id" integer,
    "pm_group_id" integer,
    "asset_sce_code_id" integer,
    "pm_description" "text",
    "pm_schedule_id" integer,
    "facility_id" integer,
    "completed_by" "uuid",
    "closed_by" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_work_order" OWNER TO "postgres";


COMMENT ON TABLE "public"."e_pm_work_order" IS 'PLEASE RECHECK THIS';



CREATE OR REPLACE FUNCTION "public"."func_one"("p_schedule_id" integer, "p_created_by" "uuid") RETURNS SETOF "public"."e_pm_work_order"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    rec e_pm_schedule%ROWTYPE;
    new_work_order_id INTEGER;
BEGIN
    -- Step 1: Fetch from e_pm_schedule
    SELECT * INTO rec
    FROM e_pm_schedule
    WHERE id = p_schedule_id;

    -- Step 2: Insert into e_pm_work_order
    INSERT INTO e_pm_work_order (
        due_date,
        maintenance_id,
        priority_id,
        work_center_id,
        discipline_id,
        task_id,
        frequency_id,
        asset_id,
        system_id,
        package_id,
        pm_group_id,
        asset_sce_code_id,
        pm_description,
        facility_id,
        pm_schedule_id,
        created_by
    )
    VALUES (
        rec.due_date,
        rec.maintenance_id,
        rec.priority_id,
        rec.work_center_id,
        rec.discipline_id,
        rec.task_id,
        rec.frequency_id,
        rec.asset_id,
        rec.system_id,
        rec.package_id,
        rec.pm_group_id,
        rec.pm_sce_group_id,
        rec.pm_description,
        rec.facility_id,
        p_schedule_id,
        p_created_by
    )
    RETURNING id INTO new_work_order_id;

    -- Step 3: Return the full row
    RETURN QUERY
    SELECT * FROM e_pm_work_order WHERE id = new_work_order_id;
END;
$$;


ALTER FUNCTION "public"."func_one"("p_schedule_id" integer, "p_created_by" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_three"("p_created_by" "uuid", "p_task_id" integer, "p_asset_id" integer, "p_description" "text", "p_due_date" timestamp without time zone, "p_pm_work_order_id" integer, "p_facility_id" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_new_work_order_id INTEGER;
BEGIN
    INSERT INTO e_work_order (
        created_by,
        task_id,
        asset_id,
        description,
        due_date,
        pm_work_order_id,
        work_order_type,
        work_order_status_id,
        facility_id
    )
    VALUES (
        p_created_by,
        p_task_id,
        p_asset_id,
        p_description,
        p_due_date,
        p_pm_work_order_id,
        2,
        1,
        p_facility_id
    )
    RETURNING id INTO v_new_work_order_id;

    RETURN v_new_work_order_id;
END;
$$;


ALTER FUNCTION "public"."func_three"("p_created_by" "uuid", "p_task_id" integer, "p_asset_id" integer, "p_description" "text", "p_due_date" timestamp without time zone, "p_pm_work_order_id" integer, "p_facility_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_two"("v_pm_wo_id" integer, "v_pm_schedule_id" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- 1. Copy task details
    INSERT INTO e_pm_task_detail (
        pm_wo_id,
        sequence,
        task_list
    )
    SELECT
        v_pm_wo_id,
        sequence,
        task_list
    FROM e_pm_schedule_task_detail
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 2. Copy min acceptance criteria
    INSERT INTO e_pm_min_acceptance_criteria (
        pm_wo_id,
        criteria,
        field_name
    )
    SELECT
        v_pm_wo_id,
        criteria,
        field_name
    FROM e_pm_schedule_min_acceptance_criteria
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 3. Copy checksheet
    INSERT INTO e_pm_checksheet (
        pm_wo_id,
        description,
        file_path,
        is_from_pm_schedule
    )
    SELECT
        v_pm_wo_id,
        description,
        file_path,
        is_from_pm_schedule
    FROM e_pm_schedule_checksheet
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 4. Copy additional info
    INSERT INTO e_pm_additional_info (
        pm_wo_id,
        description
    )
    SELECT
        v_pm_wo_id,
        description
    FROM e_pm_schedule_additional_info
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 5. Copy maintainable group
    INSERT INTO e_pm_maintainable_group (
        pm_wo_id,
        asset_id,
        group_id
    )
    SELECT
        v_pm_wo_id,
        asset_id,
        group_id
    FROM e_pm_schedule_maintainable_group
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 6. Copy plan labour
    INSERT INTO e_pm_plan_labour (
        pm_wo_id,
        employee_id,
        duration
    )
    SELECT
        v_pm_wo_id,
        employee_id,
        duration
    FROM e_pm_schedule_plan_labour
    WHERE pm_schedule_id = v_pm_schedule_id;

    -- 7. Copy plan material
    INSERT INTO e_pm_plan_material (
        pm_wo_id,
        item_id,
        quantity
    )
    SELECT
        v_pm_wo_id,
        item_id,
        quantity
    FROM e_pm_schedule_plan_material
    WHERE pm_schedule_id = v_pm_schedule_id;
END;
$$;


ALTER FUNCTION "public"."func_two"("v_pm_wo_id" integer, "v_pm_schedule_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."func_update_wr_wo_id"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_wr_id INTEGER;  -- will hold e_cm_general.work_request_id
BEGIN
    -- Run only if cm_work_order_id is supplied
    IF NEW.cm_work_order_id IS NULL THEN
        RETURN NEW;  -- nothing to do
    END IF;

    /* Step 1: Get work_request_id from e_cm_general */
    SELECT work_request_id
    INTO   v_wr_id
    FROM   e_cm_general
    WHERE  id = NEW.cm_work_order_id;

    -- If no matching e_cm_general row, exit gracefully
    IF v_wr_id IS NULL THEN
        RETURN NEW;
    END IF;

    /* Step 2: Update e_new_work_request.wo_id */
    UPDATE e_new_work_request
    SET    wo_id = NEW.id
    WHERE  id = v_wr_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."func_update_wr_wo_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_pm_no"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  loc_code TEXT;
  year_two_digits TEXT;
  running_number INT;
BEGIN
  -- Get location_code from e_facility
  SELECT location_code INTO loc_code
  FROM e_facility
  WHERE id = NEW.facility_id;

  -- Extract year in 2-digit format
  year_two_digits := TO_CHAR(NEW.created_at, 'YY');

  -- Get latest running number for this year
  SELECT COALESCE(MAX(SPLIT_PART(pm_no, '/', 2)::INT), 0) + 1
  INTO running_number
  FROM e_pm_schedule
  WHERE TO_CHAR(created_at, 'YY') = year_two_digits;

  -- Generate the formatted pm_no
  NEW.pm_no := FORMAT('PM-%s-%s/%s',
                      loc_code,
                      year_two_digits,
                      LPAD(running_number::TEXT, 6, '0'));

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_pm_no"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_work_order_no"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  loc_code TEXT;
  wo_type TEXT;
  seq_year INT := EXTRACT(YEAR FROM NEW.due_date);
  next_number INT;
  formatted_number TEXT;
BEGIN
  -- Determine type and location_code
  IF NEW.pm_work_order_id IS NOT NULL THEN
    SELECT f.location_code INTO loc_code
    FROM e_pm_work_order p
    JOIN e_facility f ON p.facility_id = f.id
    WHERE p.id = NEW.pm_work_order_id;

    wo_type := 'PM';

  ELSIF NEW.cm_work_order_id IS NOT NULL THEN
    SELECT f.location_code INTO loc_code
    FROM e_cm_general c
    JOIN e_facility f ON c.facility_id = f.id
    WHERE c.id = NEW.cm_work_order_id;

    wo_type := 'CM';

  ELSE
    RAISE EXCEPTION 'Either pm_work_order_id or cm_work_order_id must be provided.';
  END IF;

  -- Sequence tracking by year only
  INSERT INTO work_order_sequence (year, current_number)
  VALUES (seq_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET current_number = work_order_sequence.current_number + 1
  RETURNING current_number INTO next_number;

  formatted_number := LPAD(next_number::TEXT, 6, '0');

  NEW.work_order_no := FORMAT('WO-%s-%s-%s/%s', loc_code, wo_type, TO_CHAR(NEW.due_date, 'YY'), formatted_number);

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."generate_work_order_no"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_work_request_no"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  loc_code TEXT;
  req_year INT;
  new_number INT;
BEGIN
  -- Get location code from e_facility
  SELECT location_code INTO loc_code
  FROM e_facility
  WHERE id = NEW.facility_id;

  -- Extract year from date
  req_year := EXTRACT(YEAR FROM NEW.work_request_date)::INT;

  -- Use global counter per year (not per facility)
  LOOP
    UPDATE work_request_sequence
    SET current_number = current_number + 1
    WHERE year = req_year
    RETURNING current_number INTO new_number;

    EXIT WHEN FOUND;

    BEGIN
      INSERT INTO work_request_sequence (year, current_number)
      VALUES (req_year, 1)
      RETURNING current_number INTO new_number;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      -- Retry on race condition
    END;
  END LOOP;

  -- Format: WR-<LOC>-CM-<YY>/<XXXXXX>
  NEW.work_request_no := 
    'WR-' || loc_code || '-CM-' || RIGHT(req_year::TEXT, 2) || '/' || TO_CHAR(new_number, 'FM000000');

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_work_request_no"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_project_assigned_users"("p_project_id" bigint) RETURNS TABLE("id" "uuid", "email" character varying, "full_name" character varying, "avatar_url" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url
  FROM 
    public.profiles p
  JOIN
    public.user_projects up ON up.user_id = p.id
  WHERE
    up.project_id = p_project_id
  ORDER BY
    p.full_name;
END;
$$;


ALTER FUNCTION "public"."get_project_assigned_users"("p_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_table_columns"("param_table_name" "text") RETURNS TABLE("column_name" "text", "data_type" "text", "is_nullable" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT, 
    c.data_type::TEXT,
    CASE WHEN c.is_nullable = 'YES' THEN TRUE ELSE FALSE END as is_nullable
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public'
    AND c.table_name = param_table_name
  ORDER BY 
    c.ordinal_position;
END;
$$;


ALTER FUNCTION "public"."get_table_columns"("param_table_name" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_table_columns"("param_table_name" "text") IS 'Returns column metadata for a given table name';



CREATE OR REPLACE FUNCTION "public"."get_user_assigned_projects"("p_user_id" "uuid") RETURNS TABLE("id" bigint, "project_name" "text", "project_code" "text", "short_name" "text", "project_purpose" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.project_name,
    p.project_code,
    p.short_name,
    p.project_purpose
  FROM 
    public.e_project p
  JOIN
    public.user_projects up ON up.project_id = p.id
  WHERE
    up.user_id = p_user_id
  ORDER BY
    p.project_name;
END;
$$;


ALTER FUNCTION "public"."get_user_assigned_projects"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_users_for_project_assignment"() RETURNS TABLE("id" "uuid", "email" character varying, "full_name" character varying, "avatar_url" "text", "user_type_id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.user_type_id
  FROM 
    public.profiles p
  ORDER BY
    p.full_name;
END;
$$;


ALTER FUNCTION "public"."get_users_for_project_assignment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_users_with_details"() RETURNS TABLE("id" "uuid", "email" character varying, "full_name" character varying, "user_type_id" "uuid", "user_type" "jsonb", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "avatar_url" "text", "is_active" boolean, "is_deleted" boolean, "project_assignments" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.user_type_id,
    jsonb_build_object(
      'id', ut.id,
      'name', ut.name
    ) AS user_type,
    p.created_at,
    p.updated_at,
    p.avatar_url,
    p.is_active,
    p.is_deleted,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', up.id,
          'project_id', up.project_id,
          'project_name', ep.project_name,
          'project_code', ep.project_code,
          'created_at', up.created_at
        )
      )
      FROM public.user_projects up
      LEFT JOIN public.e_project ep ON up.project_id = ep.id
      WHERE up.user_id = p.id
    ) AS project_assignments
  FROM 
    public.profiles p
  LEFT JOIN 
    public.user_type ut ON p.user_type_id = ut.id
  WHERE
    p.is_deleted = false
  ORDER BY
    p.created_at DESC;
END;$$;


ALTER FUNCTION "public"."get_users_with_details"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_users_with_types"() RETURNS TABLE("id" "uuid", "email" character varying, "full_name" character varying, "user_type_id" "uuid", "user_type" "jsonb", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "avatar_url" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.user_type_id,
    jsonb_build_object(
      'id', ut.id,
      'name', ut.name,
      'description', ut.description
    ) AS user_type,
    p.created_at,
    p.updated_at,
    p.avatar_url
  FROM 
    public.profiles p
  LEFT JOIN 
    public.user_type ut ON p.user_type_id = ut.id
  ORDER BY
    p.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_users_with_types"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_adjustment_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_adjustment_type_id" smallint, "p_adjustment_category_id" smallint, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_new_balance numeric;
  v_new_unit_price numeric;
begin
  -- Insert adjustment record
  insert into e_inventory_adjustment (
    inventory_id, quantity, adjustment_type_id, adjustment_category_id, created_by, remark, created_at, adjustment_date
  ) values (
    p_inventory_id, p_quantity, p_adjustment_type_id, p_adjustment_category_id, p_created_by, p_remark, p_created_at, p_created_at::date
  );

  if p_adjustment_type_id = 2 then -- Quantity
    if p_adjustment_category_id = 1 then -- Increase
      update e_inventory
      set current_balance = coalesce(current_balance, 0) + p_quantity
      where id = p_inventory_id;
    elsif p_adjustment_category_id = 2 then -- Decrease
      update e_inventory
      set current_balance = coalesce(current_balance, 0) - p_quantity
      where id = p_inventory_id;
    end if;
  elsif p_adjustment_type_id = 1 then -- Price
    if p_adjustment_category_id = 1 then -- Increase
      update e_inventory
      set unit_price = coalesce(unit_price, 0) + p_quantity
      where id = p_inventory_id;
    elsif p_adjustment_category_id = 2 then -- Decrease
      update e_inventory
      set unit_price = coalesce(unit_price, 0) - p_quantity
      where id = p_inventory_id;
    end if;
  end if;

  -- Always update total_price after adjustment
  update e_inventory
  set total_price = coalesce(current_balance, 0) * coalesce(unit_price, 0)
  where id = p_inventory_id;
end;
$$;


ALTER FUNCTION "public"."handle_adjustment_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_adjustment_type_id" smallint, "p_adjustment_category_id" smallint, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_issue_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- Insert issue record
  insert into e_inventory_issue (
    inventory_id, quantity, work_order_no, created_by, remark, created_at, issue_date
  ) values (
    p_inventory_id, p_quantity, p_work_order_no, p_created_by, p_remark, p_created_at::date, p_created_at::date
  );

  -- Update inventory balance
  update e_inventory
set current_balance = coalesce(current_balance, 0) - p_quantity,
    total_price = (coalesce(current_balance, 0) - p_quantity) * unit_price
where id = p_inventory_id;
end;
$$;


ALTER FUNCTION "public"."handle_issue_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, user_type_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        (SELECT id FROM public.user_type WHERE name = 'client' LIMIT 1) -- Default to client role
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_receive_inventory"("p_inventory_id" bigint, "p_received_quantity" integer, "p_unit_price" numeric, "p_po_receive_no" "text", "p_created_by" "text", "p_created_at" timestamp without time zone, "p_remark" "text") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  new_balance INT;
  new_total_price NUMERIC;
BEGIN
  UPDATE e_inventory
  SET 
    current_balance = current_balance + p_received_quantity,
    unit_price = p_unit_price,  -- Use parameter with prefix
    total_price = total_price + (p_received_quantity * p_unit_price)
  WHERE id = p_inventory_id
  RETURNING current_balance, total_price INTO new_balance, new_total_price;

  INSERT INTO e_inventory_receive(
    inventory_id, received_quantity, unit_price, 
    total_price, po_receive_no, created_by, created_at, remark
  ) VALUES (
    p_inventory_id, p_received_quantity, p_unit_price,
    p_received_quantity * p_unit_price, p_po_receive_no, p_created_by::uuid, p_created_at, p_remark
  );

  RETURN json_build_object(
    'new_balance', new_balance,
    'new_total_price', new_total_price
  );
END;
$$;


ALTER FUNCTION "public"."handle_receive_inventory"("p_inventory_id" bigint, "p_received_quantity" integer, "p_unit_price" numeric, "p_po_receive_no" "text", "p_created_by" "text", "p_created_at" timestamp without time zone, "p_remark" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_return_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- Insert return record
  insert into e_inventory_return (
    inventory_id, quantity, work_order_no, created_by, remark, created_at, return_date
  ) values (
    p_inventory_id, p_quantity, p_work_order_no, p_created_by, p_remark, p_created_at, p_created_at::date
  );

  -- Update inventory balance
  update e_inventory
  set current_balance = coalesce(current_balance, 0) + p_quantity
  where id = p_inventory_id;
end;
$$;


ALTER FUNCTION "public"."handle_return_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_transfer_inventory"("p_source_inventory_id" integer, "p_destination_store_id" integer, "p_quantity" numeric, "p_transfer_reason" "text", "p_employee_id" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
declare
  v_item_master_id integer;
  v_unit_price numeric;
  v_new_inventory_id integer;
begin
  -- Get item_master_id and unit_price from source inventory
  select item_master_id, unit_price
    into v_item_master_id, v_unit_price
    from e_inventory
    where id = p_source_inventory_id;

  -- Insert transfer record (out)
  insert into e_inventory_transfer (
    inventory_id, store_id, quantity, transfer_reason, employee_id, created_by, remark, created_at, transfer_date
  ) values (
    p_source_inventory_id, p_destination_store_id, p_quantity, p_transfer_reason, p_employee_id, p_created_by, p_remark, p_created_at, p_created_at::date
  );

  -- Subtract from source inventory
  update e_inventory
  set current_balance = coalesce(current_balance, 0) - p_quantity
  where id = p_source_inventory_id;

  -- Find or create destination inventory record for this item/store
  select id into v_new_inventory_id
    from e_inventory
    where item_master_id = v_item_master_id and store_id = p_destination_store_id
    limit 1;

  if v_new_inventory_id is null then
    insert into e_inventory (
      item_master_id, store_id, current_balance, unit_price, created_at
    ) values (
      v_item_master_id, p_destination_store_id, p_quantity, v_unit_price, p_created_at
    ) returning id into v_new_inventory_id;
  else
    update e_inventory
    set current_balance = coalesce(current_balance, 0) + p_quantity
    where id = v_new_inventory_id;
  end if;
end;
$$;


ALTER FUNCTION "public"."handle_transfer_inventory"("p_source_inventory_id" integer, "p_destination_store_id" integer, "p_quantity" numeric, "p_transfer_reason" "text", "p_employee_id" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT ut.name INTO user_role
  FROM public.profiles p
  JOIN public.user_type ut ON p.user_type_id = ut.id
  WHERE p.id = auth.uid();
  
  RETURN user_role = 'Admin';
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."remove_user_from_project"("p_user_id" "uuid", "p_project_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Delete the assignment if it exists
  DELETE FROM public.user_projects
  WHERE user_id = p_user_id AND project_id = p_project_id;
END;
$$;


ALTER FUNCTION "public"."remove_user_from_project"("p_user_id" "uuid", "p_project_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_rbi_no"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  assetno TEXT;
  entry_count INT;
  year_suffix TEXT;
BEGIN
  -- Try to get asset_no from e_asset through e_asset_detail
  SELECT e.asset_no INTO assetno
  FROM e_asset_detail d
  JOIN e_asset e ON e.id = d.asset_id
  WHERE d.id = NEW.asset_detail_id;

  -- If asset_no not found, default to string 'ASSET_NO'
  IF assetno IS NULL THEN
    assetno := 'ASSET_NO';
  END IF;

  -- Extract 2-digit year from created_at
  year_suffix := TO_CHAR(NEW.created_at, 'YY');

  -- Count how many existing records exist for this asset_detail_id
  SELECT COUNT(*) INTO entry_count
  FROM i_ims_rbi_general
  WHERE asset_detail_id = NEW.asset_detail_id;

  -- Format rbi_no
  NEW.rbi_no := year_suffix || '_RBI_' || assetno || '_' || (entry_count + 1);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_rbi_no"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_copy_cm_data"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$DECLARE 
    v_cm_general_id INTEGER := NEW.id;
    v_work_request_id INTEGER := NEW.work_request_id;
BEGIN
    -- 1. Copy reports
    INSERT INTO e_cm_report (
        cm_general_id,
        weather_condition, visibility, wind_speed_direction, sea_well,
        alarm_trigger, shutdown_type_id, time_failed, time_resume,
        shift, redundant, other_detail, service_asset,
        pressure, temp, operating_history, time_in_servicehr,
        material_class_id, design_code,
        created_by, created_at, updated_at
    )
    SELECT 
        v_cm_general_id,
        weather_condition, visibility, wind_speed_direction, sea_well,
        alarm_trigger, shutdown_type_id, time_failed, time_resume,
        shift, redundant, other_detail, service_asset,
        pressure, temp, operating_history, time_in_servicehr,
        material_class_id, design_code,
        created_by, created_at, updated_at
    FROM e_work_request_report
    WHERE work_request_id = v_work_request_id;

    -- 2. Copy task details
    INSERT INTO e_cm_task_detail (
        cm_general_id,
        task_sequence, task_list,
        created_by, created_at, updated_by, updated_at
    )
    SELECT 
        v_cm_general_id,
        task_sequence, task_list,
        created_by, created_at, updated_by, updated_at
    FROM e_new_work_task_detail
    WHERE new_work_request_id = v_work_request_id;

    -- 3. Copy attachments with is_from_new_work_attachment = TRUE
    INSERT INTO e_cm_attachment (
        cm_general_id,
        file_path, description,
        created_by, created_at, updated_by, updated_at,
        is_from_new_work_attachment
    )
    SELECT 
        v_cm_general_id,
        file_path, description,
        created_by, created_at, updated_by, updated_at,
        is_from_new_work_attachment
    FROM e_new_work_attachment
    WHERE work_request_id = v_work_request_id;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_copy_cm_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_client" (
    "id" integer NOT NULL,
    "code" character varying(100) NOT NULL,
    "type" character varying(100),
    "name" character varying(255),
    "onboard_date" timestamp without time zone,
    "office_no" character varying(30),
    "email" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_client" OWNER TO "postgres";


ALTER TABLE "public"."e_client" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."client_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_sce" (
    "id" integer NOT NULL,
    "cm_group_name" character varying(255),
    "cm_sce_code" character varying(255) NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_sce" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_sce" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cm_sce_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_circuit" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_circuit" OWNER TO "postgres";


ALTER TABLE "public"."e_circuit" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e.Circuit_ID_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_coating_quality" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."e_coating_quality" OWNER TO "postgres";


ALTER TABLE "public"."e_coating_quality" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Coating_Quality_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_design_fabrication" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_design_fabrication" OWNER TO "postgres";


ALTER TABLE "public"."e_design_fabrication" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Design_fabrication_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_detection_system" (
    "id" integer NOT NULL,
    "remark" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "name" character varying(40)
);


ALTER TABLE "public"."e_detection_system" OWNER TO "postgres";


ALTER TABLE "public"."e_detection_system" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e.Detection_System_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_ext_env" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_ext_env" OWNER TO "postgres";


ALTER TABLE "public"."e_ext_env" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.EXT_ENV_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_geometry" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_geometry" OWNER TO "postgres";


ALTER TABLE "public"."e_geometry" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Geometry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_mitigation_system" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_mitigation_system" OWNER TO "postgres";


ALTER TABLE "public"."e_mitigation_system" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Mitigation_System_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_online_monitor" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_online_monitor" OWNER TO "postgres";


ALTER TABLE "public"."e_online_monitor" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Online_Monitor_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pipe_schedule" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pipe_schedule" OWNER TO "postgres";


ALTER TABLE "public"."e_pipe_schedule" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.Pipe_Schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_insulation_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."e_insulation_type" OWNER TO "postgres";


ALTER TABLE "public"."e_insulation_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.insulation_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_interface" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."e_interface" OWNER TO "postgres";


ALTER TABLE "public"."e_interface" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e.interface_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_adjustment_category" (
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "id" smallint NOT NULL
);


ALTER TABLE "public"."e_adjustment_category" OWNER TO "postgres";


ALTER TABLE "public"."e_adjustment_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_adjustment_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_adjustment_type" (
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "id" smallint NOT NULL
);


ALTER TABLE "public"."e_adjustment_type" OWNER TO "postgres";


ALTER TABLE "public"."e_adjustment_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_adjustment_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset" (
    "id" integer NOT NULL,
    "facility_id" integer,
    "system_id" integer,
    "package_id" integer,
    "asset_no" character varying(255) NOT NULL,
    "asset_name" character varying(255),
    "asset_tag_id" integer,
    "status_id" integer,
    "asset_group_id" integer,
    "commission_date" timestamp without time zone,
    "asset_detail_id" integer,
    "asset_sce_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "parent_asset_id" integer,
    "is_active" boolean
);


ALTER TABLE "public"."e_asset" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_asset_area" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_area" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_area" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_area_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_attachment" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "file_path" character varying,
    "asset_id" integer,
    "type" "text",
    "notes" "text",
    "file_name" character varying,
    "file_type" character varying,
    "file_size" integer
);


ALTER TABLE "public"."e_asset_attachment" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_category" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_category_group_id" smallint
);


ALTER TABLE "public"."e_asset_category" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_asset_category_group" (
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "id" smallint NOT NULL
);


ALTER TABLE "public"."e_asset_category_group" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_category_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_category_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_asset_category" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_class" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_class" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_class" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_class_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_detail" (
    "id" integer NOT NULL,
    "category_id" integer,
    "type_id" integer,
    "manufacturer_id" integer,
    "maker_no" character varying(255),
    "model" character varying(255),
    "hs_code" character varying(255),
    "serial_number" character varying(255),
    "area_id" integer,
    "asset_class_id" integer,
    "specification" character varying(255),
    "is_integrity" boolean DEFAULT false,
    "is_reliability" boolean DEFAULT false,
    "is_active" boolean,
    "iot_sensor_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "bom_id" integer,
    "drawing_no" "text",
    "ex_class" "text",
    "ex_certificate" "text",
    "asset_image_path" "text",
    "is_sce" boolean DEFAULT false,
    "is_criticality" boolean DEFAULT false,
    "criticality_id" integer,
    "sce_id" integer,
    "asset_id" integer
);


ALTER TABLE "public"."e_asset_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_group" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "is_active" boolean,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_group" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_asset" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_image" (
    "id" integer NOT NULL,
    "asset_detail_id" integer,
    "image_file_path" character varying(300),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_image" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_image" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_image_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_installation" (
    "id" integer NOT NULL,
    "actual_installation_date" timestamp without time zone,
    "actual_startup_date" timestamp without time zone,
    "description" character varying(255),
    "drawing_no" character varying(255),
    "asset_id" integer,
    "ex_certificate" character varying(255),
    "ex_class" character varying(255),
    "intermittent_service" character varying(255),
    "isolation_service_class_id" integer,
    "isolation_system_desc" character varying(255),
    "detection_system_desc" character varying(255),
    "detection_system_class_id" integer,
    "orientation" character varying(255),
    "overall_height" double precision,
    "overall_length" double precision,
    "overall_width" double precision,
    "warranty_date" timestamp without time zone,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_installation" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_installation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_installation_int_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_sce" (
    "id" integer NOT NULL,
    "group_name" character varying(255),
    "sce_code" character varying(255) NOT NULL,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_sce" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_asset_status" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "is_active" boolean NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_status" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_tag" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "is_active" boolean NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_tag" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_tag" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_tag_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_asset_type" (
    "id" integer NOT NULL,
    "asset_category_id" integer,
    "name" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_type_group_id" smallint
);


ALTER TABLE "public"."e_asset_type" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_asset_type_group" (
    "id" smallint NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_asset_type_group" OWNER TO "postgres";


ALTER TABLE "public"."e_asset_type_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_type_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_asset_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_asset_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_bom_assembly" (
    "id" integer NOT NULL,
    "bom_code" character varying(255) NOT NULL,
    "bom_name" character varying(255),
    "item_master_id" integer,
    "description" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_bom_assembly" OWNER TO "postgres";


ALTER TABLE "public"."e_bom_assembly" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_bom_assembly_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_actual_labour" (
    "id" integer NOT NULL,
    "employee_id" integer,
    "duration" double precision,
    "cm_general_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_actual_labour" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_actual_labour" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_actual_labour_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_actual_material" (
    "id" integer NOT NULL,
    "cm_general_id" integer,
    "item_id" integer,
    "quantity" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_actual_material" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_actual_material" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_actual_material_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_attachment" (
    "id" integer NOT NULL,
    "file_path" character varying(255),
    "cm_general_id" integer,
    "description" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "is_from_new_work_attachment" boolean DEFAULT false
);


ALTER TABLE "public"."e_cm_attachment" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_defer" (
    "id" integer NOT NULL,
    "cm_general_id" integer,
    "previous_due_date" timestamp without time zone,
    "requested_by" "uuid",
    "remarks" character varying(255),
    "new_due_date" timestamp without time zone,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_defer" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_defer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_defer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_finding" (
    "id" integer NOT NULL,
    "wo_finding_failure" "text",
    "action_taken" "text",
    "corrective_action" "text",
    "cm_general_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_finding" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_finding" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_finding_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_general" (
    "id" integer NOT NULL,
    "priority_id" integer,
    "work_center_id" integer,
    "facility_id" integer,
    "system_id" integer,
    "package_id" integer,
    "asset_id" integer,
    "completed_by" "uuid",
    "closed_by" "uuid",
    "date_finding" timestamp without time zone,
    "target_start_date" timestamp without time zone,
    "target_end_date" timestamp without time zone,
    "asset_available_time" timestamp without time zone,
    "requested_by" "uuid",
    "approved_by" "uuid",
    "cm_sce_code" integer,
    "due_date" timestamp without time zone,
    "downtime" double precision,
    "work_request_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_general" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_general" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_general_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_report" (
    "id" integer NOT NULL,
    "weather_condition" character varying(100),
    "visibility" character varying(100),
    "wind_speed_direction" character varying(100),
    "sea_well" character varying(100),
    "alarm_trigger" character varying(100),
    "shutdown_type_id" integer,
    "time_failed" timestamp without time zone,
    "time_resume" timestamp without time zone,
    "shift" character varying(100),
    "redundant" character varying(100),
    "other_detail" character varying(255),
    "service_asset" character varying(50),
    "pressure" double precision,
    "temp" double precision,
    "operating_history" double precision,
    "time_in_servicehr" double precision,
    "material_class_id" integer,
    "design_code" character varying(50),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "cm_general_id" integer
);


ALTER TABLE "public"."e_cm_report" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_report" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_status" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_status" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_cm_task_detail" (
    "id" integer NOT NULL,
    "task_sequence" integer,
    "task_list" character varying(255),
    "cm_general_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_cm_task_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_cm_task_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_cm_task_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_criticality" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_criticality" OWNER TO "postgres";


ALTER TABLE "public"."e_criticality" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_criticality_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_discipline" (
    "id" integer NOT NULL,
    "code" character varying(100) NOT NULL,
    "name" character varying(255),
    "description" character varying(255),
    "type" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_discipline" OWNER TO "postgres";


ALTER TABLE "public"."e_discipline" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_discipline_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_employee" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "uid_employee" character varying(255) NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "work_center_code" integer
);


ALTER TABLE "public"."e_employee" OWNER TO "postgres";


ALTER TABLE "public"."e_employee" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_employee_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_facility" (
    "id" bigint NOT NULL,
    "location_code" character varying(10) NOT NULL,
    "location_name" character varying(255),
    "is_active" boolean,
    "project_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_facility" OWNER TO "postgres";


ALTER TABLE "public"."e_facility" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_facility_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_failure_priority" (
    "id" integer NOT NULL,
    "name" character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_failure_priority" OWNER TO "postgres";


ALTER TABLE "public"."e_failure_priority" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_failure_priority_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_fluid_phase" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_fluid_phase" OWNER TO "postgres";


ALTER TABLE "public"."e_fluid_phase" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_fluid_phase_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_fluid_representive" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_fluid_representive" OWNER TO "postgres";


ALTER TABLE "public"."e_fluid_representive" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_fluid_representive_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_frequency" (
    "id" integer NOT NULL,
    "frequency_type_id" integer,
    "frequency_code" character varying(100) NOT NULL,
    "name" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_frequency" OWNER TO "postgres";


ALTER TABLE "public"."e_frequency" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_frequency_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_frequency_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_frequency_type" OWNER TO "postgres";


ALTER TABLE "public"."e_frequency_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_frequency_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_general_maintenance" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_general_maintenance" OWNER TO "postgres";


ALTER TABLE "public"."e_general_maintenance" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_general_maintenance_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_ideal_gas_specific_heat_eq" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_ideal_gas_specific_heat_eq" OWNER TO "postgres";


ALTER TABLE "public"."e_ideal_gas_specific_heat_eq" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_ideal_gas_specific_heat_eq_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_cof_assessment_cof_prod" (
    "id" integer NOT NULL,
    "outagemult" real,
    "injcost" real,
    "envcost" real,
    "fracevap" real,
    "volenv" real,
    "fcenviron" real,
    "fc" real,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_ims_cof_assessment_cof_prod" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_cof_assessment_cof_prod" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_cof_assessment_cof_prod_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_cof_assessment_cof_area" (
    "id" integer NOT NULL,
    "iso_sys_id" integer,
    "det_sys_id" integer,
    "mitigation_system_id" integer,
    "ideal_gas_specific_heat_eq" integer,
    "ca_cmdflam" double precision,
    "ca_injflam" double precision,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_detail_id" integer,
    "ims_service_id" integer,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_ims_cof_assessment_cof_area" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_cof_assessment_cof_area" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_cof_asssessment_cof_area_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_design" (
    "id" integer NOT NULL,
    "internal_diameter" real,
    "welding_efficiency" real,
    "design_pressure" real,
    "corrosion_allowance" real,
    "outer_diameter" real,
    "design_temperature" real,
    "operating_pressure_mpa" real,
    "ext_env_id" integer,
    "geometry_id" integer,
    "length" real,
    "operating_temperature" real,
    "allowable_stress_mpa" real,
    "pipe_support" boolean,
    "soil_water_interface" boolean,
    "dead_legs" boolean,
    "mix_point" boolean,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_asset_type_id" smallint,
    "ims_general_id" integer
);


ALTER TABLE "public"."i_ims_design" OWNER TO "postgres";


COMMENT ON COLUMN "public"."i_ims_design"."ims_asset_type_id" IS '1=Pressure Vessel , 2=Piping';



ALTER TABLE "public"."i_ims_design" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_piping_design_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_general" (
    "id" integer NOT NULL,
    "line_no" character varying,
    "pipe_schedule_id" integer,
    "pressure_rating" real,
    "year_in_service" "date",
    "normal_wall_thickness" double precision,
    "tmin" character varying,
    "material_construction_id" integer,
    "description" character varying,
    "circuit_id" integer,
    "nominal_bore_diameter" integer,
    "insulation" boolean,
    "line_h2s" boolean,
    "internal_lining" boolean,
    "pwht" boolean,
    "cladding" boolean,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_asset_type_id" smallint,
    "inner_diameter" double precision,
    "clad_thickness" double precision,
    "pipe_class_id" integer,
    "outer_diameter" double precision
);


ALTER TABLE "public"."i_ims_general" OWNER TO "postgres";


COMMENT ON COLUMN "public"."i_ims_general"."ims_asset_type_id" IS '1=Pressure Vessel , 2 = Piping';



ALTER TABLE "public"."i_ims_general" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_piping_general_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_protection" (
    "id" integer NOT NULL,
    "coating_quality_id" integer,
    "isolation_system_id" integer,
    "online_monitor" integer,
    "minimum_thickness" double precision,
    "post_weld_heat_treatment" integer,
    "line_description" character varying,
    "replacement_line" character varying,
    "detection_system_id" integer,
    "mitigation_system_id" integer,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "design_fabrication_id" smallint,
    "insulation_type_id" smallint,
    "interface_id" integer,
    "insulation_complexity_id" integer,
    "insulation_condition" character varying(255),
    "lining_type" character varying(255),
    "lining_condition" character varying(255),
    "lining_monitoring" character varying(255),
    "ims_asset_type_id" integer
);


ALTER TABLE "public"."i_ims_protection" OWNER TO "postgres";


COMMENT ON COLUMN "public"."i_ims_protection"."ims_asset_type_id" IS '1=Pressure Vessel , 2 = Piping';



ALTER TABLE "public"."i_ims_protection" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_piping_protection_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_risk_irp" (
    "id" integer NOT NULL,
    "dhtha" real,
    "dbrit" real,
    "dthin" double precision,
    "dextd" double precision,
    "dscc" double precision,
    "dmfat" double precision,
    "pof" double precision,
    "cof_financial" double precision,
    "cof_area" double precision,
    "pof_value" double precision,
    "risk_level" double precision,
    "risk_ranking" double precision,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "rbi_risk_irp_id" integer
);


ALTER TABLE "public"."i_ims_risk_irp" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_risk_irp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_ims_risk_&_irp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_inventory" (
    "id" integer NOT NULL,
    "item_master_id" integer,
    "store_id" integer,
    "open_balance" integer,
    "open_balance_date" timestamp without time zone,
    "min_level" integer,
    "max_level" integer,
    "reorder_table" integer,
    "current_balance" integer,
    "unit_price" double precision,
    "total_price" double precision,
    "rack_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_inventory_adjustment" (
    "id" integer NOT NULL,
    "adjustment_date" timestamp without time zone,
    "quantity" integer,
    "inventory_id" integer,
    "remark" character varying(255),
    "adjustment_type_id" integer,
    "adjustment_category_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory_adjustment" OWNER TO "postgres";


ALTER TABLE "public"."e_inventory" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_inventory_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_inventory_issue" (
    "id" integer NOT NULL,
    "issue_date" timestamp with time zone,
    "quantity" integer,
    "work_order_no" integer,
    "remark" "text",
    "inventory_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory_issue" OWNER TO "postgres";


ALTER TABLE "public"."e_inventory_issue" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_inventory_issue_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_inventory_receive" (
    "id" integer NOT NULL,
    "po_receive_no" character varying(255),
    "received_quantity" integer,
    "unit_price" double precision,
    "total_price" double precision,
    "remark" character varying(255),
    "inventory_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory_receive" OWNER TO "postgres";


ALTER TABLE "public"."e_inventory_receive" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_inventory_receive_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_inventory_return" (
    "id" integer NOT NULL,
    "return_date" timestamp without time zone,
    "quantity" integer,
    "return_reason" character varying(255),
    "inventory_id" integer,
    "remark" character varying(255),
    "work_order_no" integer,
    "return_by" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory_return" OWNER TO "postgres";


ALTER TABLE "public"."e_inventory_return" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_inventory_return_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_inventory_transfer" (
    "id" integer NOT NULL,
    "inventory_id" integer,
    "transfer_date" timestamp without time zone,
    "transfer_reason" "text",
    "store_id" integer,
    "remark" "text",
    "quantity" integer,
    "employee_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_inventory_transfer" OWNER TO "postgres";


ALTER TABLE "public"."e_inventory_transfer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_inventory_tansfer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_iot_sensor" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "sensor_type_id" integer,
    "description" character varying(255),
    "manufacturer_id" integer,
    "model" character varying(255),
    "calibration_date" timestamp without time zone,
    "client_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_iot_sensor" OWNER TO "postgres";


ALTER TABLE "public"."e_iot_sensor" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_iot_sensor_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_isolation_service_class" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_isolation_service_class" OWNER TO "postgres";


ALTER TABLE "public"."e_isolation_service_class" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_isolation_service_class_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_isolation_system" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_isolation_system" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_item_category" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_item_category" OWNER TO "postgres";


ALTER TABLE "public"."e_item_category" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_item_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_item_group" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_item_group" OWNER TO "postgres";


ALTER TABLE "public"."e_item_group" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_item_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_item_master" (
    "id" integer NOT NULL,
    "item_no" character varying(255) NOT NULL,
    "item_name" character varying(255),
    "category_id" integer,
    "type_id" integer,
    "item_group" integer,
    "manufacturer" integer,
    "manufacturer_part_no" character varying(255),
    "model_no" character varying(255),
    "specification" character varying(255),
    "unit_id" integer,
    "criticality_id" integer,
    "is_active" boolean,
    "created_at" timestamp with time zone,
    "created_by" "uuid",
    "updated_at" timestamp with time zone,
    "updated_by" "uuid"
);


ALTER TABLE "public"."e_item_master" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_item_master_attachment" (
    "id" integer NOT NULL,
    "item_master_id" integer,
    "file_path" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "file_name" character varying,
    "file_type" character varying,
    "file_size" integer
);


ALTER TABLE "public"."e_item_master_attachment" OWNER TO "postgres";


ALTER TABLE "public"."e_item_master" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_item_master_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_item_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_item_type" OWNER TO "postgres";


ALTER TABLE "public"."e_item_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_item_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_maintenance" (
    "id" integer NOT NULL,
    "code" character varying(50) NOT NULL,
    "name" character varying(255),
    "maintenance_type_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_maintenance" OWNER TO "postgres";


ALTER TABLE "public"."e_maintenance" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_maintenance_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_maintenance_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_maintenance_type" OWNER TO "postgres";


ALTER TABLE "public"."e_maintenance_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_maintenance_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_manufacturer" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_manufacturer" OWNER TO "postgres";


ALTER TABLE "public"."e_manufacturer" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_manufacturer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_material_class" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_material_class" OWNER TO "postgres";


ALTER TABLE "public"."e_material_class" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_material_class_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_material_construction" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "material_construction_type" smallint,
    "composition" character varying(255),
    "mts_mpa" integer,
    "mys_mpa" integer
);


ALTER TABLE "public"."e_material_construction" OWNER TO "postgres";


COMMENT ON COLUMN "public"."e_material_construction"."material_construction_type" IS '1=Pressure Vessel, 2 = Piping';



ALTER TABLE "public"."e_material_construction" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_material_construction_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_new_work_attachment" (
    "id" integer NOT NULL,
    "file_path" character varying(255),
    "description" character varying(255),
    "work_request_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "is_from_new_work_attachment" boolean DEFAULT true
);


ALTER TABLE "public"."e_new_work_attachment" OWNER TO "postgres";


ALTER TABLE "public"."e_new_work_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_new_work_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_new_work_failure" (
    "id" integer NOT NULL,
    "safety" character varying(100),
    "like_hood" character varying(100),
    "action_taken" "text",
    "critical_rank" integer,
    "provability_occurrance" integer,
    "environment_consequences" character varying(100),
    "has_consequence" character varying(100),
    "corrective_action" "text",
    "failure_priority_id" integer,
    "lost_time_incident" boolean,
    "failure_shutdown" boolean,
    "failure_type_id" integer,
    "work_request_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_new_work_failure" OWNER TO "postgres";


ALTER TABLE "public"."e_new_work_failure" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_new_work_failure_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_new_work_failure_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_new_work_failure_type" OWNER TO "postgres";


ALTER TABLE "public"."e_new_work_failure_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_new_work_failure_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_new_work_request" (
    "id" integer NOT NULL,
    "cm_status_id" integer,
    "description" "text",
    "work_request_date" timestamp without time zone,
    "target_due_date" timestamp without time zone,
    "facility_id" bigint,
    "system_id" integer,
    "package_id" integer,
    "asset_id" integer,
    "cm_sce_code" integer,
    "work_center_id" integer,
    "date_finding" timestamp without time zone,
    "maintenance_type" integer,
    "requested_by" "uuid",
    "priority_id" integer,
    "finding_detail" "text",
    "anomaly_report" boolean,
    "quick_incident_report" boolean,
    "work_request_no" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "is_work_order_created" boolean DEFAULT false,
    "wo_id" bigint
);


ALTER TABLE "public"."e_new_work_request" OWNER TO "postgres";


ALTER TABLE "public"."e_new_work_request" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_new_work_request_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_new_work_task_detail" (
    "id" integer NOT NULL,
    "new_work_request_id" integer,
    "task_sequence" integer,
    "task_list" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_new_work_task_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_new_work_task_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_new_work_task_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_nominal_bore_diameter" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_nominal_bore_diameter" OWNER TO "postgres";


ALTER TABLE "public"."e_nominal_bore_diameter" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_nominal_bore_diameter_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_package" (
    "id" integer NOT NULL,
    "system_id" integer,
    "package_name" character varying(255),
    "package_tag" character varying(255),
    "package_type_id" integer,
    "package_no" character varying(255),
    "is_active" boolean,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_package" OWNER TO "postgres";


ALTER TABLE "public"."e_package" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_package_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_package_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "abbreviation_name" character varying(10)
);


ALTER TABLE "public"."e_package_type" OWNER TO "postgres";


ALTER TABLE "public"."e_package_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_package_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pipe_class" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pipe_class" OWNER TO "postgres";


ALTER TABLE "public"."e_pipe_class" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_pipe_class_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_actual_labour" (
    "id" integer NOT NULL,
    "employee_id" integer,
    "duration" double precision,
    "pm_wo_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_actual_labour" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_actual_labour" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_actual_labour_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_actual_material" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "item_id" integer,
    "quantity" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_actual_material" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_actual_material" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_actual_material_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_additional_info" (
    "id" integer NOT NULL,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "pm_wo_id" integer
);


ALTER TABLE "public"."e_pm_additional_info" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_additional_info" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_additional_info_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_attachment" (
    "id" integer NOT NULL,
    "file_path" character varying(255),
    "pm_wo_id" integer,
    "description" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_attachment" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_checksheet" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "file_path" "text",
    "is_from_pm_schedule" boolean DEFAULT false
);


ALTER TABLE "public"."e_pm_checksheet" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_checksheet" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_checksheet_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_defer" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "previous_due_date" timestamp without time zone,
    "new_due_date" timestamp without time zone,
    "remarks" character varying(255),
    "requested_by" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_defer" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_defer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_defer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_group" (
    "id" integer NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_detail_id" integer
);


ALTER TABLE "public"."e_pm_group" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_group" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_maintainable_group" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "asset_id" integer,
    "group_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_maintainable_group" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_pm_min_acceptance_criteria" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "criteria" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "field_name" "text"
);


ALTER TABLE "public"."e_pm_min_acceptance_criteria" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_min_acceptance_criteria" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_min_acceptance_criteria_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_plan_labour" (
    "id" integer NOT NULL,
    "employee_id" integer,
    "duration" double precision,
    "pm_wo_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_plan_labour" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_plan_labour" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_plan_labour_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_plan_material" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "item_id" integer,
    "quantity" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_plan_material" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_plan_material" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_plan_material_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_report" (
    "id" integer NOT NULL,
    "pm_wo_id" integer,
    "sce_result" character varying(255),
    "detail_description" "text",
    "equipment_status" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "general_maintenances" "text"[]
);


ALTER TABLE "public"."e_pm_report" OWNER TO "postgres";


COMMENT ON COLUMN "public"."e_pm_report"."general_maintenances" IS 'refer to table general_maintainence_id (name only since the data can be added but the lookup still the same)';



ALTER TABLE "public"."e_pm_report" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_asset_sce" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_sce_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule" (
    "id" integer NOT NULL,
    "due_date" timestamp without time zone NOT NULL,
    "maintenance_id" integer,
    "is_active" boolean DEFAULT true,
    "priority_id" integer,
    "work_center_id" integer,
    "discipline_id" integer,
    "task_id" integer,
    "frequency_id" integer NOT NULL,
    "asset_id" integer,
    "system_id" integer,
    "package_id" integer,
    "pm_group_id" integer,
    "pm_sce_group_id" integer,
    "pm_description" "text",
    "facility_id" integer,
    "pm_no" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "is_deleted" boolean DEFAULT false
);


ALTER TABLE "public"."e_pm_schedule" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_additional_info" (
    "id" integer NOT NULL,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "pm_schedule_id" integer
);


ALTER TABLE "public"."e_pm_schedule_additional_info" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_additional_info" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_additional_info_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_checksheet" (
    "id" integer NOT NULL,
    "pm_schedule_id" integer,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "file_path" "text",
    "is_from_pm_schedule" boolean DEFAULT true
);


ALTER TABLE "public"."e_pm_schedule_checksheet" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_checksheet" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_checksheet_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_pm_schedule" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_maintainable_group" (
    "id" integer NOT NULL,
    "pm_schedule_id" integer,
    "asset_id" integer,
    "group_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_schedule_maintainable_group" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_maintainable_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_maintainable_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_min_acceptance_criteria" (
    "id" integer NOT NULL,
    "pm_schedule_id" integer,
    "criteria" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "field_name" "text"
);


ALTER TABLE "public"."e_pm_schedule_min_acceptance_criteria" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_min_acceptance_criteria" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_min_acceptance_criteria_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_plan_labour" (
    "id" integer NOT NULL,
    "employee_id" integer,
    "duration" double precision,
    "pm_schedule_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_schedule_plan_labour" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_plan_labour" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_plan_labour_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_plan_material" (
    "id" integer NOT NULL,
    "pm_schedule_id" integer,
    "item_id" integer,
    "quantity" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_pm_schedule_plan_material" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_plan_material" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_plan_material_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_schedule_task_detail" (
    "id" integer NOT NULL,
    "sequence" integer,
    "task_list" character varying(255),
    "pm_schedule_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "original_task_detail_id" integer,
    "is_custom" boolean DEFAULT false NOT NULL,
    "is_template_copy" boolean DEFAULT false NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."e_pm_schedule_task_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_schedule_task_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_schedule_task_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_task_detail" (
    "id" integer NOT NULL,
    "sequence" integer,
    "task_list" character varying(255),
    "pm_wo_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "pm_schedule_id" integer,
    "original_task_detail_id" integer,
    "is_custom" boolean DEFAULT false NOT NULL,
    "is_template_copy" boolean DEFAULT false NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."e_pm_task_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_task_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_task_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_wo_generate" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "gen_random_uuid"(),
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "is_individual" boolean DEFAULT false,
    "pm_schedule_id" integer
);


ALTER TABLE "public"."e_pm_wo_generate" OWNER TO "postgres";


COMMENT ON TABLE "public"."e_pm_wo_generate" IS 'this is for trigger and historical purposes';



ALTER TABLE "public"."e_pm_wo_generate" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_wo_generate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_pm_wo_multiple_generate" (
    "id" bigint NOT NULL,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "pm_schedule_id" integer,
    "frequency_id" integer,
    "created_by" "uuid",
    "due_date" timestamp with time zone
);


ALTER TABLE "public"."e_pm_wo_multiple_generate" OWNER TO "postgres";


ALTER TABLE "public"."e_pm_wo_multiple_generate" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_wo_multiple_generate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_pm_work_order" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pm_work_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_priority" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_priority" OWNER TO "postgres";


ALTER TABLE "public"."e_priority" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_priority_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_project" (
    "id" bigint NOT NULL,
    "project_code" character varying(50) NOT NULL,
    "client_id" integer,
    "project_type" integer,
    "project_name" character varying(255),
    "short_name" character varying(255),
    "start_date" timestamp without time zone,
    "end_date" timestamp without time zone,
    "fund_code" character varying(100),
    "project_purpose" character varying(255),
    "remark" character varying(255),
    "longitude" character varying,
    "latitude" character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_project" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_project_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_project_type" OWNER TO "postgres";


ALTER TABLE "public"."e_project_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_project_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_inspection" (
    "id" integer NOT NULL,
    "inspection_plan" character varying,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_ims_inspection" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_inspection" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_pv_inspection_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_rack" (
    "id" integer NOT NULL,
    "name" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_rack" OWNER TO "postgres";


ALTER TABLE "public"."e_rack" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_rack_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_sensor_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_sensor_type" OWNER TO "postgres";


ALTER TABLE "public"."e_sensor_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_sensor_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_shutdown_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_shutdown_type" OWNER TO "postgres";


ALTER TABLE "public"."e_shutdown_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_shutdown_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_spare_parts" (
    "id" integer NOT NULL,
    "bom_id" integer NOT NULL,
    "item_master_id" integer NOT NULL,
    "description" character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "quantity" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE "public"."e_spare_parts" OWNER TO "postgres";


ALTER TABLE "public"."e_spare_parts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_spare_parts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_store" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_store" OWNER TO "postgres";


ALTER TABLE "public"."e_store" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_store_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_system" (
    "id" integer NOT NULL,
    "facility_id" integer,
    "system_code" character varying(100) NOT NULL,
    "system_no" character varying(100),
    "system_name" character varying(150),
    "is_active" boolean,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_system" OWNER TO "postgres";


ALTER TABLE "public"."e_system" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_system_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_task" (
    "id" integer NOT NULL,
    "task_code" character varying(100) NOT NULL,
    "task_name" character varying(255),
    "discipline_id" integer,
    "is_active" boolean,
    "created_at" "date",
    "updated_at" "date",
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."e_task" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."e_task_detail" (
    "id" integer NOT NULL,
    "task_id" integer NOT NULL,
    "seq" integer,
    "task_list" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_task_detail" OWNER TO "postgres";


ALTER TABLE "public"."e_task" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_task_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_toxicity" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_toxicity" OWNER TO "postgres";


ALTER TABLE "public"."e_toxicity" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_toxicity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_unit" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_unit" OWNER TO "postgres";


ALTER TABLE "public"."e_unit" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_unit_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_wo_pm_schedule" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "wo_id" bigint,
    "pm_schedule_id" bigint,
    "pm_wo_generate" bigint,
    "created_by" "uuid",
    "due_date" timestamp with time zone
);


ALTER TABLE "public"."e_wo_pm_schedule" OWNER TO "postgres";


COMMENT ON TABLE "public"."e_wo_pm_schedule" IS 'bridge table e_work_order (pm only) and e_pm_schedule';



ALTER TABLE "public"."e_wo_pm_schedule" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_wo_pm_schedule_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_work_center" (
    "id" integer NOT NULL,
    "code" character varying(50) NOT NULL,
    "name" character varying(255),
    "type" character varying(100),
    "effective_date" timestamp without time zone,
    "remark" character varying(255),
    "is_active" boolean,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_work_center" OWNER TO "postgres";


ALTER TABLE "public"."e_work_center" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_work_center_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_work_order" (
    "id" bigint NOT NULL,
    "work_order_type" integer,
    "pm_work_order_id" integer,
    "work_order_status_id" integer,
    "description" "text",
    "work_order_no" character varying(255),
    "cm_work_order_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp without time zone,
    "created_by" "uuid",
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_id" integer,
    "task_id" integer,
    "due_date" "date",
    "facility_id" bigint
);


ALTER TABLE "public"."e_work_order" OWNER TO "postgres";


ALTER TABLE "public"."e_work_order" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_work_order_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_work_order_status" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_work_order_status" OWNER TO "postgres";


ALTER TABLE "public"."e_work_order_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_work_order_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_work_order_type" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_work_order_type" OWNER TO "postgres";


ALTER TABLE "public"."e_work_order_type" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."e_work_order_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."e_work_request_report" (
    "id" integer NOT NULL,
    "weather_condition" character varying(100),
    "visibility" character varying(100),
    "wind_speed_direction" character varying(100),
    "sea_well" character varying(100),
    "alarm_trigger" character varying(100),
    "shutdown_type_id" integer,
    "time_failed" timestamp without time zone,
    "time_resume" timestamp without time zone,
    "shift" character varying(100),
    "redundant" character varying(100),
    "other_detail" character varying(255),
    "service_asset" character varying(50),
    "pressure" double precision,
    "temp" double precision,
    "operating_history" double precision,
    "time_in_servicehr" double precision,
    "material_class_id" integer,
    "design_code" character varying(50),
    "work_request_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."e_work_request_report" OWNER TO "postgres";


ALTER TABLE "public"."e_work_request_report" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."e_work_request_report_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_asme_material_lookup" (
    "id" integer NOT NULL,
    "material_code_id" integer,
    "temperature" real,
    "value" real,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_asme_material_lookup" OWNER TO "postgres";


ALTER TABLE "public"."i_asme_material_lookup" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_asme_material_lookup_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_branch_diameter" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_branch_diameter" OWNER TO "postgres";


ALTER TABLE "public"."i_branch_diameter" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_branch_diameter_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_code_sheet" (
    "id" integer NOT NULL,
    "ims_asset_type_id" integer NOT NULL,
    "sheet_name" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."i_code_sheet" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_code_sheet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_code_sheet_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_code_sheet_id_seq" OWNED BY "public"."i_code_sheet"."id";



CREATE TABLE IF NOT EXISTS "public"."i_corrective_action" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_corrective_action" OWNER TO "postgres";


ALTER TABLE "public"."i_corrective_action" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_corrective_action_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_corrosion_factor" (
    "id" integer NOT NULL,
    "temperature" numeric(5,2),
    "pressure" numeric(5,2),
    "h2s_concentration" numeric(6,2),
    "co2_concentration" numeric(6,2),
    "base_material_id" integer,
    "fluid_velocity" numeric(5,2),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."i_corrosion_factor" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_corrosion_factor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_corrosion_factor_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_corrosion_factor_id_seq" OWNED BY "public"."i_corrosion_factor"."id";



CREATE TABLE IF NOT EXISTS "public"."i_corrosion_group" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."i_corrosion_group" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_corrosion_group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_corrosion_group_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_corrosion_group_id_seq" OWNED BY "public"."i_corrosion_group"."id";



CREATE TABLE IF NOT EXISTS "public"."i_corrosion_monitoring" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."i_corrosion_monitoring" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_corrosion_monitoring_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_corrosion_monitoring_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_corrosion_monitoring_id_seq" OWNED BY "public"."i_corrosion_monitoring"."id";



CREATE TABLE IF NOT EXISTS "public"."i_corrosion_study" (
    "id" integer NOT NULL,
    "asset_id" integer NOT NULL,
    "external_environment_id" integer,
    "ph" numeric(4,2),
    "monitoring_method_id" integer,
    "internal_damage_mechanism" "text",
    "external_damage_mechanism" "text",
    "expected_internal_corrosion_rate" numeric(5,2),
    "expected_external_corrosion_rate" numeric(5,2),
    "h2s_presence" boolean DEFAULT false,
    "co2_presence" boolean DEFAULT false,
    "description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "study_code" "text",
    "study_name" "text",
    "corrosion_group_id" integer,
    "corrosion_factor_id" integer,
    "material_construction_id" integer
);


ALTER TABLE "public"."i_corrosion_study" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_corrosion_study_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_corrosion_study_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_corrosion_study_id_seq" OWNED BY "public"."i_corrosion_study"."id";



CREATE TABLE IF NOT EXISTS "public"."i_cyclic_load_type" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_cyclic_load_type" OWNER TO "postgres";


ALTER TABLE "public"."i_cyclic_load_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_cyclic_load_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_data_confidence" (
    "id" integer NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_data_confidence" OWNER TO "postgres";


ALTER TABLE "public"."i_data_confidence" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_data_confidence_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_cui" (
    "id" integer NOT NULL,
    "last_inspection_date" "date",
    "new_coating_date" "date",
    "dfcuiff" double precision,
    "ims_pof_assessment_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "data_confidence_id" integer,
    "i_ims_protection_id" integer,
    "i_ims_design_id" integer,
    "ncuifa" real,
    "ncuifb" real,
    "ncuifc" real,
    "ncuifd" real,
    "ims_general_id" integer,
    "cr_act" double precision,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_cui" OWNER TO "postgres";


ALTER TABLE "public"."i_df_cui" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_cui_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_ext" (
    "id" integer NOT NULL,
    "last_inspection_date" "date",
    "new_coating_date" "date",
    "ims_pof_assessment_id" integer,
    "data_confidence_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "dfextcorrf" real,
    "i_ims_protection_id" integer,
    "i_ims_design_id" integer,
    "nextcorra" real,
    "nextcorrb" real,
    "nextcorrc" real,
    "nextcorrd" real,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_ext" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."i_df_ext_clscc" (
    "id" integer NOT NULL,
    "last_inspection_date" "date",
    "new_coating_date" "date",
    "inspection_efficiency_id" integer,
    "ims_pof_asessment_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "data_confidence_id" integer,
    "df_ext_cl_scc" real,
    "i_ims_protection_id" integer,
    "i_ims_design_id" integer,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_ext_clscc" OWNER TO "postgres";


ALTER TABLE "public"."i_df_ext_clscc" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_ext_clscc_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."i_df_ext" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_ext_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_mfat" (
    "id" integer NOT NULL,
    "previous_failure_id" integer,
    "visible_audible_shaking_id" integer,
    "shaking_frequency_id" integer,
    "cyclic_load_type_id" integer,
    "corrective_action_id" integer,
    "pipe_complexity_id" integer,
    "pipe_condition_id" integer,
    "joint_branch_design_id" integer,
    "brach_diameter_id" integer,
    "dmfatfb" real,
    "ims_pof_assessment_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "data_confidence_id" integer,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_mfat" OWNER TO "postgres";


ALTER TABLE "public"."i_df_mfat" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_mfat_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_scc_scc" (
    "id" integer NOT NULL,
    "inspection_efficiency_id" integer,
    "hardness_brinnel" integer,
    "dfsccfb" double precision,
    "df_scc_scc" double precision,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "h2s_in_water" real,
    "ph" real,
    "ims_general_id" integer,
    "last_inspection_date" "date",
    "ims_pof_assessment_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_scc_scc" OWNER TO "postgres";


ALTER TABLE "public"."i_df_scc_scc" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_scc_scc_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_scc_sohic" (
    "id" integer NOT NULL,
    "inspection_efficiency_id" integer,
    "steelscontent_id" integer,
    "harness_brinnel" real,
    "dfscc_sohic" real,
    "ims_pof_assessment_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "h2s_in_water" real,
    "ph" real,
    "ims_general_id" integer,
    "last_inspection_date" "date",
    "i_ims_protection_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_scc_sohic" OWNER TO "postgres";


ALTER TABLE "public"."i_df_scc_sohic" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_scc_sohic_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_df_thin" (
    "id" integer NOT NULL,
    "last_inspection_date" "date",
    "data_confidence_id" integer,
    "nthin_a" double precision,
    "nthin_b" double precision,
    "nthin_c" double precision,
    "nthin_d" double precision,
    "agerc" "date",
    "ims_pof_assessment_id" integer,
    "dfthinfb" real,
    "ims_general_id" integer,
    "cr_act" double precision,
    "i_ims_design_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_df_thin" OWNER TO "postgres";


ALTER TABLE "public"."i_df_thin" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_df_thin_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_env_severity" (
    "id" integer NOT NULL,
    "name" character varying(100),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_at" timestamp with time zone,
    "updated_by" "uuid"
);


ALTER TABLE "public"."i_env_severity" OWNER TO "postgres";


ALTER TABLE "public"."i_env_severity" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_env_severity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_header_master" (
    "id" integer NOT NULL,
    "code_sheet_id" integer NOT NULL,
    "header_label" "text" NOT NULL,
    "header_value" numeric NOT NULL
);


ALTER TABLE "public"."i_header_master" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_header_master_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_header_master_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_header_master_id_seq" OWNED BY "public"."i_header_master"."id";



CREATE TABLE IF NOT EXISTS "public"."i_ims_asset_type" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "code" character varying(100)
);


ALTER TABLE "public"."i_ims_asset_type" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_asset_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_asset_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_attachment" (
    "id" integer NOT NULL,
    "attachment_path" character varying(355),
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "remark" "text"
);


ALTER TABLE "public"."i_ims_attachment" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_inspection_attachment" (
    "id" integer NOT NULL,
    "attachment_path" character varying(366),
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_inspection_id" integer
);


ALTER TABLE "public"."i_ims_inspection_attachment" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_inspection_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_inspection_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_pof_assessment_general" (
    "id" integer NOT NULL,
    "asset_detail_id" integer,
    "coating_quality_id" integer,
    "cladding" boolean,
    "nominal_thickness" real,
    "current_thickness" real,
    "description" character varying(366),
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_general_id" integer,
    "data_confidence_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_ims_pof_assessment_general" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_pof_assessment_general" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_pof_assessment_general_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_service" (
    "id" integer NOT NULL,
    "fluid_representive_id" integer,
    "fluid_phase_id" integer,
    "toxicity_id" integer,
    "toxic_mass_fraction" double precision,
    "asset_detail_id" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "ims_asset_type_id" integer
);


ALTER TABLE "public"."i_ims_service" OWNER TO "postgres";


COMMENT ON COLUMN "public"."i_ims_service"."ims_asset_type_id" IS '1= Pressure Vessel , 2=Piping';



ALTER TABLE "public"."i_ims_service" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_pv_service_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_rbi_general" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "i_ims_general_id" integer,
    "asset_detail_id" integer,
    "i_ims_design" integer,
    "rbi_no" character varying
);


ALTER TABLE "public"."i_ims_rbi_general" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_rbi_general" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_rbi_general_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_ims_rbi_risk_irp" (
    "id" integer NOT NULL,
    "dhtha" real,
    "dbrit" real,
    "dthin" double precision,
    "dextd" double precision,
    "dscc" double precision,
    "dmfat" double precision,
    "pof" double precision,
    "cof_financial" double precision,
    "cof_area" double precision,
    "pof_value" double precision,
    "risk_level" double precision,
    "risk_ranking" double precision,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "asset_detail_id" integer,
    "ims_general_id" integer,
    "ims_rbi_general_id" bigint
);


ALTER TABLE "public"."i_ims_rbi_risk_irp" OWNER TO "postgres";


ALTER TABLE "public"."i_ims_rbi_risk_irp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_ims_rbi_risk_irp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_inspection_data" (
    "id" integer NOT NULL,
    "asset_detail_id" integer,
    "ltcr" real,
    "stcr" real,
    "inspection_strategy" character varying(266),
    "remaining_life" real,
    "inspection_request" character varying(266),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "is_active" boolean NOT NULL
);


ALTER TABLE "public"."i_inspection_data" OWNER TO "postgres";


ALTER TABLE "public"."i_inspection_data" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_inspection_data_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_inspection_efficiency" (
    "id" integer NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_inspection_efficiency" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."i_insulation_complexity" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_insulation_complexity" OWNER TO "postgres";


ALTER TABLE "public"."i_insulation_complexity" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_insulation_complexity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_insulation_condition" (
    "id" integer NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_insulation_condition" OWNER TO "postgres";


ALTER TABLE "public"."i_insulation_condition" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_insulation_condition_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_inventory_group" (
    "id" integer NOT NULL,
    "asset_detail_id" integer NOT NULL,
    "group_type" character varying,
    "group_name" character varying,
    "total_inventory" integer,
    "component_inventory" integer,
    "equipment_volume" numeric,
    "representative_component" character varying,
    "is_status" boolean DEFAULT true NOT NULL,
    "description" "text",
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "updated_by" "uuid" DEFAULT "auth"."uid"()
);


ALTER TABLE "public"."i_inventory_group" OWNER TO "postgres";


ALTER TABLE "public"."i_inventory_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_inventory_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_joint_branch_design" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_joint_branch_design" OWNER TO "postgres";


ALTER TABLE "public"."i_joint_branch_design" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_joint_branch_design_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_lining_monitoring" (
    "id" integer NOT NULL,
    "name" character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone,
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_lining_monitoring" OWNER TO "postgres";


ALTER TABLE "public"."i_lining_monitoring" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_lining_monitoring_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_lining_type" (
    "id" integer NOT NULL,
    "name" character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_lining_type" OWNER TO "postgres";


ALTER TABLE "public"."i_lining_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_lining_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_material_construction" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text"
);


ALTER TABLE "public"."i_material_construction" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_material_construction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_material_construction_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_material_construction_id_seq" OWNED BY "public"."i_material_construction"."id";



CREATE TABLE IF NOT EXISTS "public"."i_pipe_complexity" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_pipe_complexity" OWNER TO "postgres";


ALTER TABLE "public"."i_pipe_complexity" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_pipe_complexity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_pipe_condition" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_pipe_condition" OWNER TO "postgres";


ALTER TABLE "public"."i_pipe_condition" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_pipe_condition_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_previous_failure" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_previous_failure" OWNER TO "postgres";


ALTER TABLE "public"."i_previous_failure" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_previous_failure_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_shaking_frequency" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_shaking_frequency" OWNER TO "postgres";


ALTER TABLE "public"."i_shaking_frequency" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_shaking_frequency_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_spec_header_value" (
    "spec_id" integer NOT NULL,
    "header_id" integer NOT NULL,
    "cell_value" numeric
);


ALTER TABLE "public"."i_spec_header_value" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."i_spec_master" (
    "id" integer NOT NULL,
    "code_sheet_id" integer NOT NULL,
    "spec_code" "text" NOT NULL
);


ALTER TABLE "public"."i_spec_master" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_spec_master_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."i_spec_master_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_spec_master_id_seq" OWNED BY "public"."i_spec_master"."id";



CREATE TABLE IF NOT EXISTS "public"."i_steelscontent" (
    "id" integer NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."i_steelscontent" OWNER TO "postgres";


ALTER TABLE "public"."i_steelscontent" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_steelscontent_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_visible_audio_shaking" (
    "id" smallint NOT NULL,
    "name" character varying(100),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_by" "uuid",
    "updated_at" timestamp with time zone,
    "value" real
);


ALTER TABLE "public"."i_visible_audio_shaking" OWNER TO "postgres";


ALTER TABLE "public"."i_visible_audio_shaking" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_visible_audio_shaking_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."i_inspection_efficiency" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."inspection_efficiency_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_inventory_adjustment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."inventory_adjustment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_isolation_system" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."isolation_system_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_item_master_attachment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."item_master_attachment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_pm_maintainable_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pm_maintainable_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" character varying NOT NULL,
    "full_name" character varying,
    "avatar_url" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_type_id" "uuid" NOT NULL,
    "is_active" boolean DEFAULT true,
    "is_deleted" boolean DEFAULT false,
    "description" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE "public"."e_project" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."project_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."r_rms_uptime" (
    "id" integer NOT NULL,
    "date" "date",
    "uptime" double precision,
    "unplanned_shutdown" double precision,
    "planned_shutdown" double precision,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_at" timestamp with time zone,
    "updated_by" "uuid",
    "asset_code" character varying(166),
    "asset_detail_id" integer,
    "description" "text"
);


ALTER TABLE "public"."r_rms_uptime" OWNER TO "postgres";


ALTER TABLE "public"."r_rms_uptime" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."r_rms_uptime_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."e_task_detail" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."task_detail_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_projects" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "updated_by" "uuid"
);


ALTER TABLE "public"."user_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_type" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying,
    "created_when" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "updated_at" timestamp with time zone,
    "updated_by" "uuid" DEFAULT "auth"."uid"(),
    "priority" smallint,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."user_type" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_order_sequence" (
    "year" integer NOT NULL,
    "current_number" integer DEFAULT 0
);


ALTER TABLE "public"."work_order_sequence" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_request_sequence" (
    "year" integer NOT NULL,
    "current_number" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."work_request_sequence" OWNER TO "postgres";


ALTER TABLE ONLY "public"."i_code_sheet" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_code_sheet_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_corrosion_factor" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_corrosion_factor_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_corrosion_group" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_corrosion_group_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_corrosion_monitoring" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_corrosion_monitoring_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_corrosion_study" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_corrosion_study_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_header_master" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_header_master_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_material_construction" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_material_construction_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_spec_master" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_spec_master_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."e_asset_image"
    ADD CONSTRAINT "asset_image_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_circuit"
    ADD CONSTRAINT "circuit_id_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_client"
    ADD CONSTRAINT "client_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_client"
    ADD CONSTRAINT "client_unique" UNIQUE ("code");



ALTER TABLE ONLY "public"."e_cm_sce"
    ADD CONSTRAINT "cm_sce_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_sce"
    ADD CONSTRAINT "cm_sce_unique" UNIQUE ("cm_sce_code");



ALTER TABLE ONLY "public"."e_coating_quality"
    ADD CONSTRAINT "coating_quality_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_data_confidence"
    ADD CONSTRAINT "data_confidence_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_asset_type"
    ADD CONSTRAINT "data_confidence_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_insulation_complexity"
    ADD CONSTRAINT "data_confidence_pk_1_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_design_fabrication"
    ADD CONSTRAINT "design_fabrication_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_detection_system"
    ADD CONSTRAINT "detection_system_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_adjustment_category"
    ADD CONSTRAINT "e_adjustment_category_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_adjustment_type"
    ADD CONSTRAINT "e_adjustment_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_area"
    ADD CONSTRAINT "e_asset_area_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_attachment"
    ADD CONSTRAINT "e_asset_attachment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_category_group"
    ADD CONSTRAINT "e_asset_category_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_category"
    ADD CONSTRAINT "e_asset_category_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_class"
    ADD CONSTRAINT "e_asset_class_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_asset_id_key" UNIQUE ("asset_id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_group"
    ADD CONSTRAINT "e_asset_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_installation"
    ADD CONSTRAINT "e_asset_installation_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_status"
    ADD CONSTRAINT "e_asset_status_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_tag"
    ADD CONSTRAINT "e_asset_tag_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_type_group"
    ADD CONSTRAINT "e_asset_type_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_type"
    ADD CONSTRAINT "e_asset_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_unique" UNIQUE ("asset_no");



ALTER TABLE ONLY "public"."e_bom_assembly"
    ADD CONSTRAINT "e_bom_assembly_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_bom_assembly"
    ADD CONSTRAINT "e_bom_assembly_unique" UNIQUE ("bom_code");



ALTER TABLE ONLY "public"."e_cm_actual_material"
    ADD CONSTRAINT "e_cm_actual_material_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_actual_labour"
    ADD CONSTRAINT "e_cm_actual_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_attachment"
    ADD CONSTRAINT "e_cm_attachment_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_defer"
    ADD CONSTRAINT "e_cm_defer_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_finding"
    ADD CONSTRAINT "e_cm_finding_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_report"
    ADD CONSTRAINT "e_cm_report_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_status"
    ADD CONSTRAINT "e_cm_status_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_cm_task_detail"
    ADD CONSTRAINT "e_cm_task_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_criticality"
    ADD CONSTRAINT "e_criticality_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_discipline"
    ADD CONSTRAINT "e_discipline_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_discipline"
    ADD CONSTRAINT "e_discipline_unique" UNIQUE ("code");



ALTER TABLE ONLY "public"."e_employee"
    ADD CONSTRAINT "e_employee_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_employee"
    ADD CONSTRAINT "e_employee_unique" UNIQUE ("uid_employee");



ALTER TABLE ONLY "public"."e_facility"
    ADD CONSTRAINT "e_facility_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_facility"
    ADD CONSTRAINT "e_facility_unique" UNIQUE ("location_code");



ALTER TABLE ONLY "public"."e_failure_priority"
    ADD CONSTRAINT "e_failure_priority_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_fluid_phase"
    ADD CONSTRAINT "e_fluid_phase_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_fluid_representive"
    ADD CONSTRAINT "e_fluid_representive_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_frequency"
    ADD CONSTRAINT "e_frequency_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_frequency_type"
    ADD CONSTRAINT "e_frequency_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_frequency"
    ADD CONSTRAINT "e_frequency_unique" UNIQUE ("frequency_code");



ALTER TABLE ONLY "public"."e_ideal_gas_specific_heat_eq"
    ADD CONSTRAINT "e_ideal_gas_specific_heat_eq_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory_issue"
    ADD CONSTRAINT "e_inventory_issue_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory"
    ADD CONSTRAINT "e_inventory_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory_receive"
    ADD CONSTRAINT "e_inventory_receive_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory_return"
    ADD CONSTRAINT "e_inventory_return_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory_transfer"
    ADD CONSTRAINT "e_inventory_tansfer_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_iot_sensor"
    ADD CONSTRAINT "e_iot_sensor_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_isolation_service_class"
    ADD CONSTRAINT "e_isolation_service_class_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_item_category"
    ADD CONSTRAINT "e_item_category_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_item_group"
    ADD CONSTRAINT "e_item_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_unique" UNIQUE ("item_no");



ALTER TABLE ONLY "public"."e_item_type"
    ADD CONSTRAINT "e_item_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_maintenance"
    ADD CONSTRAINT "e_maintenance_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_maintenance_type"
    ADD CONSTRAINT "e_maintenance_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_maintenance"
    ADD CONSTRAINT "e_maintenance_unique" UNIQUE ("code");



ALTER TABLE ONLY "public"."e_manufacturer"
    ADD CONSTRAINT "e_manufacturer_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_material_class"
    ADD CONSTRAINT "e_material_class_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_new_work_attachment"
    ADD CONSTRAINT "e_new_work_attachment_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_new_work_failure_type"
    ADD CONSTRAINT "e_new_work_failure_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_unique" UNIQUE ("work_request_no");



ALTER TABLE ONLY "public"."e_new_work_task_detail"
    ADD CONSTRAINT "e_new_work_task_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_package"
    ADD CONSTRAINT "e_package_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_package_type"
    ADD CONSTRAINT "e_package_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_actual_material"
    ADD CONSTRAINT "e_pm_actual_material_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_actual_labour"
    ADD CONSTRAINT "e_pm_actual_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_additional_info"
    ADD CONSTRAINT "e_pm_additional_info_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_attachment"
    ADD CONSTRAINT "e_pm_attachment_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_checksheet"
    ADD CONSTRAINT "e_pm_checksheet_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_defer"
    ADD CONSTRAINT "e_pm_defer_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_group"
    ADD CONSTRAINT "e_pm_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_maintainable_group"
    ADD CONSTRAINT "e_pm_maintainable_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_min_acceptance_criteria"
    ADD CONSTRAINT "e_pm_min_acceptance_criteria_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_plan_material"
    ADD CONSTRAINT "e_pm_plan_material_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_plan_labour"
    ADD CONSTRAINT "e_pm_plan_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_report"
    ADD CONSTRAINT "e_pm_report_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_sce"
    ADD CONSTRAINT "e_pm_sce_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_asset_sce"
    ADD CONSTRAINT "e_pm_sce_unique" UNIQUE ("sce_code");



ALTER TABLE ONLY "public"."e_pm_schedule_additional_info"
    ADD CONSTRAINT "e_pm_schedule_additional_info_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_checksheet"
    ADD CONSTRAINT "e_pm_schedule_checksheet_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_maintainable_group"
    ADD CONSTRAINT "e_pm_schedule_maintainable_group_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_min_acceptance_criteria"
    ADD CONSTRAINT "e_pm_schedule_min_acceptance_criteria_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_plan_labour"
    ADD CONSTRAINT "e_pm_schedule_plan_labour_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_plan_material"
    ADD CONSTRAINT "e_pm_schedule_plan_material_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_schedule_task_detail"
    ADD CONSTRAINT "e_pm_schedule_task_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_wo_generate"
    ADD CONSTRAINT "e_pm_wo_generate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_wo_multiple_generate"
    ADD CONSTRAINT "e_pm_wo_multiple_generate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_priority"
    ADD CONSTRAINT "e_priority_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_project_type"
    ADD CONSTRAINT "e_project_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_rack"
    ADD CONSTRAINT "e_rack_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_sensor_type"
    ADD CONSTRAINT "e_sensor_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_shutdown_type"
    ADD CONSTRAINT "e_shutdown_type_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_spare_parts"
    ADD CONSTRAINT "e_spare_parts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_store"
    ADD CONSTRAINT "e_store_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_system"
    ADD CONSTRAINT "e_system_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_system"
    ADD CONSTRAINT "e_system_unique" UNIQUE ("system_no");



ALTER TABLE ONLY "public"."e_pm_task_detail"
    ADD CONSTRAINT "e_task_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_task"
    ADD CONSTRAINT "e_task_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_task"
    ADD CONSTRAINT "e_task_unique" UNIQUE ("task_code");



ALTER TABLE ONLY "public"."e_toxicity"
    ADD CONSTRAINT "e_toxicity_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_unit"
    ADD CONSTRAINT "e_unit_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_wo_pm_schedule"
    ADD CONSTRAINT "e_wo_pm_schedule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_work_center"
    ADD CONSTRAINT "e_work_center_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_work_center"
    ADD CONSTRAINT "e_work_center_unique" UNIQUE ("code");



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_work_order_status"
    ADD CONSTRAINT "e_work_order_status_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_work_order_type"
    ADD CONSTRAINT "e_work_order_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_work_request_report"
    ADD CONSTRAINT "e_work_request_report_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_env_severity"
    ADD CONSTRAINT "env_severity_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_ext_env"
    ADD CONSTRAINT "ext_env_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_general_maintenance"
    ADD CONSTRAINT "general_maintenance_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_geometry"
    ADD CONSTRAINT "geometry_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_asme_material_lookup"
    ADD CONSTRAINT "i_asme_material_lookup_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_branch_diameter"
    ADD CONSTRAINT "i_branch_diameter_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_code_sheet"
    ADD CONSTRAINT "i_code_sheet_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_code_sheet"
    ADD CONSTRAINT "i_code_sheet_sheet_name_key" UNIQUE ("sheet_name");



ALTER TABLE ONLY "public"."i_corrective_action"
    ADD CONSTRAINT "i_corrective_action_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_corrosion_factor"
    ADD CONSTRAINT "i_corrosion_factor_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_corrosion_group"
    ADD CONSTRAINT "i_corrosion_group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_corrosion_monitoring"
    ADD CONSTRAINT "i_corrosion_monitoring_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."i_corrosion_monitoring"
    ADD CONSTRAINT "i_corrosion_monitoring_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_study_code_key" UNIQUE ("study_code");



ALTER TABLE ONLY "public"."i_cyclic_load_type"
    ADD CONSTRAINT "i_cyclic_load_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_scc_scc"
    ADD CONSTRAINT "i_df_scc_scc_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_header_master"
    ADD CONSTRAINT "i_header_master_code_sheet_id_header_value_key" UNIQUE ("code_sheet_id", "header_value");



ALTER TABLE ONLY "public"."i_header_master"
    ADD CONSTRAINT "i_header_master_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_attachment"
    ADD CONSTRAINT "i_ims_attachment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_prod"
    ADD CONSTRAINT "i_ims_cof_assessment_cof_prod_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_design"
    ADD CONSTRAINT "i_ims_design_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_inspection_attachment"
    ADD CONSTRAINT "i_ims_inspection_attachment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_inspection"
    ADD CONSTRAINT "i_ims_inspection_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_rbi_general"
    ADD CONSTRAINT "i_ims_rbi_general_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_rbi_general"
    ADD CONSTRAINT "i_ims_rbi_general_rbi_name_key" UNIQUE ("rbi_no");



ALTER TABLE ONLY "public"."i_ims_rbi_risk_irp"
    ADD CONSTRAINT "i_ims_rbi_risk_irp_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_ims_service"
    ADD CONSTRAINT "i_ims_service_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_inspection_data"
    ADD CONSTRAINT "i_inspection_data_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_insulation_condition"
    ADD CONSTRAINT "i_insulation_condition_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_inventory_group"
    ADD CONSTRAINT "i_inventory_group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_joint_branch_design"
    ADD CONSTRAINT "i_joint_branch_design_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_lining_monitoring"
    ADD CONSTRAINT "i_lining_monitoring_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_lining_type"
    ADD CONSTRAINT "i_lining_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_material_construction"
    ADD CONSTRAINT "i_material_construction_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."i_material_construction"
    ADD CONSTRAINT "i_material_construction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_pipe_complexity"
    ADD CONSTRAINT "i_pipe_complexity_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_pipe_condition"
    ADD CONSTRAINT "i_pipe_condition_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_shaking_frequency"
    ADD CONSTRAINT "i_shaking_frequency_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_spec_master"
    ADD CONSTRAINT "i_spec_master_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_inspection_efficiency"
    ADD CONSTRAINT "inspection_efficiency_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_insulation_type"
    ADD CONSTRAINT "insulation_type_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_interface"
    ADD CONSTRAINT "interface_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_inventory_adjustment"
    ADD CONSTRAINT "inventory_adjustment_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_isolation_system"
    ADD CONSTRAINT "isolation_system_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_item_master_attachment"
    ADD CONSTRAINT "item_master_attachment_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_material_construction"
    ADD CONSTRAINT "material_construction" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_mitigation_system"
    ADD CONSTRAINT "mitigation_system_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_new_work_failure"
    ADD CONSTRAINT "new_work_failure_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_nominal_bore_diameter"
    ADD CONSTRAINT "nominal_bore_diameter_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_online_monitor"
    ADD CONSTRAINT "online_monitor_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pipe_schedule"
    ADD CONSTRAINT "pipe_schedule_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_pipe_class"
    ADD CONSTRAINT "pipe_schedule_pk_1" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_previous_failure"
    ADD CONSTRAINT "previous_failure_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_project"
    ADD CONSTRAINT "project_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_project"
    ADD CONSTRAINT "project_unique" UNIQUE ("project_code");



ALTER TABLE ONLY "public"."r_rms_uptime"
    ADD CONSTRAINT "r_rms_uptime_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_steelscontent"
    ADD CONSTRAINT "steelscontent_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."e_task_detail"
    ADD CONSTRAINT "task_detail_pk" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_user_id_project_id_key" UNIQUE ("user_id", "project_id");



ALTER TABLE ONLY "public"."user_type"
    ADD CONSTRAINT "user_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_visible_audio_shaking"
    ADD CONSTRAINT "visible_audio_shaking_pk_" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_order_sequence"
    ADD CONSTRAINT "work_order_sequence_pkey" PRIMARY KEY ("year");



ALTER TABLE ONLY "public"."work_request_sequence"
    ADD CONSTRAINT "work_request_sequence_pkey" PRIMARY KEY ("year");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_is_active" ON "public"."profiles" USING "btree" ("is_active");



CREATE INDEX "idx_profiles_is_deleted" ON "public"."profiles" USING "btree" ("is_deleted");



CREATE INDEX "idx_profiles_user_type_id" ON "public"."profiles" USING "btree" ("user_type_id");



CREATE INDEX "idx_user_type_name" ON "public"."user_type" USING "btree" ("name");



CREATE OR REPLACE TRIGGER "trg_after_insert_cm_general" AFTER INSERT ON "public"."e_cm_general" FOR EACH ROW EXECUTE FUNCTION "public"."trg_copy_cm_data"();



CREATE OR REPLACE TRIGGER "trg_calculate_downtime" AFTER INSERT OR UPDATE OF "time_failed", "time_resume", "cm_general_id" ON "public"."e_cm_report" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_downtime"();



CREATE OR REPLACE TRIGGER "trg_generate_pm_no" BEFORE INSERT ON "public"."e_pm_schedule" FOR EACH ROW EXECUTE FUNCTION "public"."generate_pm_no"();



CREATE OR REPLACE TRIGGER "trg_generate_work_order_no" BEFORE INSERT ON "public"."e_work_order" FOR EACH ROW EXECUTE FUNCTION "public"."generate_work_order_no"();



CREATE OR REPLACE TRIGGER "trg_generate_work_request_no" BEFORE INSERT OR UPDATE ON "public"."e_new_work_request" FOR EACH ROW EXECUTE FUNCTION "public"."generate_work_request_no"();



CREATE OR REPLACE TRIGGER "trg_many_master_wo" AFTER INSERT ON "public"."e_pm_wo_multiple_generate" FOR EACH ROW EXECUTE FUNCTION "public"."func_many_master_wo"();



CREATE OR REPLACE TRIGGER "trg_master_wo" AFTER INSERT ON "public"."e_wo_pm_schedule" FOR EACH ROW EXECUTE FUNCTION "public"."func_master_wo"();



CREATE OR REPLACE TRIGGER "trg_set_rbi_no" BEFORE INSERT ON "public"."i_ims_rbi_general" FOR EACH ROW EXECUTE FUNCTION "public"."set_rbi_no"();



CREATE OR REPLACE TRIGGER "trg_update_wr_wo_id" AFTER INSERT ON "public"."e_work_order" FOR EACH ROW WHEN (("new"."cm_work_order_id" IS NOT NULL)) EXECUTE FUNCTION "public"."func_update_wr_wo_id"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_adjustment_category" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_adjustment_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_area" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_class" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_group" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_image" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_installation" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_sce" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_tag" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_asset_type_group" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_bom_assembly" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_circuit" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_client" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_actual_labour" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_actual_material" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_attachment" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_defer" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_finding" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_general" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_report" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_sce" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_cm_task_detail" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_coating_quality" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_criticality" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_design_fabrication" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_detection_system" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_discipline" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_employee" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_ext_env" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_facility" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_failure_priority" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_fluid_phase" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_fluid_representive" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_frequency" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_frequency_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_general_maintenance" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_geometry" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_isolation_service_class" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_isolation_system" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_item_category" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_item_group" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_item_master_attachment" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_item_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_maintenance" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_maintenance_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_manufacturer" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_material_class" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_mitigation_system" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_new_work_failure" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_new_work_failure_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_nominal_bore_diameter" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_online_monitor" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_package" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_package_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_priority" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_project_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_shutdown_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_store" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_system" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_toxicity" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_unit" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_work_order_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."e_work_order_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_corrective_action" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_cyclic_load_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_data_confidence" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_env_severity" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_ims_cof_assessment_cof_area" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_ims_cof_assessment_cof_prod" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_inspection_efficiency" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_joint_branch_design" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_lining_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_pipe_complexity" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_previous_failure" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_shaking_frequency" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_steelscontent" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_timestamp" BEFORE UPDATE ON "public"."i_visible_audio_shaking" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_type_updated_at" BEFORE UPDATE ON "public"."user_type" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_asset_detail_id_fkey" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id");



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_asset_group_id_fkey" FOREIGN KEY ("asset_group_id") REFERENCES "public"."e_asset_group"("id");



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_asset_sce_id_fkey" FOREIGN KEY ("asset_sce_id") REFERENCES "public"."e_asset_sce"("id");



ALTER TABLE ONLY "public"."e_asset_attachment"
    ADD CONSTRAINT "e_asset_attachment_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_category"
    ADD CONSTRAINT "e_asset_category_e_asset_category_group_fk" FOREIGN KEY ("asset_category_group_id") REFERENCES "public"."e_asset_category_group"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_asset_sce_id_fkey" FOREIGN KEY ("sce_id") REFERENCES "public"."e_asset_sce"("id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_bom_id_fkey" FOREIGN KEY ("bom_id") REFERENCES "public"."e_bom_assembly"("id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_criticality_id_fkey" FOREIGN KEY ("criticality_id") REFERENCES "public"."e_criticality"("id");



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_asset_area_fk" FOREIGN KEY ("area_id") REFERENCES "public"."e_asset_area"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_asset_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."e_asset_category"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_asset_class_fk" FOREIGN KEY ("asset_class_id") REFERENCES "public"."e_asset_class"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_asset_type_fk" FOREIGN KEY ("type_id") REFERENCES "public"."e_asset_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_iot_sensor_fk" FOREIGN KEY ("iot_sensor_id") REFERENCES "public"."e_iot_sensor"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_detail"
    ADD CONSTRAINT "e_asset_detail_e_manufacturer_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."e_manufacturer"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_e_asset_status_fk" FOREIGN KEY ("status_id") REFERENCES "public"."e_asset_status"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_e_asset_tag_fk" FOREIGN KEY ("asset_tag_id") REFERENCES "public"."e_asset_tag"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_e_facility_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_e_package_fk" FOREIGN KEY ("package_id") REFERENCES "public"."e_package"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset"
    ADD CONSTRAINT "e_asset_e_system_fk" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_image"
    ADD CONSTRAINT "e_asset_image_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_installation"
    ADD CONSTRAINT "e_asset_installation_e_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_installation"
    ADD CONSTRAINT "e_asset_installation_e_detection_system_fk" FOREIGN KEY ("detection_system_class_id") REFERENCES "public"."e_detection_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_installation"
    ADD CONSTRAINT "e_asset_installation_e_isolation_service_class_fk" FOREIGN KEY ("isolation_service_class_id") REFERENCES "public"."e_isolation_service_class"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_sce"
    ADD CONSTRAINT "e_asset_sce_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_asset_type"
    ADD CONSTRAINT "e_asset_type_e_asset_category_fk" FOREIGN KEY ("asset_category_id") REFERENCES "public"."e_asset_category"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_asset_type"
    ADD CONSTRAINT "e_asset_type_e_asset_type_group_fk" FOREIGN KEY ("asset_type_group_id") REFERENCES "public"."e_asset_type_group"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_bom_assembly"
    ADD CONSTRAINT "e_bom_assembly_e_item_master_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_actual_labour"
    ADD CONSTRAINT "e_cm_actual_labour_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_actual_labour"
    ADD CONSTRAINT "e_cm_actual_labour_e_employee_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."e_employee"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_actual_material"
    ADD CONSTRAINT "e_cm_actual_material_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_actual_material"
    ADD CONSTRAINT "e_cm_actual_material_e_item_master_fk" FOREIGN KEY ("item_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_attachment"
    ADD CONSTRAINT "e_cm_attachment_cm_general_id_fkey" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_defer"
    ADD CONSTRAINT "e_cm_defer_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_defer"
    ADD CONSTRAINT "e_cm_defer_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_cm_finding"
    ADD CONSTRAINT "e_cm_finding_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id");



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_cm_sce_fk" FOREIGN KEY ("cm_sce_code") REFERENCES "public"."e_cm_sce"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_facility_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_new_work_request_fk" FOREIGN KEY ("work_request_id") REFERENCES "public"."e_new_work_request"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_package_fk" FOREIGN KEY ("package_id") REFERENCES "public"."e_package"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_priority_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."e_priority"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_system_fk" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_e_work_center_fk" FOREIGN KEY ("work_center_id") REFERENCES "public"."e_work_center"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_users_fk" FOREIGN KEY ("requested_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_general"
    ADD CONSTRAINT "e_cm_general_users_fk_1" FOREIGN KEY ("approved_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_report"
    ADD CONSTRAINT "e_cm_report_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_cm_report"
    ADD CONSTRAINT "e_cm_report_e_material_class_fk" FOREIGN KEY ("material_class_id") REFERENCES "public"."e_material_class"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_report"
    ADD CONSTRAINT "e_cm_report_e_shutdown_type_fk" FOREIGN KEY ("shutdown_type_id") REFERENCES "public"."e_shutdown_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_cm_task_detail"
    ADD CONSTRAINT "e_cm_task_detail_e_cm_general_fk" FOREIGN KEY ("cm_general_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_employee"
    ADD CONSTRAINT "e_employee_work_center_code_fkey" FOREIGN KEY ("work_center_code") REFERENCES "public"."e_work_center"("id");



ALTER TABLE ONLY "public"."e_facility"
    ADD CONSTRAINT "e_facility_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."e_project"("id");



ALTER TABLE ONLY "public"."e_frequency"
    ADD CONSTRAINT "e_frequency_e_frequency_type_fk" FOREIGN KEY ("frequency_type_id") REFERENCES "public"."e_frequency_type"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_adjustment"
    ADD CONSTRAINT "e_inventory_adjustment_e_adjustment_category_fk" FOREIGN KEY ("adjustment_category_id") REFERENCES "public"."e_adjustment_category"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_adjustment"
    ADD CONSTRAINT "e_inventory_adjustment_e_adjustment_type_fk" FOREIGN KEY ("adjustment_type_id") REFERENCES "public"."e_adjustment_type"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_adjustment"
    ADD CONSTRAINT "e_inventory_adjustment_e_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."e_inventory"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory"
    ADD CONSTRAINT "e_inventory_e_item_master_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_inventory"
    ADD CONSTRAINT "e_inventory_e_store_fk" FOREIGN KEY ("store_id") REFERENCES "public"."e_store"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_issue"
    ADD CONSTRAINT "e_inventory_issue_e_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."e_inventory"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_issue"
    ADD CONSTRAINT "e_inventory_issue_e_work_order_fk" FOREIGN KEY ("work_order_no") REFERENCES "public"."e_work_order"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_inventory"
    ADD CONSTRAINT "e_inventory_rack_id_fkey" FOREIGN KEY ("rack_id") REFERENCES "public"."e_rack"("id");



ALTER TABLE ONLY "public"."e_inventory_receive"
    ADD CONSTRAINT "e_inventory_receive_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_inventory_receive"
    ADD CONSTRAINT "e_inventory_receive_e_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."e_inventory"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_return"
    ADD CONSTRAINT "e_inventory_return_e_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."e_inventory"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_return"
    ADD CONSTRAINT "e_inventory_return_e_work_order_fk" FOREIGN KEY ("work_order_no") REFERENCES "public"."e_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_return"
    ADD CONSTRAINT "e_inventory_return_users_fk" FOREIGN KEY ("return_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_transfer"
    ADD CONSTRAINT "e_inventory_tansfer_e_employee_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."e_employee"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_inventory_transfer"
    ADD CONSTRAINT "e_inventory_tansfer_e_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."e_inventory"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_inventory_transfer"
    ADD CONSTRAINT "e_inventory_tansfer_e_store_fk" FOREIGN KEY ("store_id") REFERENCES "public"."e_store"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_iot_sensor"
    ADD CONSTRAINT "e_iot_sensor_e_client_fk" FOREIGN KEY ("client_id") REFERENCES "public"."e_client"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_iot_sensor"
    ADD CONSTRAINT "e_iot_sensor_e_manufacturer_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."e_manufacturer"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_iot_sensor"
    ADD CONSTRAINT "e_iot_sensor_e_sensor_type_fk" FOREIGN KEY ("sensor_type_id") REFERENCES "public"."e_sensor_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master_attachment"
    ADD CONSTRAINT "e_item_master_attachment_e_item_master_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_criticality_fk" FOREIGN KEY ("criticality_id") REFERENCES "public"."e_criticality"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_item_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."e_item_category"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_item_group_fk" FOREIGN KEY ("item_group") REFERENCES "public"."e_item_group"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_item_type_fk" FOREIGN KEY ("type_id") REFERENCES "public"."e_item_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_manufacturer_fk" FOREIGN KEY ("manufacturer") REFERENCES "public"."e_manufacturer"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_item_master"
    ADD CONSTRAINT "e_item_master_e_unit_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."e_unit"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_maintenance"
    ADD CONSTRAINT "e_maintenance_e_maintenance_type_fk" FOREIGN KEY ("maintenance_type_id") REFERENCES "public"."e_maintenance_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_new_work_attachment"
    ADD CONSTRAINT "e_new_work_attachment_e_new_work_request_fk" FOREIGN KEY ("work_request_id") REFERENCES "public"."e_new_work_request"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_new_work_failure"
    ADD CONSTRAINT "e_new_work_failure_e_new_work_request_fk" FOREIGN KEY ("work_request_id") REFERENCES "public"."e_new_work_request"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_new_work_failure"
    ADD CONSTRAINT "e_new_work_failure_failure_priority_id_fkey" FOREIGN KEY ("failure_priority_id") REFERENCES "public"."e_failure_priority"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_cm_sce_code_fkey" FOREIGN KEY ("cm_sce_code") REFERENCES "public"."e_cm_sce"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_cm_status_id_fkey" FOREIGN KEY ("cm_status_id") REFERENCES "public"."e_cm_status"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_maintenance_type_fkey" FOREIGN KEY ("maintenance_type") REFERENCES "public"."e_maintenance"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."e_package"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "public"."e_priority"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_wo_id_fkey" FOREIGN KEY ("wo_id") REFERENCES "public"."e_work_order"("id");



ALTER TABLE ONLY "public"."e_new_work_request"
    ADD CONSTRAINT "e_new_work_request_work_center_id_fkey" FOREIGN KEY ("work_center_id") REFERENCES "public"."e_work_center"("id");



ALTER TABLE ONLY "public"."e_new_work_task_detail"
    ADD CONSTRAINT "e_new_work_task_detail_e_new_work_request_fk" FOREIGN KEY ("new_work_request_id") REFERENCES "public"."e_new_work_request"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_package"
    ADD CONSTRAINT "e_package_e_package_type_fk" FOREIGN KEY ("package_type_id") REFERENCES "public"."e_package_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_package"
    ADD CONSTRAINT "e_package_e_system_fk" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_actual_labour"
    ADD CONSTRAINT "e_pm_actual_labour_e_employee_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."e_employee"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_actual_labour"
    ADD CONSTRAINT "e_pm_actual_labour_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_actual_material"
    ADD CONSTRAINT "e_pm_actual_material_e_item_master_fk" FOREIGN KEY ("item_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_actual_material"
    ADD CONSTRAINT "e_pm_actual_material_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_additional_info"
    ADD CONSTRAINT "e_pm_additional_info_pm_wo_id_fkey" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id");



ALTER TABLE ONLY "public"."e_pm_attachment"
    ADD CONSTRAINT "e_pm_attachment_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_checksheet"
    ADD CONSTRAINT "e_pm_checksheet_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_defer"
    ADD CONSTRAINT "e_pm_defer_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_defer"
    ADD CONSTRAINT "e_pm_defer_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_pm_group"
    ADD CONSTRAINT "e_pm_group_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_maintainable_group"
    ADD CONSTRAINT "e_pm_maintainable_group_pm_wo_id_fkey" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id");



ALTER TABLE ONLY "public"."e_pm_min_acceptance_criteria"
    ADD CONSTRAINT "e_pm_min_acceptance_criteria_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_plan_labour"
    ADD CONSTRAINT "e_pm_plan_labour_e_employee_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."e_employee"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_plan_labour"
    ADD CONSTRAINT "e_pm_plan_labour_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_plan_material"
    ADD CONSTRAINT "e_pm_plan_material_e_item_master_fk" FOREIGN KEY ("item_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_plan_material"
    ADD CONSTRAINT "e_pm_plan_material_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_report"
    ADD CONSTRAINT "e_pm_report_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_additional_info"
    ADD CONSTRAINT "e_pm_schedule_additional_info_pm_schedule_id_fkey" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_checksheet"
    ADD CONSTRAINT "e_pm_schedule_checksheet_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_asset_sce_fk" FOREIGN KEY ("pm_sce_group_id") REFERENCES "public"."e_asset_sce"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_discipline_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."e_discipline"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_facility_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_frequency_fk" FOREIGN KEY ("frequency_id") REFERENCES "public"."e_frequency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_maintenance_fk" FOREIGN KEY ("maintenance_id") REFERENCES "public"."e_maintenance"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_package_fk" FOREIGN KEY ("package_id") REFERENCES "public"."e_package"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_pm_group_fk" FOREIGN KEY ("pm_group_id") REFERENCES "public"."e_pm_group"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_priority_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."e_priority"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_system_fk" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_task_fk" FOREIGN KEY ("task_id") REFERENCES "public"."e_task"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule"
    ADD CONSTRAINT "e_pm_schedule_e_work_center_fk" FOREIGN KEY ("work_center_id") REFERENCES "public"."e_work_center"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule_maintainable_group"
    ADD CONSTRAINT "e_pm_schedule_maintainable_group_pm_schedule_id_fkey" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_min_acceptance_criteria"
    ADD CONSTRAINT "e_pm_schedule_min_acceptance_criteria_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_plan_labour"
    ADD CONSTRAINT "e_pm_schedule_plan_labour_employee_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."e_employee"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_plan_labour"
    ADD CONSTRAINT "e_pm_schedule_plan_labour_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_plan_material"
    ADD CONSTRAINT "e_pm_schedule_plan_material_item_fk" FOREIGN KEY ("item_id") REFERENCES "public"."e_item_master"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule_plan_material"
    ADD CONSTRAINT "e_pm_schedule_plan_material_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_schedule_task_detail"
    ADD CONSTRAINT "e_pm_schedule_task_detail_original_fk" FOREIGN KEY ("original_task_detail_id") REFERENCES "public"."e_task_detail"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule_task_detail"
    ADD CONSTRAINT "e_pm_schedule_task_detail_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_task_detail"
    ADD CONSTRAINT "e_pm_task_detail_e_pm_work_order_fk" FOREIGN KEY ("pm_wo_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_task_detail"
    ADD CONSTRAINT "e_pm_task_detail_original_fk" FOREIGN KEY ("original_task_detail_id") REFERENCES "public"."e_task_detail"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_task_detail"
    ADD CONSTRAINT "e_pm_task_detail_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_wo_generate"
    ADD CONSTRAINT "e_pm_wo_generate_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_pm_wo_generate"
    ADD CONSTRAINT "e_pm_wo_generate_pm_schedule_id_fkey" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id");



ALTER TABLE ONLY "public"."e_pm_wo_multiple_generate"
    ADD CONSTRAINT "e_pm_wo_multiple_generate_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_pm_wo_multiple_generate"
    ADD CONSTRAINT "e_pm_wo_multiple_generate_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "public"."e_frequency"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_wo_multiple_generate"
    ADD CONSTRAINT "e_pm_wo_multiple_generate_pm_schedule_id_fkey" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id");



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_asset_sce_fk" FOREIGN KEY ("asset_sce_code_id") REFERENCES "public"."e_asset_sce"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_discipline_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."e_discipline"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_facility_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_frequency_fk" FOREIGN KEY ("frequency_id") REFERENCES "public"."e_frequency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_maintenance_fk" FOREIGN KEY ("maintenance_id") REFERENCES "public"."e_maintenance"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_package_fk" FOREIGN KEY ("package_id") REFERENCES "public"."e_package"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_pm_group_fk" FOREIGN KEY ("pm_group_id") REFERENCES "public"."e_pm_group"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_pm_schedule_fk" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_priority_fk" FOREIGN KEY ("priority_id") REFERENCES "public"."e_priority"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_system_fk" FOREIGN KEY ("system_id") REFERENCES "public"."e_system"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_task_fk" FOREIGN KEY ("task_id") REFERENCES "public"."e_task"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_work_order"
    ADD CONSTRAINT "e_pm_work_order_e_work_center_fk" FOREIGN KEY ("work_center_id") REFERENCES "public"."e_work_center"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_project"
    ADD CONSTRAINT "e_project_e_client_fk" FOREIGN KEY ("client_id") REFERENCES "public"."e_client"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_project"
    ADD CONSTRAINT "e_project_e_project_type_fk" FOREIGN KEY ("project_type") REFERENCES "public"."e_project_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_spare_parts"
    ADD CONSTRAINT "e_spare_parts_bom_id_fkey" FOREIGN KEY ("bom_id") REFERENCES "public"."e_bom_assembly"("id");



ALTER TABLE ONLY "public"."e_spare_parts"
    ADD CONSTRAINT "e_spare_parts_item_master_id_fkey" FOREIGN KEY ("item_master_id") REFERENCES "public"."e_item_master"("id");



ALTER TABLE ONLY "public"."e_system"
    ADD CONSTRAINT "e_system_e_facility_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_task_detail"
    ADD CONSTRAINT "e_task_detail_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."e_task"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_task"
    ADD CONSTRAINT "e_task_e_discipline_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."e_discipline"("id") ON UPDATE SET NULL ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_wo_pm_schedule"
    ADD CONSTRAINT "e_wo_pm_schedule_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_wo_pm_schedule"
    ADD CONSTRAINT "e_wo_pm_schedule_pm_schedule_id_fkey" FOREIGN KEY ("pm_schedule_id") REFERENCES "public"."e_pm_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_wo_pm_schedule"
    ADD CONSTRAINT "e_wo_pm_schedule_pm_wo_generate_fkey" FOREIGN KEY ("pm_wo_generate") REFERENCES "public"."e_pm_wo_generate"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_wo_pm_schedule"
    ADD CONSTRAINT "e_wo_pm_schedule_wo_id_fkey" FOREIGN KEY ("wo_id") REFERENCES "public"."e_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id");



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_e_cm_general_fk" FOREIGN KEY ("cm_work_order_id") REFERENCES "public"."e_cm_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_e_pm_work_order_fk" FOREIGN KEY ("pm_work_order_id") REFERENCES "public"."e_pm_work_order"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_e_work_order_status_fk" FOREIGN KEY ("work_order_status_id") REFERENCES "public"."e_work_order_status"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_e_work_order_type_fk" FOREIGN KEY ("work_order_type") REFERENCES "public"."e_work_order_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "public"."e_facility"("id");



ALTER TABLE ONLY "public"."e_work_order"
    ADD CONSTRAINT "e_work_order_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."e_task"("id");



ALTER TABLE ONLY "public"."e_work_request_report"
    ADD CONSTRAINT "e_work_request_report_e_material_class_fk" FOREIGN KEY ("material_class_id") REFERENCES "public"."e_material_class"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_work_request_report"
    ADD CONSTRAINT "e_work_request_report_e_new_work_request_fk" FOREIGN KEY ("work_request_id") REFERENCES "public"."e_new_work_request"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."e_work_request_report"
    ADD CONSTRAINT "e_work_request_report_e_shutdown_type_fk" FOREIGN KEY ("shutdown_type_id") REFERENCES "public"."e_shutdown_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_code_sheet"
    ADD CONSTRAINT "i_code_sheet_ims_asset_type_id_fkey" FOREIGN KEY ("ims_asset_type_id") REFERENCES "public"."i_ims_asset_type"("id");



ALTER TABLE ONLY "public"."i_corrosion_factor"
    ADD CONSTRAINT "i_corrosion_factor_base_material_id_fkey" FOREIGN KEY ("base_material_id") REFERENCES "public"."i_material_construction"("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_corrosion_factor_id_fkey" FOREIGN KEY ("corrosion_factor_id") REFERENCES "public"."i_corrosion_factor"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_corrosion_group_id_fkey" FOREIGN KEY ("corrosion_group_id") REFERENCES "public"."i_corrosion_group"("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_external_environment_id_fkey" FOREIGN KEY ("external_environment_id") REFERENCES "public"."e_ext_env"("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_material_construction_id_fkey" FOREIGN KEY ("material_construction_id") REFERENCES "public"."i_spec_master"("id");



ALTER TABLE ONLY "public"."i_corrosion_study"
    ADD CONSTRAINT "i_corrosion_study_monitoring_method_id_fkey" FOREIGN KEY ("monitoring_method_id") REFERENCES "public"."i_corrosion_monitoring"("id");



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_i_data_confidence_fk" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_i_ims_design_fk" FOREIGN KEY ("i_ims_design_id") REFERENCES "public"."i_ims_design"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_i_ims_pof_assessment_general_fk" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_i_ims_protection_fk" FOREIGN KEY ("i_ims_protection_id") REFERENCES "public"."i_ims_protection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_df_cui"
    ADD CONSTRAINT "i_df_cui_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_i_data_confidence_fk" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_i_ims_design_fk" FOREIGN KEY ("i_ims_design_id") REFERENCES "public"."i_ims_design"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_i_ims_pof_assessment_general_fk" FOREIGN KEY ("ims_pof_asessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_i_ims_protection_fk" FOREIGN KEY ("i_ims_protection_id") REFERENCES "public"."i_ims_protection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_ext_clscc"
    ADD CONSTRAINT "i_df_ext_clscc_inspection_efficiency_id_fkey" FOREIGN KEY ("inspection_efficiency_id") REFERENCES "public"."i_inspection_efficiency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_i_data_confidence_fk" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_i_ims_design_fk" FOREIGN KEY ("i_ims_design_id") REFERENCES "public"."i_ims_design"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_i_ims_protection_fk" FOREIGN KEY ("i_ims_protection_id") REFERENCES "public"."i_ims_protection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_ims_pof_assessment_id_fkey" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_ext"
    ADD CONSTRAINT "i_df_ext_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_branch_diameter_fk" FOREIGN KEY ("brach_diameter_id") REFERENCES "public"."i_branch_diameter"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_corrective_action_fk" FOREIGN KEY ("corrective_action_id") REFERENCES "public"."i_corrective_action"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_cyclic_load_type_fk" FOREIGN KEY ("cyclic_load_type_id") REFERENCES "public"."i_cyclic_load_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_data_confidence_fk" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_ims_pof_assessment_general_fk" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_joint_branch_design_fk" FOREIGN KEY ("joint_branch_design_id") REFERENCES "public"."i_joint_branch_design"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_pipe_complexity_fk" FOREIGN KEY ("pipe_complexity_id") REFERENCES "public"."i_pipe_complexity"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_pipe_condition_fk" FOREIGN KEY ("pipe_condition_id") REFERENCES "public"."i_pipe_condition"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_previous_failure_fk" FOREIGN KEY ("previous_failure_id") REFERENCES "public"."i_previous_failure"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_shaking_frequency_fk" FOREIGN KEY ("shaking_frequency_id") REFERENCES "public"."i_shaking_frequency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_i_visible_audio_shaking_fk" FOREIGN KEY ("visible_audible_shaking_id") REFERENCES "public"."i_visible_audio_shaking"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_df_mfat"
    ADD CONSTRAINT "i_df_mfat_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_scc_scc"
    ADD CONSTRAINT "i_df_scc_scc_i_inspection_efficiency_fk" FOREIGN KEY ("inspection_efficiency_id") REFERENCES "public"."i_inspection_efficiency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_scc_scc"
    ADD CONSTRAINT "i_df_scc_scc_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_scc_scc"
    ADD CONSTRAINT "i_df_scc_scc_ims_pof_assessment_id_fkey" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id");



ALTER TABLE ONLY "public"."i_df_scc_scc"
    ADD CONSTRAINT "i_df_scc_scc_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_i_ims_pof_assessment_general_fk" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_i_ims_protection_fk" FOREIGN KEY ("i_ims_protection_id") REFERENCES "public"."i_ims_protection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_i_inspection_efficiency_fk" FOREIGN KEY ("inspection_efficiency_id") REFERENCES "public"."i_inspection_efficiency"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_i_steelscontent_fk" FOREIGN KEY ("steelscontent_id") REFERENCES "public"."i_steelscontent"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_scc_sohic"
    ADD CONSTRAINT "i_df_scc_sohic_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_i_data_confidence_fk" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_i_ims_design_id_fkey" FOREIGN KEY ("i_ims_design_id") REFERENCES "public"."i_ims_design"("id");



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_i_ims_pof_assessment_general_fk" FOREIGN KEY ("ims_pof_assessment_id") REFERENCES "public"."i_ims_pof_assessment_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_df_thin"
    ADD CONSTRAINT "i_df_thin_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_header_master"
    ADD CONSTRAINT "i_header_master_code_sheet_id_fkey" FOREIGN KEY ("code_sheet_id") REFERENCES "public"."i_code_sheet"("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_assessment_cof_area_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_prod"
    ADD CONSTRAINT "i_ims_cof_assessment_cof_prod_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_prod"
    ADD CONSTRAINT "i_ims_cof_assessment_cof_prod_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_prod"
    ADD CONSTRAINT "i_ims_cof_assessment_cof_prod_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_e_detection_system_fk" FOREIGN KEY ("det_sys_id") REFERENCES "public"."e_detection_system"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_e_isolation_system_fk" FOREIGN KEY ("iso_sys_id") REFERENCES "public"."e_isolation_system"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_e_mitigation_system_fk" FOREIGN KEY ("mitigation_system_id") REFERENCES "public"."e_mitigation_system"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_i_ims_service_fk" FOREIGN KEY ("ims_service_id") REFERENCES "public"."i_ims_service"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_cof_assessment_cof_area"
    ADD CONSTRAINT "i_ims_cof_asssessment_cof_area_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_ims_design"
    ADD CONSTRAINT "i_ims_design_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_design"
    ADD CONSTRAINT "i_ims_design_e_ext_env_fk" FOREIGN KEY ("ext_env_id") REFERENCES "public"."e_ext_env"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_design"
    ADD CONSTRAINT "i_ims_design_e_geometry_fk" FOREIGN KEY ("geometry_id") REFERENCES "public"."e_geometry"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_e_circuit_id_fk" FOREIGN KEY ("circuit_id") REFERENCES "public"."e_circuit"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_e_pipe_class_fk" FOREIGN KEY ("pipe_class_id") REFERENCES "public"."e_pipe_class"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_e_pipe_schedule_fk" FOREIGN KEY ("pipe_schedule_id") REFERENCES "public"."e_pipe_schedule"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_i_ims_asset_type_fk" FOREIGN KEY ("ims_asset_type_id") REFERENCES "public"."i_ims_asset_type"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_general"
    ADD CONSTRAINT "i_ims_general_material_construction_id_fkey" FOREIGN KEY ("material_construction_id") REFERENCES "public"."i_spec_master"("id");



ALTER TABLE ONLY "public"."i_ims_inspection_attachment"
    ADD CONSTRAINT "i_ims_inspection_attachment_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_inspection_attachment"
    ADD CONSTRAINT "i_ims_inspection_attachment_i_ims_inspection_fk" FOREIGN KEY ("ims_inspection_id") REFERENCES "public"."i_ims_inspection"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_inspection"
    ADD CONSTRAINT "i_ims_inspection_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_data_confidence_id_fkey" FOREIGN KEY ("data_confidence_id") REFERENCES "public"."i_data_confidence"("id");



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_e_coating_quality_fk" FOREIGN KEY ("coating_quality_id") REFERENCES "public"."e_coating_quality"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_i_ims_general_fk" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_pof_assessment_general"
    ADD CONSTRAINT "i_ims_pof_assessment_general_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_coating_quality_fk" FOREIGN KEY ("coating_quality_id") REFERENCES "public"."e_coating_quality"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_design_fabrication_fk" FOREIGN KEY ("design_fabrication_id") REFERENCES "public"."e_design_fabrication"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_detection_system_fk" FOREIGN KEY ("detection_system_id") REFERENCES "public"."e_detection_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_insulation_type_fk" FOREIGN KEY ("insulation_type_id") REFERENCES "public"."e_insulation_type"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_interface_fk" FOREIGN KEY ("interface_id") REFERENCES "public"."e_interface"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_isolation_system_fk" FOREIGN KEY ("isolation_system_id") REFERENCES "public"."e_isolation_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_mitigation_system_fk" FOREIGN KEY ("mitigation_system_id") REFERENCES "public"."e_mitigation_system"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_e_online_monitor_fk" FOREIGN KEY ("online_monitor") REFERENCES "public"."e_online_monitor"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_protection"
    ADD CONSTRAINT "i_ims_protection_i_insulation_complexity_fk" FOREIGN KEY ("insulation_complexity_id") REFERENCES "public"."i_insulation_complexity"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_attachment"
    ADD CONSTRAINT "i_ims_pv_attachment_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_rbi_general"
    ADD CONSTRAINT "i_ims_rbi_general_asset_detail_id_fkey" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id");



ALTER TABLE ONLY "public"."i_ims_rbi_general"
    ADD CONSTRAINT "i_ims_rbi_general_i_ims_design_fkey" FOREIGN KEY ("i_ims_design") REFERENCES "public"."i_ims_design"("id");



ALTER TABLE ONLY "public"."i_ims_rbi_general"
    ADD CONSTRAINT "i_ims_rbi_general_i_ims_general_id_fkey" FOREIGN KEY ("i_ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_ims_rbi_risk_irp"
    ADD CONSTRAINT "i_ims_rbi_risk_irp_asset_detail_id_fkey" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id");



ALTER TABLE ONLY "public"."i_ims_rbi_risk_irp"
    ADD CONSTRAINT "i_ims_rbi_risk_irp_ims_general_id_fkey" FOREIGN KEY ("ims_general_id") REFERENCES "public"."i_ims_general"("id");



ALTER TABLE ONLY "public"."i_ims_rbi_risk_irp"
    ADD CONSTRAINT "i_ims_rbi_risk_irp_ims_rbi_general_id_fkey" FOREIGN KEY ("ims_rbi_general_id") REFERENCES "public"."i_ims_rbi_general"("id");



ALTER TABLE ONLY "public"."i_ims_risk_irp"
    ADD CONSTRAINT "i_ims_risk__irp_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_risk_irp"
    ADD CONSTRAINT "i_ims_risk_irp_i_ims_rbi_risk_irp_fk" FOREIGN KEY ("rbi_risk_irp_id") REFERENCES "public"."i_ims_rbi_risk_irp"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_service"
    ADD CONSTRAINT "i_ims_service_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_service"
    ADD CONSTRAINT "i_ims_service_e_fluid_phase_fk" FOREIGN KEY ("fluid_phase_id") REFERENCES "public"."e_fluid_phase"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."i_ims_service"
    ADD CONSTRAINT "i_ims_service_e_fluid_representive_fk" FOREIGN KEY ("fluid_representive_id") REFERENCES "public"."e_fluid_representive"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_ims_service"
    ADD CONSTRAINT "i_ims_service_e_toxicity_fk" FOREIGN KEY ("toxicity_id") REFERENCES "public"."e_toxicity"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_inspection_data"
    ADD CONSTRAINT "i_inspection_data_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("asset_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."i_inventory_group"
    ADD CONSTRAINT "i_inventory_group_asset_detail_id_fkey" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset"("id");



ALTER TABLE ONLY "public"."i_spec_header_value"
    ADD CONSTRAINT "i_spec_header_value_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "public"."i_header_master"("id");



ALTER TABLE ONLY "public"."i_spec_header_value"
    ADD CONSTRAINT "i_spec_header_value_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "public"."i_spec_master"("id");



ALTER TABLE ONLY "public"."i_spec_master"
    ADD CONSTRAINT "i_spec_master_code_sheet_id_fkey" FOREIGN KEY ("code_sheet_id") REFERENCES "public"."i_code_sheet"("id");



ALTER TABLE ONLY "public"."e_new_work_failure"
    ADD CONSTRAINT "new_work_failure_e_new_work_failure_type_fk" FOREIGN KEY ("failure_type_id") REFERENCES "public"."e_new_work_failure_type"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_maintainable_group"
    ADD CONSTRAINT "pm_maintainable_group_e_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_maintainable_group"
    ADD CONSTRAINT "pm_maintainable_group_e_asset_group_fk" FOREIGN KEY ("group_id") REFERENCES "public"."e_asset_group"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule_maintainable_group"
    ADD CONSTRAINT "pm_schedule_maintainable_group_e_asset_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."e_asset"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."e_pm_schedule_maintainable_group"
    ADD CONSTRAINT "pm_schedule_maintainable_group_e_asset_group_fk" FOREIGN KEY ("group_id") REFERENCES "public"."e_asset_group"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_type"("id");



ALTER TABLE ONLY "public"."r_rms_uptime"
    ADD CONSTRAINT "r_rms_uptime_e_asset_detail_fk" FOREIGN KEY ("asset_detail_id") REFERENCES "public"."e_asset_detail"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."e_project"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_create_user"("user_email" "text", "user_full_name" "text", "user_type_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_create_user"("user_email" "text", "user_full_name" "text", "user_type_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_create_user"("user_email" "text", "user_full_name" "text", "user_type_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_update_user_password"("user_id" "uuid", "new_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_update_user_password"("user_id" "uuid", "new_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_update_user_password"("user_id" "uuid", "new_password" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."assign_user_to_project"("p_user_id" "uuid", "p_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."assign_user_to_project"("p_user_id" "uuid", "p_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."assign_user_to_project"("p_user_id" "uuid", "p_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_downtime"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_downtime"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_downtime"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_admin_user"("user_email" "text", "user_password" "text", "user_full_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_admin_user"("user_email" "text", "user_password" "text", "user_full_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_admin_user"("user_email" "text", "user_password" "text", "user_full_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."direct_query"("query_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."direct_query"("query_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."direct_query"("query_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."func_five"("p_new_work_order_id" integer, "p_pm_work_order_id" integer, "p_pm_schedule_id" integer, "p_wo_pm_schedule_id" integer, "p_next_due_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."func_five"("p_new_work_order_id" integer, "p_pm_work_order_id" integer, "p_pm_schedule_id" integer, "p_wo_pm_schedule_id" integer, "p_next_due_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_five"("p_new_work_order_id" integer, "p_pm_work_order_id" integer, "p_pm_schedule_id" integer, "p_wo_pm_schedule_id" integer, "p_next_due_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_four"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."func_four"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_four"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_many_master_wo"() TO "anon";
GRANT ALL ON FUNCTION "public"."func_many_master_wo"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_many_master_wo"() TO "service_role";



GRANT ALL ON FUNCTION "public"."func_many_one"("p_created_by" "uuid", "p_start_date" timestamp without time zone, "p_end_date" timestamp without time zone, "p_pm_schedule_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."func_many_one"("p_created_by" "uuid", "p_start_date" timestamp without time zone, "p_end_date" timestamp without time zone, "p_pm_schedule_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_many_one"("p_created_by" "uuid", "p_start_date" timestamp without time zone, "p_end_date" timestamp without time zone, "p_pm_schedule_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_many_three"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."func_many_three"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_many_three"("p_frequency_id" integer, "p_due_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_many_two"("p_pm_schedule_id" integer, "p_generate_id" integer, "p_created_by" "uuid", "p_due_date" timestamp without time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."func_many_two"("p_pm_schedule_id" integer, "p_generate_id" integer, "p_created_by" "uuid", "p_due_date" timestamp without time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_many_two"("p_pm_schedule_id" integer, "p_generate_id" integer, "p_created_by" "uuid", "p_due_date" timestamp without time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_master_wo"() TO "anon";
GRANT ALL ON FUNCTION "public"."func_master_wo"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_master_wo"() TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_work_order" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_work_order" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_work_order" TO "service_role";



GRANT ALL ON FUNCTION "public"."func_one"("p_schedule_id" integer, "p_created_by" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."func_one"("p_schedule_id" integer, "p_created_by" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_one"("p_schedule_id" integer, "p_created_by" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."func_three"("p_created_by" "uuid", "p_task_id" integer, "p_asset_id" integer, "p_description" "text", "p_due_date" timestamp without time zone, "p_pm_work_order_id" integer, "p_facility_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."func_three"("p_created_by" "uuid", "p_task_id" integer, "p_asset_id" integer, "p_description" "text", "p_due_date" timestamp without time zone, "p_pm_work_order_id" integer, "p_facility_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_three"("p_created_by" "uuid", "p_task_id" integer, "p_asset_id" integer, "p_description" "text", "p_due_date" timestamp without time zone, "p_pm_work_order_id" integer, "p_facility_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_two"("v_pm_wo_id" integer, "v_pm_schedule_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."func_two"("v_pm_wo_id" integer, "v_pm_schedule_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_two"("v_pm_wo_id" integer, "v_pm_schedule_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."func_update_wr_wo_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."func_update_wr_wo_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."func_update_wr_wo_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_pm_no"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_pm_no"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_pm_no"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_work_order_no"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_work_order_no"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_work_order_no"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_work_request_no"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_work_request_no"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_work_request_no"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_project_assigned_users"("p_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_project_assigned_users"("p_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_project_assigned_users"("p_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_table_columns"("param_table_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_table_columns"("param_table_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_table_columns"("param_table_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_assigned_projects"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_assigned_projects"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_assigned_projects"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_users_for_project_assignment"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_for_project_assignment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_for_project_assignment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_users_with_details"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_with_details"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_with_details"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_users_with_types"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_with_types"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_with_types"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_adjustment_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_adjustment_type_id" smallint, "p_adjustment_category_id" smallint, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."handle_adjustment_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_adjustment_type_id" smallint, "p_adjustment_category_id" smallint, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_adjustment_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_adjustment_type_id" smallint, "p_adjustment_category_id" smallint, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_issue_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."handle_issue_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_issue_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_receive_inventory"("p_inventory_id" bigint, "p_received_quantity" integer, "p_unit_price" numeric, "p_po_receive_no" "text", "p_created_by" "text", "p_created_at" timestamp without time zone, "p_remark" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_receive_inventory"("p_inventory_id" bigint, "p_received_quantity" integer, "p_unit_price" numeric, "p_po_receive_no" "text", "p_created_by" "text", "p_created_at" timestamp without time zone, "p_remark" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_receive_inventory"("p_inventory_id" bigint, "p_received_quantity" integer, "p_unit_price" numeric, "p_po_receive_no" "text", "p_created_by" "text", "p_created_at" timestamp without time zone, "p_remark" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_return_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."handle_return_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_return_inventory"("p_inventory_id" integer, "p_quantity" numeric, "p_work_order_no" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_transfer_inventory"("p_source_inventory_id" integer, "p_destination_store_id" integer, "p_quantity" numeric, "p_transfer_reason" "text", "p_employee_id" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."handle_transfer_inventory"("p_source_inventory_id" integer, "p_destination_store_id" integer, "p_quantity" numeric, "p_transfer_reason" "text", "p_employee_id" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_transfer_inventory"("p_source_inventory_id" integer, "p_destination_store_id" integer, "p_quantity" numeric, "p_transfer_reason" "text", "p_employee_id" integer, "p_created_by" "uuid", "p_remark" "text", "p_created_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."remove_user_from_project"("p_user_id" "uuid", "p_project_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."remove_user_from_project"("p_user_id" "uuid", "p_project_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_user_from_project"("p_user_id" "uuid", "p_project_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_rbi_no"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_rbi_no"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_rbi_no"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_copy_cm_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_copy_cm_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_copy_cm_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."e_client" TO "anon";
GRANT ALL ON TABLE "public"."e_client" TO "authenticated";
GRANT ALL ON TABLE "public"."e_client" TO "service_role";



GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_sce" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_sce" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_sce" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cm_sce_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cm_sce_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cm_sce_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_circuit" TO "anon";
GRANT ALL ON TABLE "public"."e_circuit" TO "authenticated";
GRANT ALL ON TABLE "public"."e_circuit" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Circuit_ID_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Circuit_ID_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Circuit_ID_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_coating_quality" TO "anon";
GRANT ALL ON TABLE "public"."e_coating_quality" TO "authenticated";
GRANT ALL ON TABLE "public"."e_coating_quality" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Coating_Quality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Coating_Quality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Coating_Quality_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_design_fabrication" TO "anon";
GRANT ALL ON TABLE "public"."e_design_fabrication" TO "authenticated";
GRANT ALL ON TABLE "public"."e_design_fabrication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Design_fabrication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Design_fabrication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Design_fabrication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_detection_system" TO "anon";
GRANT ALL ON TABLE "public"."e_detection_system" TO "authenticated";
GRANT ALL ON TABLE "public"."e_detection_system" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Detection_System_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Detection_System_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Detection_System_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_ext_env" TO "anon";
GRANT ALL ON TABLE "public"."e_ext_env" TO "authenticated";
GRANT ALL ON TABLE "public"."e_ext_env" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.EXT_ENV_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.EXT_ENV_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.EXT_ENV_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_geometry" TO "anon";
GRANT ALL ON TABLE "public"."e_geometry" TO "authenticated";
GRANT ALL ON TABLE "public"."e_geometry" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Geometry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Geometry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Geometry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_mitigation_system" TO "anon";
GRANT ALL ON TABLE "public"."e_mitigation_system" TO "authenticated";
GRANT ALL ON TABLE "public"."e_mitigation_system" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Mitigation_System_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Mitigation_System_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Mitigation_System_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_online_monitor" TO "anon";
GRANT ALL ON TABLE "public"."e_online_monitor" TO "authenticated";
GRANT ALL ON TABLE "public"."e_online_monitor" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Online_Monitor_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Online_Monitor_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Online_Monitor_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pipe_schedule" TO "anon";
GRANT ALL ON TABLE "public"."e_pipe_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pipe_schedule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.Pipe_Schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.Pipe_Schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.Pipe_Schedule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_insulation_type" TO "anon";
GRANT ALL ON TABLE "public"."e_insulation_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_insulation_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.insulation_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.insulation_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.insulation_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_interface" TO "anon";
GRANT ALL ON TABLE "public"."e_interface" TO "authenticated";
GRANT ALL ON TABLE "public"."e_interface" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e.interface_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e.interface_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e.interface_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_adjustment_category" TO "anon";
GRANT ALL ON TABLE "public"."e_adjustment_category" TO "authenticated";
GRANT ALL ON TABLE "public"."e_adjustment_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_adjustment_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_adjustment_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_adjustment_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_adjustment_type" TO "anon";
GRANT ALL ON TABLE "public"."e_adjustment_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_adjustment_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_adjustment_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_adjustment_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_adjustment_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset" TO "anon";
GRANT ALL ON TABLE "public"."e_asset" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_area" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_area" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_area" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_area_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_area_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_area_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_attachment" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_category" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_category" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_category" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_category_group" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_category_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_category_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_category_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_category_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_category_group_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_class" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_class" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_class" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_class_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_group" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_group_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_image" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_image" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_image" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_image_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_image_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_image_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_installation" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_installation" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_installation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_installation_int_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_installation_int_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_installation_int_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_sce" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_sce" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_sce" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_status" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_status" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_tag" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_tag" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_tag" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_tag_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_tag_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_tag_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_type" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_type" TO "service_role";



GRANT ALL ON TABLE "public"."e_asset_type_group" TO "anon";
GRANT ALL ON TABLE "public"."e_asset_type_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_asset_type_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_type_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_type_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_type_group_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_asset_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_asset_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_asset_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_bom_assembly" TO "anon";
GRANT ALL ON TABLE "public"."e_bom_assembly" TO "authenticated";
GRANT ALL ON TABLE "public"."e_bom_assembly" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_bom_assembly_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_bom_assembly_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_bom_assembly_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_actual_labour" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_actual_labour" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_actual_labour" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_actual_labour_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_actual_labour_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_actual_labour_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_actual_material" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_actual_material" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_actual_material" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_actual_material_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_actual_material_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_actual_material_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_attachment" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_defer" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_defer" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_defer" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_defer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_defer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_defer_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_finding" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_finding" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_finding" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_finding_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_finding_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_finding_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_general" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_general" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_general" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_general_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_general_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_general_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_report" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_report" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_report" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_report_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_report_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_report_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_status" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_status" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_cm_task_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_cm_task_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_cm_task_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_cm_task_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_cm_task_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_cm_task_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_criticality" TO "anon";
GRANT ALL ON TABLE "public"."e_criticality" TO "authenticated";
GRANT ALL ON TABLE "public"."e_criticality" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_criticality_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_criticality_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_criticality_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_discipline" TO "anon";
GRANT ALL ON TABLE "public"."e_discipline" TO "authenticated";
GRANT ALL ON TABLE "public"."e_discipline" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_discipline_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_discipline_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_discipline_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_employee" TO "anon";
GRANT ALL ON TABLE "public"."e_employee" TO "authenticated";
GRANT ALL ON TABLE "public"."e_employee" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_employee_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_employee_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_employee_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_facility" TO "anon";
GRANT ALL ON TABLE "public"."e_facility" TO "authenticated";
GRANT ALL ON TABLE "public"."e_facility" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_facility_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_facility_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_facility_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_failure_priority" TO "anon";
GRANT ALL ON TABLE "public"."e_failure_priority" TO "authenticated";
GRANT ALL ON TABLE "public"."e_failure_priority" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_failure_priority_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_failure_priority_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_failure_priority_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_fluid_phase" TO "anon";
GRANT ALL ON TABLE "public"."e_fluid_phase" TO "authenticated";
GRANT ALL ON TABLE "public"."e_fluid_phase" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_fluid_phase_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_fluid_phase_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_fluid_phase_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_fluid_representive" TO "anon";
GRANT ALL ON TABLE "public"."e_fluid_representive" TO "authenticated";
GRANT ALL ON TABLE "public"."e_fluid_representive" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_fluid_representive_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_fluid_representive_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_fluid_representive_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_frequency" TO "anon";
GRANT ALL ON TABLE "public"."e_frequency" TO "authenticated";
GRANT ALL ON TABLE "public"."e_frequency" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_frequency_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_frequency_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_frequency_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_frequency_type" TO "anon";
GRANT ALL ON TABLE "public"."e_frequency_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_frequency_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_frequency_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_frequency_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_frequency_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_general_maintenance" TO "anon";
GRANT ALL ON TABLE "public"."e_general_maintenance" TO "authenticated";
GRANT ALL ON TABLE "public"."e_general_maintenance" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_general_maintenance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_general_maintenance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_general_maintenance_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_ideal_gas_specific_heat_eq" TO "anon";
GRANT ALL ON TABLE "public"."e_ideal_gas_specific_heat_eq" TO "authenticated";
GRANT ALL ON TABLE "public"."e_ideal_gas_specific_heat_eq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ideal_gas_specific_heat_eq_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ideal_gas_specific_heat_eq_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ideal_gas_specific_heat_eq_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_prod" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_prod" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_prod" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_cof_assessment_cof_prod_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_cof_assessment_cof_prod_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_cof_assessment_cof_prod_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_area" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_area" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_cof_assessment_cof_area" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_cof_asssessment_cof_area_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_cof_asssessment_cof_area_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_cof_asssessment_cof_area_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_design" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_design" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_design" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_piping_design_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_design_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_design_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_general" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_general" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_general" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_piping_general_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_general_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_general_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_protection" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_protection" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_protection" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_piping_protection_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_protection_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_piping_protection_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_risk_irp" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_risk_irp" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_risk_irp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_ims_risk_&_irp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_ims_risk_&_irp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_ims_risk_&_irp_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory_adjustment" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory_adjustment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory_adjustment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_inventory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_inventory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_inventory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory_issue" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory_issue" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory_issue" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_inventory_issue_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_inventory_issue_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_inventory_issue_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory_receive" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory_receive" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory_receive" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_inventory_receive_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_inventory_receive_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_inventory_receive_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory_return" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory_return" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory_return" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_inventory_return_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_inventory_return_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_inventory_return_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_inventory_transfer" TO "anon";
GRANT ALL ON TABLE "public"."e_inventory_transfer" TO "authenticated";
GRANT ALL ON TABLE "public"."e_inventory_transfer" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_inventory_tansfer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_inventory_tansfer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_inventory_tansfer_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_iot_sensor" TO "anon";
GRANT ALL ON TABLE "public"."e_iot_sensor" TO "authenticated";
GRANT ALL ON TABLE "public"."e_iot_sensor" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_iot_sensor_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_iot_sensor_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_iot_sensor_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_isolation_service_class" TO "anon";
GRANT ALL ON TABLE "public"."e_isolation_service_class" TO "authenticated";
GRANT ALL ON TABLE "public"."e_isolation_service_class" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_isolation_service_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_isolation_service_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_isolation_service_class_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_isolation_system" TO "anon";
GRANT ALL ON TABLE "public"."e_isolation_system" TO "authenticated";
GRANT ALL ON TABLE "public"."e_isolation_system" TO "service_role";



GRANT ALL ON TABLE "public"."e_item_category" TO "anon";
GRANT ALL ON TABLE "public"."e_item_category" TO "authenticated";
GRANT ALL ON TABLE "public"."e_item_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_item_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_item_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_item_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_item_group" TO "anon";
GRANT ALL ON TABLE "public"."e_item_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_item_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_item_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_item_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_item_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_item_master" TO "anon";
GRANT ALL ON TABLE "public"."e_item_master" TO "authenticated";
GRANT ALL ON TABLE "public"."e_item_master" TO "service_role";



GRANT ALL ON TABLE "public"."e_item_master_attachment" TO "anon";
GRANT ALL ON TABLE "public"."e_item_master_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_item_master_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_item_master_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_item_master_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_item_master_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_item_type" TO "anon";
GRANT ALL ON TABLE "public"."e_item_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_item_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_item_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_item_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_item_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_maintenance" TO "anon";
GRANT ALL ON TABLE "public"."e_maintenance" TO "authenticated";
GRANT ALL ON TABLE "public"."e_maintenance" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_maintenance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_maintenance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_maintenance_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_maintenance_type" TO "anon";
GRANT ALL ON TABLE "public"."e_maintenance_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_maintenance_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_maintenance_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_maintenance_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_maintenance_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_manufacturer" TO "anon";
GRANT ALL ON TABLE "public"."e_manufacturer" TO "authenticated";
GRANT ALL ON TABLE "public"."e_manufacturer" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_manufacturer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_manufacturer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_manufacturer_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_material_class" TO "anon";
GRANT ALL ON TABLE "public"."e_material_class" TO "authenticated";
GRANT ALL ON TABLE "public"."e_material_class" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_material_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_material_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_material_class_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_material_construction" TO "anon";
GRANT ALL ON TABLE "public"."e_material_construction" TO "authenticated";
GRANT ALL ON TABLE "public"."e_material_construction" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_material_construction_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_material_construction_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_material_construction_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."e_new_work_attachment" TO "anon";
GRANT ALL ON TABLE "public"."e_new_work_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_new_work_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_new_work_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_new_work_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_new_work_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_new_work_failure" TO "anon";
GRANT ALL ON TABLE "public"."e_new_work_failure" TO "authenticated";
GRANT ALL ON TABLE "public"."e_new_work_failure" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_new_work_failure_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_new_work_failure_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_new_work_failure_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_new_work_failure_type" TO "anon";
GRANT ALL ON TABLE "public"."e_new_work_failure_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_new_work_failure_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_new_work_failure_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_new_work_failure_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_new_work_failure_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_new_work_request" TO "anon";
GRANT ALL ON TABLE "public"."e_new_work_request" TO "authenticated";
GRANT ALL ON TABLE "public"."e_new_work_request" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_new_work_request_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_new_work_request_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_new_work_request_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_new_work_task_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_new_work_task_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_new_work_task_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_new_work_task_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_new_work_task_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_new_work_task_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_nominal_bore_diameter" TO "anon";
GRANT ALL ON TABLE "public"."e_nominal_bore_diameter" TO "authenticated";
GRANT ALL ON TABLE "public"."e_nominal_bore_diameter" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_nominal_bore_diameter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_nominal_bore_diameter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_nominal_bore_diameter_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_package" TO "anon";
GRANT ALL ON TABLE "public"."e_package" TO "authenticated";
GRANT ALL ON TABLE "public"."e_package" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_package_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_package_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_package_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_package_type" TO "anon";
GRANT ALL ON TABLE "public"."e_package_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_package_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_package_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_package_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_package_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pipe_class" TO "anon";
GRANT ALL ON TABLE "public"."e_pipe_class" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pipe_class" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pipe_class_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pipe_class_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pipe_class_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_actual_labour" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_actual_labour" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_actual_labour" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_actual_labour_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_actual_labour_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_actual_labour_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_actual_material" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_actual_material" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_actual_material" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_actual_material_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_actual_material_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_actual_material_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_additional_info" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_additional_info" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_additional_info" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_additional_info_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_additional_info_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_additional_info_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_attachment" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_checksheet" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_checksheet" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_checksheet" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_checksheet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_checksheet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_checksheet_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_defer" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_defer" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_defer" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_defer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_defer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_defer_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_group" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_maintainable_group" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_maintainable_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_maintainable_group" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_min_acceptance_criteria" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_min_acceptance_criteria" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_min_acceptance_criteria" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_min_acceptance_criteria_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_min_acceptance_criteria_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_min_acceptance_criteria_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_plan_labour" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_plan_labour" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_plan_labour" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_plan_labour_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_plan_labour_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_plan_labour_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_plan_material" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_plan_material" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_plan_material" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_plan_material_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_plan_material_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_plan_material_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_report" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_report" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_report" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_report_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_report_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_report_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_sce_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_sce_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_sce_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_additional_info" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_additional_info" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_additional_info" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_additional_info_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_additional_info_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_additional_info_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_checksheet" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_checksheet" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_checksheet" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_checksheet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_checksheet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_checksheet_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_maintainable_group" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_maintainable_group" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_maintainable_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_maintainable_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_maintainable_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_maintainable_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_min_acceptance_criteria" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_min_acceptance_criteria" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_min_acceptance_criteria" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_min_acceptance_criteria_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_min_acceptance_criteria_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_min_acceptance_criteria_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_plan_labour" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_plan_labour" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_plan_labour" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_labour_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_labour_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_labour_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_plan_material" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_plan_material" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_plan_material" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_material_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_material_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_plan_material_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_schedule_task_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_schedule_task_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_schedule_task_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_schedule_task_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_task_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_schedule_task_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_task_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_task_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_task_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_task_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_task_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_task_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_wo_generate" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_wo_generate" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_wo_generate" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_wo_generate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_wo_generate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_wo_generate_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_pm_wo_multiple_generate" TO "anon";
GRANT ALL ON TABLE "public"."e_pm_wo_multiple_generate" TO "authenticated";
GRANT ALL ON TABLE "public"."e_pm_wo_multiple_generate" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_wo_multiple_generate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_wo_multiple_generate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_wo_multiple_generate_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pm_work_order_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pm_work_order_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pm_work_order_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_priority" TO "anon";
GRANT ALL ON TABLE "public"."e_priority" TO "authenticated";
GRANT ALL ON TABLE "public"."e_priority" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_priority_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_priority_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_priority_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_project" TO "anon";
GRANT ALL ON TABLE "public"."e_project" TO "authenticated";
GRANT ALL ON TABLE "public"."e_project" TO "service_role";



GRANT ALL ON TABLE "public"."e_project_type" TO "anon";
GRANT ALL ON TABLE "public"."e_project_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_project_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_project_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_project_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_project_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_inspection" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_inspection" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_inspection" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_pv_inspection_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_pv_inspection_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_pv_inspection_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_rack" TO "anon";
GRANT ALL ON TABLE "public"."e_rack" TO "authenticated";
GRANT ALL ON TABLE "public"."e_rack" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_rack_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_rack_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_rack_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_sensor_type" TO "anon";
GRANT ALL ON TABLE "public"."e_sensor_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_sensor_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_sensor_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_sensor_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_sensor_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_shutdown_type" TO "anon";
GRANT ALL ON TABLE "public"."e_shutdown_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_shutdown_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_shutdown_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_shutdown_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_shutdown_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_spare_parts" TO "anon";
GRANT ALL ON TABLE "public"."e_spare_parts" TO "authenticated";
GRANT ALL ON TABLE "public"."e_spare_parts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_spare_parts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_spare_parts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_spare_parts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_store" TO "anon";
GRANT ALL ON TABLE "public"."e_store" TO "authenticated";
GRANT ALL ON TABLE "public"."e_store" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_store_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_store_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_store_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_system" TO "anon";
GRANT ALL ON TABLE "public"."e_system" TO "authenticated";
GRANT ALL ON TABLE "public"."e_system" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_system_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_system_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_system_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_task" TO "anon";
GRANT ALL ON TABLE "public"."e_task" TO "authenticated";
GRANT ALL ON TABLE "public"."e_task" TO "service_role";



GRANT ALL ON TABLE "public"."e_task_detail" TO "anon";
GRANT ALL ON TABLE "public"."e_task_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."e_task_detail" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_task_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_task_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_task_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_toxicity" TO "anon";
GRANT ALL ON TABLE "public"."e_toxicity" TO "authenticated";
GRANT ALL ON TABLE "public"."e_toxicity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_toxicity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_toxicity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_toxicity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_unit" TO "anon";
GRANT ALL ON TABLE "public"."e_unit" TO "authenticated";
GRANT ALL ON TABLE "public"."e_unit" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_unit_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_unit_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_unit_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_wo_pm_schedule" TO "anon";
GRANT ALL ON TABLE "public"."e_wo_pm_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."e_wo_pm_schedule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_wo_pm_schedule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_wo_pm_schedule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_wo_pm_schedule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_work_center" TO "anon";
GRANT ALL ON TABLE "public"."e_work_center" TO "authenticated";
GRANT ALL ON TABLE "public"."e_work_center" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_work_center_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_work_center_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_work_center_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_work_order" TO "anon";
GRANT ALL ON TABLE "public"."e_work_order" TO "authenticated";
GRANT ALL ON TABLE "public"."e_work_order" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_work_order_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_work_order_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_work_order_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_work_order_status" TO "anon";
GRANT ALL ON TABLE "public"."e_work_order_status" TO "authenticated";
GRANT ALL ON TABLE "public"."e_work_order_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_work_order_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_work_order_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_work_order_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_work_order_type" TO "anon";
GRANT ALL ON TABLE "public"."e_work_order_type" TO "authenticated";
GRANT ALL ON TABLE "public"."e_work_order_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_work_order_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_work_order_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_work_order_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."e_work_request_report" TO "anon";
GRANT ALL ON TABLE "public"."e_work_request_report" TO "authenticated";
GRANT ALL ON TABLE "public"."e_work_request_report" TO "service_role";



GRANT ALL ON SEQUENCE "public"."e_work_request_report_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."e_work_request_report_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."e_work_request_report_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_asme_material_lookup" TO "anon";
GRANT ALL ON TABLE "public"."i_asme_material_lookup" TO "authenticated";
GRANT ALL ON TABLE "public"."i_asme_material_lookup" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_asme_material_lookup_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_asme_material_lookup_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_asme_material_lookup_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_branch_diameter" TO "anon";
GRANT ALL ON TABLE "public"."i_branch_diameter" TO "authenticated";
GRANT ALL ON TABLE "public"."i_branch_diameter" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_branch_diameter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_branch_diameter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_branch_diameter_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_code_sheet" TO "anon";
GRANT ALL ON TABLE "public"."i_code_sheet" TO "authenticated";
GRANT ALL ON TABLE "public"."i_code_sheet" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_code_sheet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_code_sheet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_code_sheet_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_corrective_action" TO "anon";
GRANT ALL ON TABLE "public"."i_corrective_action" TO "authenticated";
GRANT ALL ON TABLE "public"."i_corrective_action" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_corrective_action_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_corrective_action_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_corrective_action_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_corrosion_factor" TO "anon";
GRANT ALL ON TABLE "public"."i_corrosion_factor" TO "authenticated";
GRANT ALL ON TABLE "public"."i_corrosion_factor" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_corrosion_factor_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_corrosion_factor_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_corrosion_factor_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_corrosion_group" TO "anon";
GRANT ALL ON TABLE "public"."i_corrosion_group" TO "authenticated";
GRANT ALL ON TABLE "public"."i_corrosion_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_corrosion_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_corrosion_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_corrosion_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_corrosion_monitoring" TO "anon";
GRANT ALL ON TABLE "public"."i_corrosion_monitoring" TO "authenticated";
GRANT ALL ON TABLE "public"."i_corrosion_monitoring" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_corrosion_monitoring_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_corrosion_monitoring_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_corrosion_monitoring_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_corrosion_study" TO "anon";
GRANT ALL ON TABLE "public"."i_corrosion_study" TO "authenticated";
GRANT ALL ON TABLE "public"."i_corrosion_study" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_corrosion_study_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_corrosion_study_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_corrosion_study_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_cyclic_load_type" TO "anon";
GRANT ALL ON TABLE "public"."i_cyclic_load_type" TO "authenticated";
GRANT ALL ON TABLE "public"."i_cyclic_load_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_cyclic_load_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_cyclic_load_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_cyclic_load_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_data_confidence" TO "anon";
GRANT ALL ON TABLE "public"."i_data_confidence" TO "authenticated";
GRANT ALL ON TABLE "public"."i_data_confidence" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_data_confidence_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_data_confidence_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_data_confidence_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_cui" TO "anon";
GRANT ALL ON TABLE "public"."i_df_cui" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_cui" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_cui_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_cui_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_cui_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_ext" TO "anon";
GRANT ALL ON TABLE "public"."i_df_ext" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_ext" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_ext_clscc" TO "anon";
GRANT ALL ON TABLE "public"."i_df_ext_clscc" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_ext_clscc" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_ext_clscc_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_ext_clscc_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_ext_clscc_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_ext_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_ext_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_ext_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_mfat" TO "anon";
GRANT ALL ON TABLE "public"."i_df_mfat" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_mfat" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_mfat_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_mfat_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_mfat_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_scc_scc" TO "anon";
GRANT ALL ON TABLE "public"."i_df_scc_scc" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_scc_scc" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_scc_scc_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_scc_scc_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_scc_scc_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_scc_sohic" TO "anon";
GRANT ALL ON TABLE "public"."i_df_scc_sohic" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_scc_sohic" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_scc_sohic_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_scc_sohic_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_scc_sohic_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_df_thin" TO "anon";
GRANT ALL ON TABLE "public"."i_df_thin" TO "authenticated";
GRANT ALL ON TABLE "public"."i_df_thin" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_df_thin_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_df_thin_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_df_thin_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_env_severity" TO "anon";
GRANT ALL ON TABLE "public"."i_env_severity" TO "authenticated";
GRANT ALL ON TABLE "public"."i_env_severity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_env_severity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_env_severity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_env_severity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_header_master" TO "anon";
GRANT ALL ON TABLE "public"."i_header_master" TO "authenticated";
GRANT ALL ON TABLE "public"."i_header_master" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_header_master_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_header_master_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_header_master_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_asset_type" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_asset_type" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_asset_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_asset_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_asset_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_asset_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_attachment" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_inspection_attachment" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_inspection_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_inspection_attachment" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_inspection_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_inspection_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_inspection_attachment_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_pof_assessment_general" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_pof_assessment_general" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_pof_assessment_general" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_pof_assessment_general_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_pof_assessment_general_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_pof_assessment_general_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_service" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_service" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_service" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_pv_service_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_pv_service_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_pv_service_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_rbi_general" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_rbi_general" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_rbi_general" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_rbi_general_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_rbi_general_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_rbi_general_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_ims_rbi_risk_irp" TO "anon";
GRANT ALL ON TABLE "public"."i_ims_rbi_risk_irp" TO "authenticated";
GRANT ALL ON TABLE "public"."i_ims_rbi_risk_irp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_ims_rbi_risk_irp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_ims_rbi_risk_irp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_ims_rbi_risk_irp_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_inspection_data" TO "anon";
GRANT ALL ON TABLE "public"."i_inspection_data" TO "authenticated";
GRANT ALL ON TABLE "public"."i_inspection_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_inspection_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_inspection_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_inspection_data_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_inspection_efficiency" TO "anon";
GRANT ALL ON TABLE "public"."i_inspection_efficiency" TO "authenticated";
GRANT ALL ON TABLE "public"."i_inspection_efficiency" TO "service_role";



GRANT ALL ON TABLE "public"."i_insulation_complexity" TO "anon";
GRANT ALL ON TABLE "public"."i_insulation_complexity" TO "authenticated";
GRANT ALL ON TABLE "public"."i_insulation_complexity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_insulation_complexity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_insulation_complexity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_insulation_complexity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_insulation_condition" TO "anon";
GRANT ALL ON TABLE "public"."i_insulation_condition" TO "authenticated";
GRANT ALL ON TABLE "public"."i_insulation_condition" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_insulation_condition_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_insulation_condition_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_insulation_condition_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_inventory_group" TO "anon";
GRANT ALL ON TABLE "public"."i_inventory_group" TO "authenticated";
GRANT ALL ON TABLE "public"."i_inventory_group" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_inventory_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_inventory_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_inventory_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_joint_branch_design" TO "anon";
GRANT ALL ON TABLE "public"."i_joint_branch_design" TO "authenticated";
GRANT ALL ON TABLE "public"."i_joint_branch_design" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_joint_branch_design_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_joint_branch_design_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_joint_branch_design_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_lining_monitoring" TO "anon";
GRANT ALL ON TABLE "public"."i_lining_monitoring" TO "authenticated";
GRANT ALL ON TABLE "public"."i_lining_monitoring" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_lining_monitoring_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_lining_monitoring_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_lining_monitoring_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_lining_type" TO "anon";
GRANT ALL ON TABLE "public"."i_lining_type" TO "authenticated";
GRANT ALL ON TABLE "public"."i_lining_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_lining_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_lining_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_lining_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_material_construction" TO "anon";
GRANT ALL ON TABLE "public"."i_material_construction" TO "authenticated";
GRANT ALL ON TABLE "public"."i_material_construction" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_material_construction_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_material_construction_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_material_construction_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_pipe_complexity" TO "anon";
GRANT ALL ON TABLE "public"."i_pipe_complexity" TO "authenticated";
GRANT ALL ON TABLE "public"."i_pipe_complexity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_pipe_complexity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_pipe_complexity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_pipe_complexity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_pipe_condition" TO "anon";
GRANT ALL ON TABLE "public"."i_pipe_condition" TO "authenticated";
GRANT ALL ON TABLE "public"."i_pipe_condition" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_pipe_condition_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_pipe_condition_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_pipe_condition_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_previous_failure" TO "anon";
GRANT ALL ON TABLE "public"."i_previous_failure" TO "authenticated";
GRANT ALL ON TABLE "public"."i_previous_failure" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_previous_failure_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_previous_failure_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_previous_failure_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_shaking_frequency" TO "anon";
GRANT ALL ON TABLE "public"."i_shaking_frequency" TO "authenticated";
GRANT ALL ON TABLE "public"."i_shaking_frequency" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_shaking_frequency_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_shaking_frequency_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_shaking_frequency_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_spec_header_value" TO "anon";
GRANT ALL ON TABLE "public"."i_spec_header_value" TO "authenticated";
GRANT ALL ON TABLE "public"."i_spec_header_value" TO "service_role";



GRANT ALL ON TABLE "public"."i_spec_master" TO "anon";
GRANT ALL ON TABLE "public"."i_spec_master" TO "authenticated";
GRANT ALL ON TABLE "public"."i_spec_master" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_spec_master_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_spec_master_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_spec_master_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_steelscontent" TO "anon";
GRANT ALL ON TABLE "public"."i_steelscontent" TO "authenticated";
GRANT ALL ON TABLE "public"."i_steelscontent" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_steelscontent_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_steelscontent_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_steelscontent_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."i_visible_audio_shaking" TO "anon";
GRANT ALL ON TABLE "public"."i_visible_audio_shaking" TO "authenticated";
GRANT ALL ON TABLE "public"."i_visible_audio_shaking" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_visible_audio_shaking_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_visible_audio_shaking_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_visible_audio_shaking_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."inspection_efficiency_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."inspection_efficiency_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."inspection_efficiency_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."inventory_adjustment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."inventory_adjustment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."inventory_adjustment_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isolation_system_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isolation_system_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isolation_system_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."item_master_attachment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."item_master_attachment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."item_master_attachment_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pm_maintainable_group_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pm_maintainable_group_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pm_maintainable_group_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."project_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."r_rms_uptime" TO "anon";
GRANT ALL ON TABLE "public"."r_rms_uptime" TO "authenticated";
GRANT ALL ON TABLE "public"."r_rms_uptime" TO "service_role";



GRANT ALL ON SEQUENCE "public"."r_rms_uptime_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."r_rms_uptime_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."r_rms_uptime_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."task_detail_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."task_detail_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."task_detail_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_projects" TO "anon";
GRANT ALL ON TABLE "public"."user_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."user_projects" TO "service_role";



GRANT ALL ON TABLE "public"."user_type" TO "anon";
GRANT ALL ON TABLE "public"."user_type" TO "authenticated";
GRANT ALL ON TABLE "public"."user_type" TO "service_role";



GRANT ALL ON TABLE "public"."work_order_sequence" TO "anon";
GRANT ALL ON TABLE "public"."work_order_sequence" TO "authenticated";
GRANT ALL ON TABLE "public"."work_order_sequence" TO "service_role";



GRANT ALL ON TABLE "public"."work_request_sequence" TO "anon";
GRANT ALL ON TABLE "public"."work_request_sequence" TO "authenticated";
GRANT ALL ON TABLE "public"."work_request_sequence" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
