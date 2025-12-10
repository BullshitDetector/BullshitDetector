/*
  # Create SMTP Configuration Table

  1. New Tables
    - `smtp_config`
      - `id` (uuid, primary key) - Unique config ID
      - `host` (text) - SMTP server hostname
      - `port` (integer) - SMTP port (usually 587 or 465)
      - `username` (text) - SMTP username/email
      - `password` (text) - SMTP password (encrypted at application level)
      - `secure` (boolean) - Use SSL/TLS
      - `updated_by` (uuid, foreign key to auth.users) - Admin who last updated
      - `created_at` (timestamptz) - Config creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `smtp_config` table
    - Policy: Only admins can read SMTP config
    - Policy: Only admins can insert/update SMTP config
    - Single-row table (only one config allowed)

  3. Notes
    - Admin-only access for security
    - Used for sending email notifications
    - Password should be encrypted before storage
    - Consider using secrets management in production
*/

-- Create smtp_config table (single-row config)
CREATE TABLE IF NOT EXISTS smtp_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL DEFAULT '',
  port integer NOT NULL DEFAULT 587 CHECK (port > 0 AND port <= 65535),
  username text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  secure boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE smtp_config ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read SMTP config
CREATE POLICY "Admins can read SMTP config"
  ON smtp_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can insert SMTP config
CREATE POLICY "Admins can insert SMTP config"
  ON smtp_config FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can update SMTP config
CREATE POLICY "Admins can update SMTP config"
  ON smtp_config FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_smtp_config_updated_at'
  ) THEN
    CREATE TRIGGER update_smtp_config_updated_at
      BEFORE UPDATE ON smtp_config
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
