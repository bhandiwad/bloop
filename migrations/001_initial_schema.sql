-- Bloop Initial Database Schema Migration
-- This file can be used to initialize a fresh database

-- Enable UUID extension for generating random IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create deck_categories table
CREATE TABLE IF NOT EXISTS deck_categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id VARCHAR NOT NULL REFERENCES deck_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  family_safe BOOLEAN NOT NULL DEFAULT TRUE,
  locale TEXT DEFAULT 'en'
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id VARCHAR NOT NULL REFERENCES decks(id),
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  family_safe BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_decks_category_id ON decks(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_deck_id ON prompts(deck_id);
CREATE INDEX IF NOT EXISTS idx_decks_family_safe ON decks(family_safe);
CREATE INDEX IF NOT EXISTS idx_prompts_family_safe ON prompts(family_safe);

-- Comments for documentation
COMMENT ON TABLE deck_categories IS 'Categories for organizing game decks (Classic, Country, Games, etc.)';
COMMENT ON TABLE decks IS 'Individual game decks with themed questions';
COMMENT ON TABLE prompts IS 'Question-answer pairs for gameplay';
