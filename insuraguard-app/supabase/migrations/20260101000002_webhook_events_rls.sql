-- Enable RLS on webhook_events table
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for webhook_events
-- Only service role can manage webhook events (since webhooks are server-side)
CREATE POLICY "Service role can manage webhook events" ON webhook_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- No read access for regular users - webhook events are internal system data
