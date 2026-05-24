-- Legacy: databases created before translated_summary was removed from 001.
ALTER TABLE resources DROP COLUMN IF EXISTS translated_summary;
