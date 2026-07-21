-- Add reset_token and reset_token_expires columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
