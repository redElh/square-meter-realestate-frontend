-- Add original_role and linked_spaces columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS original_role VARCHAR DEFAULT NULL,
ADD COLUMN IF NOT EXISTS linked_spaces JSONB DEFAULT '[]'::jsonb;
