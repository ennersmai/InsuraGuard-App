import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  try {
    const { registrationId } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch registration
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      throw new Error('Registration not found')
    }

    // Download PDF from storage
    const pdfPath = `certificates/${registrationId}/certificate.pdf`
    const { data: pdfBlob, error: downloadError } = await supabase.storage
      .from('insuraguard-documents')
      .download(pdfPath)

    if (downloadError) throw downloadError

    // Convert blob to base64
    const arrayBuffer = await pdfBlob.arrayBuffer()
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica', Arial, sans-serif; color: #3A3A3A; margin: 0; padding: 0; }
    .header { background: #E67E22; color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 40px 20px; max-width: 600px; margin: 0 auto; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { 
      display: inline-block;
      background: #E67E22; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 4px;
      margin: 20px 0;
    }
    .urn { 
      background: #f5f5f5; 
      padding: 15px; 
      border-left: 4px solid #E67E22; 
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
    }
    ul { line-height: 1.8; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px;">InsuraGuard</h1>
  </div>
  
  <div class="content">
    <h2 style="color: #3A3A3A;">Thank you for registering with InsuraGuard</h2>
    
    <p>Dear ${registration.full_name},</p>
    
    <p>Your clean energy system is now protected under our insurance-backed guarantee.</p>
    
    <div class="urn">
      Your Unique Reference Number: ${registration.urn}
    </div>
    
    <p>Your insurance certificate is attached to this email. Please keep it safe for your records.</p>
    
    <p><strong>Coverage Details:</strong></p>
    <ul>
      <li>Period: 10 years from ${new Date(registration.commissioning_date).toLocaleDateString('en-GB')}</li>
      <li>Insured Value: £${registration.system_cost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</li>
      <li>System: ${registration.system_description}</li>
    </ul>
    
    <p>If you need to make a claim, visit: <a href="${Deno.env.get('SITE_URL')}/claim" style="color: #E67E22;">insuraguard.com/claim</a></p>
    
    <p style="text-align: center;">
      <a href="${Deno.env.get('SITE_URL')}/dashboard" class="button">View Dashboard</a>
    </p>
    
    <p>Thank you for choosing InsuraGuard.</p>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Best regards,<br>
      The InsuraGuard Team
    </p>
  </div>
  
  <div class="footer">
    <p><strong>InsuraGuard</strong> - Protection you can trust for clean energy investments</p>
    <p>
      <a href="${Deno.env.get('SITE_URL')}/privacy" style="color: #666; text-decoration: none;">Privacy Policy</a> | 
      <a href="${Deno.env.get('SITE_URL')}/terms" style="color: #666; text-decoration: none;">Terms & Conditions</a>
    </p>
  </div>
</body>
</html>
    `

    // Send via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: registration.email, name: registration.full_name }],
        }],
        from: { 
          email: 'noreply@insuraguard.com', 
          name: 'InsuraGuard' 
        },
        subject: `Your InsuraGuard Certificate - ${registration.urn}`,
        content: [{ 
          type: 'text/html', 
          value: emailHtml 
        }],
        attachments: [{
          content: base64Pdf,
          filename: `InsuraGuard_Certificate_${registration.urn}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SendGrid error: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ sent: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
