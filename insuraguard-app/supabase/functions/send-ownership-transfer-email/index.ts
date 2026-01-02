import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { registrationId, transferId, newOwnerEmail, previousOwnerEmail } = await req.json()

    if (!registrationId || !transferId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID and Transfer ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      return new Response(
        JSON.stringify({ error: 'Registration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get transfer details
    const { data: transfer, error: transferError } = await supabase
      .from('ownership_transfers')
      .select('*')
      .eq('id', transferId)
      .single()

    if (transferError || !transfer) {
      return new Response(
        JSON.stringify({ error: 'Transfer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
    const siteUrl = Deno.env.get('SITE_URL') || 'https://insuraguard.co.uk'

    // Format transfer date
    const transferDate = new Date(transfer.completed_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    // Email to new owner
    const newOwnerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ownership Transfer Complete</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${siteUrl}/InsuraGuard-logo-transparent-1200.png" alt="InsuraGuard" style="height: 50px;">
        </div>
        
        <h1 style="color: #2D3748; margin-bottom: 20px;">Welcome to InsuraGuard!</h1>
        
        <p>Dear ${transfer.new_owner_name},</p>
        
        <p>The ownership transfer for the following system has been completed successfully. You are now the registered owner of this InsuraGuard protection.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2D3748; margin-top: 0;">Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">URN:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${registration.urn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">System Type:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${registration.system_type || 'Solar/Battery'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Transfer Date:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${transferDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Admin Fee Paid:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">£${transfer.payment_amount?.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <p><strong>Important:</strong> Please keep your URN safe. You will need it to:</p>
        <ul>
          <li>Submit claims</li>
          <li>Verify your coverage</li>
          <li>Transfer ownership in the future</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/verify" style="background: #F6A623; color: #2D3748; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Your Registration</a>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:support@insuraguard.co.uk">support@insuraguard.co.uk</a>.</p>
        
        <p>Best regards,<br>The InsuraGuard Team</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p> InsuraGuard. All rights reserved.</p>
          <p>Floor 10, City Tower, Piccadilly Plaza, New York Street, Manchester, M1 4BT</p>
        </div>
      </body>
      </html>
    `

    // Email to previous owner
    const previousOwnerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ownership Transfer Complete</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${siteUrl}/InsuraGuard-logo-transparent-1200.png" alt="InsuraGuard" style="height: 50px;">
        </div>
        
        <h1 style="color: #2D3748; margin-bottom: 20px;">Ownership Transfer Complete</h1>
        
        <p>Dear ${transfer.previous_owner_name},</p>
        
        <p>This email confirms that the ownership transfer for your InsuraGuard registration has been completed successfully.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2D3748; margin-top: 0;">Transfer Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">URN:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${registration.urn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">New Owner:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${registration.owner_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Transfer Date:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: bold;">${transferDate}</td>
            </tr>
          </table>
        </div>
        
        <p>You are no longer the registered owner of this InsuraGuard protection. If you believe this transfer was made in error, please contact us immediately.</p>
        
        <p>Thank you for being an InsuraGuard customer.</p>
        
        <p>Best regards,<br>The InsuraGuard Team</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p> InsuraGuard. All rights reserved.</p>
          <p>Floor 10, City Tower, Piccadilly Plaza, New York Street, Manchester, M1 4BT</p>
        </div>
      </body>
      </html>
    `

    // Support notification email with InsuraGuard branding
    const supportHtml = `
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
          .section { margin-bottom: 30px; }
          .section h3 { color: #E67E22; margin-bottom: 15px; font-size: 18px; }
          .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #E67E22; }
          .info-box p { margin: 8px 0; line-height: 1.6; }
          .highlight { background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #E67E22; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="logo"><span class="logo-black">Insura</span><span class="logo-orange">Guard</span></h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">Ownership Transfer Completed</p>
        </div>

        <div class="content">
          <p>An ownership transfer has been completed successfully.</p>

          <div class="highlight">
            <p><strong>Transfer ID:</strong> ${transferId}</p>
            <p><strong>URN:</strong> ${registration.urn}</p>
            <p><strong>Admin Fee Paid:</strong> £${transfer.payment_amount?.toFixed(2)}</p>
            <p><strong>Transfer Date:</strong> ${transferDate}</p>
          </div>

          <div class="section">
            <h3>Previous Owner</h3>
            <div class="info-box">
              <p><strong>Name:</strong> ${transfer.previous_owner_name || 'N/A'}</p>
              <p><strong>Email:</strong> ${previousOwnerEmail || 'N/A'}</p>
            </div>
          </div>

          <div class="section">
            <h3>New Owner</h3>
            <div class="info-box">
              <p><strong>Name:</strong> ${registration.full_name}</p>
              <p><strong>Email:</strong> ${newOwnerEmail}</p>
              <p><strong>Phone:</strong> ${registration.phone || 'Not provided'}</p>
              <p><strong>Address:</strong> ${registration.installation_address || 'Not provided'}</p>
            </div>
          </div>

          <div class="section">
            <h3>System Details</h3>
            <div class="info-box">
              <p><strong>System Type:</strong> ${registration.system_description || 'N/A'}</p>
              <p><strong>System Cost:</strong> £${registration.system_cost?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
              <p><strong>Installer:</strong> ${registration.installer_company || 'N/A'}</p>
            </div>
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #E67E22;">
            <strong>Note:</strong> Both the previous and new owners have been notified via email.
          </p>
        </div>

        <div class="footer">
          <p><strong>InsuraGuard</strong> - Protection you can trust for clean energy investments</p>
          <p>This is an automated notification for record keeping.</p>
        </div>
      </body>
      </html>
    `

    if (sendgridApiKey) {
      // Send email to new owner
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: newOwnerEmail }] }],
          from: { email: 'support@insuraguard.co.uk', name: 'InsuraGuard' },
          subject: `Welcome to InsuraGuard - Ownership Transfer Complete - ${registration.urn}`,
          content: [{ type: 'text/html', value: newOwnerHtml }],
        }),
      })

      // Send email to previous owner
      if (previousOwnerEmail) {
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: previousOwnerEmail }] }],
            from: { email: 'support@insuraguard.co.uk', name: 'InsuraGuard' },
            subject: `Ownership Transfer Complete - ${registration.urn}`,
            content: [{ type: 'text/html', value: previousOwnerHtml }],
          }),
        })
      }

      // Send notification to support
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: 'support@insuraguard.co.uk' }] }],
          from: { email: 'support@insuraguard.co.uk', name: 'InsuraGuard' },
          subject: `Ownership Transfer Completed - ${registration.urn}`,
          content: [{ type: 'text/html', value: supportHtml }],
        }),
      })

      return new Response(
        JSON.stringify({ success: true, message: 'Emails sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Mock mode for development
      console.log('MOCK MODE - Email would be sent to:', newOwnerEmail, previousOwnerEmail)
      return new Response(
        JSON.stringify({ success: true, message: 'Mock mode - emails logged', mock: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error: any) {
    console.error('Send ownership transfer email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
