/*
  # Create Sentiment History Table

  1. New Tables
    - `sentiment_history`
      - `id` (uuid, primary key) - Unique record ID
      - `user_id` (uuid, foreign key to auth.users) - Owner of the analysis
      - `topic` (text) - The topic analyzed for sentiment
      - `positive` (integer) - Count of positive posts
      - `neutral` (integer) - Count of neutral posts
      - `negative` (integer) - Count of negative posts
      - `total_posts` (integer) - Total posts analyzed (sum of above)
      - `explanation` (text) - Summary of sentiment analysis
      - `quotes` (jsonb, nullable) - Sample quotes with sentiment labels
      - `sources` (jsonb, nullable) - Array of source objects (professional mode)
      - `created_at` (timestamptz) - Analysis timestamp

  2. Security
    - Enable RLS on `sentiment_history` table
    - Policy: Users can view their own sentiment history
    - Policy: Users can insert their own sentiment records
    - Policy: Users can delete their own sentiment records
    - Policy: Admins can view all sentiment history

  3. Notes
    - Stores sentiment analysis results for topics
    - JSONB fields for flexible data structure (quotes, sources)
    - Indexed by user_id and created_at for efficient queries
    - Total_posts should equal positive + neutral + negative
*/

-- Create sentiment_history table
CREATE TABLE IF NOT EXISTS sentiment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  positive integer NOT NULL DEFAULT 0 CHECK (positive >= 0),
  neutral integer NOT NULL DEFAULT 0 CHECK (neutral >= 0),
  negative integer NOT NULL DEFAULT 0 CHECK (negative >= 0),
  total_posts integer NOT NULL DEFAULT 0 CHECK (total_posts >= 0),
  explanation text DEFAULT '',
  quotes jsonb,
  sources jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sentiment_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view own sentiment history"
  ON sentiment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own records
CREATE POLICY "Users can insert own sentiment records"
  ON sentiment_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own records
CREATE POLICY "Users can delete own sentiment records"
  ON sentiment_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can view all sentiment history
CREATE POLICY "Admins can view all sentiment history"
  ON sentiment_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sentiment_history_user_id ON sentiment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_created_at ON sentiment_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_user_created ON sentiment_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_topic ON sentiment_history(topic);
