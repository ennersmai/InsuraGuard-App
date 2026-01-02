import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      claimId,
      customerName,
      customerEmail,
      urn,
      claimDescription,
      paymentAmount
    } = await req.json()

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    if (!SENDGRID_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'SendGrid API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Helvetica', Arial, sans-serif; color: #3A3A3A; margin: 0; padding: 0; }
      .header { background: white; padding: 30px 20px; text-align: center; border-bottom: 3px solid #E67E22; }
      .logo { font-size: 32px; font-weight: bold; margin: 0; }
      .logo-black { color: #000000; }
      .logo-orange { color: #E67E22; }
      .content { padding: 40px 20px; max-width: 600px; margin: 0 auto; }
      .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      .claim-box { background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #E67E22; margin: 20px 0; }
      .info-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
      .info-section p { margin: 8px 0; line-height: 1.6; }
      .highlight { color: #E67E22; font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
    <div class="header">
      <h1 class="logo"><span class="logo-black">Insura</span><span class="logo-orange">Guard</span></h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">Claim Submitted Successfully</p>
    </div>

    <div class="content">
      <p>Dear ${customerName},</p>
      
      <p>Thank you for submitting your claim. We have received your claim and payment successfully.</p>

      <div class="claim-box">
        <p style="margin: 0;"><strong>Your Claim Reference:</strong></p>
        <p class="highlight" style="margin: 10px 0 0 0;">${claimId}</p>
      </div>

      <div class="info-section">
        <p><strong>Claim Details:</strong></p>
        <p><strong>URN:</strong> ${urn}</p>
        <p><strong>Excess Fee Paid:</strong> £${(paymentAmount / 100).toFixed(2)}</p>
        <p><strong>Status:</strong> Under Review</p>
      </div>

      <p><strong>What happens next?</strong></p>
      <ul style="line-height: 1.8;">
        <li>Our team will review your claim within <strong>2 working days</strong></li>
        <li>We may contact you if we need any additional information</li>
        <li>You will be notified of the outcome via email</li>
        <li>You can track your claim status in your dashboard</li>
      </ul>

      <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #E67E22;">
        <strong>Important:</strong> Please keep your claim reference number (${claimId}) for your records. You may need it when contacting us about your claim.
      </p>

      <p style="margin-top: 30px;">If you have any questions about your claim, please don't hesitate to contact us at <a href="mailto:support@insuraguard.co.uk" style="color: #E67E22;">support@insuraguard.co.uk</a></p>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Best regards,<br>
        The InsuraGuard Claims Team
      </p>
    </div>

    <div class="footer">
      <p><strong>InsuraGuard</strong> - Protection you can trust for clean energy investments</p>
      <p>
        <a href="${Deno.env.get('SITE_URL')}/dashboard" style="color: #666; text-decoration: none;">View Dashboard</a> | 
        <a href="${Deno.env.get('SITE_URL')}/terms" style="color: #666; text-decoration: none;">Terms & Conditions</a>
      </p>
    </div>
</body>
</html>
    `

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: customerEmail, name: customerName }],
        }],
        from: { email: 'support@insuraguard.co.uk', name: 'InsuraGuard' },
        subject: `Claim Submitted - Reference ${claimId}`,
        content: [{
          type: 'text/html',
          value: emailContent,
        }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid error response:', errorText)
      throw new Error(`SendGrid error: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Claim confirmation email sent' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error sending claim confirmation email:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
