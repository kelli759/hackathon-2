/*
  # Initial Schema Setup for Patient Follow-up System

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `specialty` (text)
      - `created_at` (timestamp)
    
    - `patients`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `created_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `appointment_date` (timestamp)
      - `status` (text)
      - `notes` (text)
      - `follow_up_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  specialty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  appointment_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  follow_up_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Doctors are viewable by authenticated users"
  ON doctors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Patients are viewable by authenticated users"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Appointments are viewable by authenticated users"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Appointments can be updated by authenticated users"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Appointments can be inserted by authenticated users"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);