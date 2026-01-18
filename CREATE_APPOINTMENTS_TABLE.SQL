-- Create appointments table in Supabase
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Allow all operations for authenticated users" ON public.appointments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for anon users" ON public.appointments
    FOR ALL USING (auth.role() = 'anon');