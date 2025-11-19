-- First migration: Add new enum values
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'non_editing_teacher';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student';