/*
  # Create Admin Helper Functions

  1. Functions
    - `delete_user` - Admin function to delete a user and cascade to all related data
    - `get_user_stats` - Get statistics about users and their activity

  2. Security
    - Functions check for admin role before execution
    - SECURITY DEFINER for elevated privileges on auth schema

  3. Notes
    - Used by UsersPage for user management
    - Cascading deletes handled by foreign key constraints
    - Additional cleanup can be added as needed
*/

-- Function to delete a user (admin only)
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Delete the user from auth.users (cascades to profiles and history tables)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
  total_users bigint,
  admin_count bigint,
  voter_mode_count bigint,
  professional_mode_count bigint,
  total_validations bigint,
  total_sentiments bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*) FROM profiles) as total_users,
    (SELECT count(*) FROM profiles WHERE role = 'admin') as admin_count,
    (SELECT count(*) FROM profiles WHERE mode = 'voter') as voter_mode_count,
    (SELECT count(*) FROM profiles WHERE mode = 'professional') as professional_mode_count,
    (SELECT count(*) FROM validation_history) as total_validations,
    (SELECT count(*) FROM sentiment_history) as total_sentiments;
END;
$$;
