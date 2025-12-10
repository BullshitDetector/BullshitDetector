/*
  # Create Validation History Table

  1. New Tables
    - `validation_history`
      - `id` (uuid, primary key) - Unique record ID
      - `user_id` (uuid, foreign key to auth.users) - Owner of the validation
      - `claim` (text) - The claim that was validated
      - `verdict` (text) - Result: bullshit, mostly true, or neutral
      - `score` (numeric) - Confidence score (0-1)
      - `mode` (text) - Mode used: voter or professional
      - `explanation` (text) - AI analysis explanation
      - `risk_assessment` (text, nullable) - Risk level (professional mode only)
      - `sources` (jsonb, nullable) - Array of source objects (professional mode)
      - `sentiment` (jsonb, nullable) - Sentiment breakdown (professional mode)
      - `created_at` (timestamptz) - Validation timestamp

  2. Security
    - Enable RLS on `validation_history` table
    - Policy: Users can view their own validation history
    - Policy: Users can insert their own validation records
    - Policy: Users can delete their own validation records
    - Policy: Admins can view all validation history

  3. Notes
    - Stores both voter and professional mode validations
    - JSONB fields for flexible data structure (sources, sentiment)
    - Indexed by user_id and created_at for efficient queries
*/

-- Create validation_history table
CREATE TABLE IF NOT EXISTS validation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim text NOT NULL,
  verdict text NOT NULL CHECK (verdict IN ('bullshit', 'mostly true', 'neutral')),
  score numeric NOT NULL CHECK (score >= 0 AND score <= 1),
  mode text NOT NULL CHECK (mode IN ('voter', 'professional')),
  explanation text DEFAULT '',
  risk_assessment text,
  sources jsonb,
  sentiment jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE validation_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view own validation history"
  ON validation_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own records
CREATE POLICY "Users can insert own validation records"
  ON validation_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own records
CREATE POLICY "Users can delete own validation records"
  ON validation_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can view all validation history
CREATE POLICY "Admins can view all validation history"
  ON validation_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_validation_history_user_id ON validation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_validation_history_created_at ON validation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_validation_history_user_created ON validation_history(user_id, created_at DESC);
