#!/usr/bin/env node

/**
 * Create appointments table in Supabase if it doesn't exist
 */

import { createClient } from '@supabase/supabase-js';

// Frontend project credentials
const frontendUrl = 'https://zcbjiozbymrymrhovlgm.supabase.co';
const frontendKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYmppb3pieW1yeW1yaG92bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTI5MjksImV4cCI6MjA4MzcyODkyOX0.4GhckSCPsqol2fTlSZM9DQy3CY5ARii0mhD8taQvB-8';

console.log('🔧 Creating appointments table if it does not exist...\n');

const supabase = createClient(frontendUrl, frontendKey);

async function createTable() {
  console.log('Step 1: Checking if table exists...');
  
  // SQL to create the appointments table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.appointments (
      id SERIAL NOT NULL,
      patient_name CHARACTER VARYING(100) NOT NULL,
      patient_phone CHARACTER VARYING(15) NOT NULL,
      patient_email CHARACTER VARYING(100) NULL,
      patient_age INTEGER NULL,
      patient_gender CHARACTER VARYING(10) NULL,
      membership_number TEXT NULL,
      address TEXT NULL,
      doctor_id TEXT NOT NULL,
      doctor_name CHARACTER VARYING(100) NOT NULL,
      department CHARACTER VARYING(100) NULL,
      appointment_date DATE NOT NULL,
      appointment_type CHARACTER VARYING(50) NULL DEFAULT 'General Consultation'::CHARACTER VARYING,
      status CHARACTER VARYING(20) NULL DEFAULT 'Pending'::CHARACTER VARYING,
      reason TEXT NOT NULL,
      medical_history TEXT NULL,
      user_type CHARACTER VARYING(50) NULL,
      user_id BIGINT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT NOW(),
      CONSTRAINT appointments_pkey PRIMARY KEY (id),
      CONSTRAINT appointments_status_check CHECK (
        (
          (status)::TEXT = ANY (
            (
              ARRAY[
                'Pending'::CHARACTER VARYING,
                'Confirmed'::CHARACTER VARYING,
                'Cancelled'::CHARACTER VARYING,
                'Completed'::CHARACTER VARYING,
                'Rescheduled'::CHARACTER VARYING
              ]
            )::TEXT[]
          )
        )
      )
    ) TABLESPACE pg_default;

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON public.appointments USING btree (patient_phone) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments USING btree (doctor_id) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date ON public.appointments USING btree (appointment_date) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments USING btree (status) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments USING btree (created_at) TABLESPACE pg_default;

    -- Create trigger function for updating updated_at
    CREATE OR REPLACE FUNCTION update_appointments_updated_at()
     RETURNS TRIGGER
     LANGUAGE plpgsql
    AS $function$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $function$;

    -- Create trigger
    CREATE TRIGGER update_appointments_updated_at_trigger 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_appointments_updated_at();

    -- Disable RLS temporarily for setup
    ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;

    -- Grant permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO anon;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
    GRANT USAGE, SELECT ON SEQUENCE public.appointments_id_seq TO anon, authenticated;
  `;

  try {
    // Check if table exists by querying information_schema
    try {
      const { error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .limit(1);
      
      if (!checkError) {
        console.log('✅ Table already exists and is accessible!');
        return;
      }
    } catch {
      console.log('Table does not exist, need to create it via SQL Editor in Supabase Dashboard');
    }
    
    console.log('Table does not exist, need to create it via SQL Editor in Supabase Dashboard');
    console.log('\n📋 Please follow these steps:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Create a new query');
    console.log('3. Copy and paste this SQL:');
    console.log('\n--- COPY FROM HERE ---');
    console.log(createTableSQL);
    console.log('--- COPY TO HERE ---');
    console.log('\n4. Click RUN');
    console.log('5. After successful creation, restart your project');
  } catch (err) {
    console.log('❌ Error during table creation process:', err.message);
    console.log('\n📋 Manual solution required:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Create a new query');
    console.log('3. Copy and paste the SQL shown above');
    console.log('4. Click RUN');
  }
  
  console.log('\n💡 Pro tip: After creating the table in Supabase,');
  console.log('   restart your project in Supabase Dashboard → Settings → General → Restart Project');
}

createTable();