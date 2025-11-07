-- Add columns to click_logs for comprehensive tracking
ALTER TABLE click_logs
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS device TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 1;

-- Create a sessions table for tracking page views and sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  country TEXT,
  source TEXT,
  device TEXT,
  user_agent TEXT,
  page_views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  first_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions
CREATE POLICY "Anyone can view sessions"
ON public.sessions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert sessions"
ON public.sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
ON public.sessions
FOR UPDATE
USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON public.sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_session_id ON public.click_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_country ON public.click_logs(country);
CREATE INDEX IF NOT EXISTS idx_click_logs_source ON public.click_logs(source);