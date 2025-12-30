-- Create a function to trigger certificate generation via webhook
CREATE OR REPLACE FUNCTION trigger_certificate_generation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if payment status changed to 'completed' and certificate not yet generated
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') AND (NEW.certificate_generated IS NULL OR NEW.certificate_generated = false) THEN
    -- Call the Edge Function via pg_net (HTTP request from database)
    PERFORM
      net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/generate-certificate',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object('registrationId', NEW.id::text)
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on registrations table
DROP TRIGGER IF EXISTS on_payment_completed ON registrations;
CREATE TRIGGER on_payment_completed
  AFTER UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_certificate_generation();
