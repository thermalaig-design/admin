# Appointments Table Setup Instructions

## Overview
This document explains how to set up the appointments table in your Supabase database to enable the appointment management feature.

## Prerequisites
- Access to your Supabase dashboard
- The project must be set up and running

## Steps to Create Appointments Table

1. **Log in to Supabase Dashboard**
   - Go to https://app.supabase.com/
   - Log in with your credentials

2. **Navigate to SQL Editor**
   - In your project dashboard, click on "Database" in the left sidebar
   - Click on "SQL Editor" tab

3. **Create New Query**
   - Click on "New Query" button
   - Copy and paste the entire content from the `CREATE_APPOINTMENTS_TABLE.SQL` file

4. **Run the Query**
   - Click the "Run" button
   - Wait for the query to execute successfully

5. **Verify Creation**
   - Go to the "Table Editor" tab
   - You should see the `appointments` table in the list

## Restart Your Project (Important!)
After creating the table, you should restart your Supabase project to clear the schema cache:
- Go to "Settings" in the left sidebar
- Click on "Restart Project" under the General section
- Wait for the restart to complete

## Verification
Once the table is created, you can run the test script to verify the functionality:

```bash
node test_appointments.js
```

## Troubleshooting
If you encounter a "PGRST205" error (schema cache issue):
- Restart your Supabase project from the dashboard settings
- Wait a few minutes before testing again
- Clear your browser cache if using the dashboard

## Features
The appointments table includes:
- Patient information (name, phone, email, age, gender)
- Doctor information (ID, name, department)
- Appointment details (date, type, reason)
- Status tracking (Pending, Confirmed, Cancelled, Completed, Rescheduled)
- Medical history tracking
- Automatic timestamps (created_at, updated_at)
- Indexes for performance optimization
- Row Level Security (RLS) for data protection