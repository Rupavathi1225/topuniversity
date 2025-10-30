-- Create click_logs table to track all user clicks
CREATE TABLE public.click_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  lid integer NOT NULL,
  link text NOT NULL,
  click_time timestamp with time zone NOT NULL DEFAULT now(),
  time_spent integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.click_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert clicks (public tracking)
CREATE POLICY "Anyone can insert click logs"
ON public.click_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to read clicks (for analytics)
CREATE POLICY "Anyone can view click logs"
ON public.click_logs
FOR SELECT
TO anon, authenticated
USING (true);

-- Create index for better query performance
CREATE INDEX idx_click_logs_session_id ON public.click_logs(session_id);
CREATE INDEX idx_click_logs_lid ON public.click_logs(lid);
CREATE INDEX idx_click_logs_click_time ON public.click_logs(click_time DESC);