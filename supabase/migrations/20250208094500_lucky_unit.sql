/*
  # Create bookings and authentication tables

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `abo_number` (text, nullable)
      - `group_type` (text, nullable)
      - `referral_name` (text, nullable)
      - `diamond_name` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for public insert and admin read access
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  abo_number text,
  group_type text,
  referral_name text,
  diamond_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings
CREATE POLICY "Anyone can insert bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admin) can view bookings
CREATE POLICY "Authenticated users can view bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);