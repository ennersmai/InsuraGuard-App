import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

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
    const { 
      claimId,
      urn, 
      customerName, 
      customerEmail, 
      customerPhone, 
      installationAddress,
      postcode,
      claimDescription,
      systemType,
      installerCompany,
      installerContact,
      installationDate,
      systemSize,
      inverterSerial,
      batterySerial,
      issueFirstNoticed,
      installerContactedDate,
      installerCeasedTrading,
      cessationEvidence,
      issueAffectedPerformance,
      performanceImpact,
      systemStatus,
      contactedInstaller,
      installerContactDetails,
      obtainedQuotes,
      temporaryRepairs,
      temporaryRepairsDetails,
      declarationAccepted,
      documentUrls,
      userId,
      paymentAmount, 
      paymentId, 
      paymentDate 
    } = await req.json()

    // Get SendGrid API key
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    if (!SENDGRID_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'SendGrid API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create email content with InsuraGuard branding
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Excess Fee Payment Received - InsuraGuard</title>
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
      .highlight p { margin: 5px 0; font-size: 16px; }
    </style>
</head>
<body>
    <div class="header">
      <h1 class="logo"><span class="logo-black">Insura</span><span class="logo-orange">Guard</span></h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">Excess Fee Payment Received</p>
    </div>

    <div class="content">
      <p>A claim excess fee payment has been received and processed successfully.</p>

      <div class="highlight">
        <p><strong>Payment Amount:</strong> <span style="color: #E67E22; font-size: 20px; font-weight: bold;">£${(paymentAmount / 100).toFixed(2)}</span></p>
        <p><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>

      <div class="section">
        <h3>Customer Details</h3>
        <div class="info-box">
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
          <p><strong>URN:</strong> ${urn}</p>
          <p><strong>Installation Address:</strong> ${installationAddress || 'Not provided'}</p>
          <p><strong>Postcode:</strong> ${postcode || 'Not provided'}</p>
        </div>
      </div>

      <div class="section">
        <h3>Payment Information</h3>
        <div class="info-box">
          <p><strong>Payment Reference:</strong> ${paymentId}</p>
          <p><strong>Payment Method:</strong> Credit Card (Stripe)</p>
          <p><strong>Fee Type:</strong> Claim Excess Fee (£29.95)</p>
        </div>
      </div>

      <div class="section">
        <h3>System Details</h3>
        <div class="info-box">
          <p><strong>Claim ID:</strong> ${claimId}</p>
          <p><strong>Registration URN:</strong> ${urn}</p>
          <p><strong>System Type:</strong> ${systemType}</p>
          <p><strong>Installation Date:</strong> ${installationDate || 'Not provided'}</p>
          <p><strong>System Size/Capacity:</strong> ${systemSize || 'Not provided'}</p>
          <p><strong>Inverter Serial:</strong> ${inverterSerial || 'Not provided'}</p>
          <p><strong>Battery Serial:</strong> ${batterySerial || 'Not provided'}</p>
          <p><strong>Current System Status:</strong> ${systemStatus || 'Not provided'}</p>
        </div>
      </div>

      <div class="section">
        <h3>Issue Description</h3>
        <div class="info-box">
          <p><strong>Nature of Issue:</strong></p>
          <p style="margin-top: 10px; white-space: pre-wrap;">${claimDescription}</p>
          <p style="margin-top: 15px;"><strong>Issue First Noticed:</strong> ${issueFirstNoticed || 'Not provided'}</p>
          <p><strong>Has Issue Affected Performance:</strong> ${issueAffectedPerformance ? 'Yes' : 'No'}</p>
          ${performanceImpact ? `<p><strong>Performance Impact:</strong> ${performanceImpact}</p>` : ''}
        </div>
      </div>

      <div class="section">
        <h3>Installer Information</h3>
        <div class="info-box">
          <p><strong>Installer Company:</strong> ${installerCompany || 'Not provided'}</p>
          <p><strong>Installer Contact:</strong> ${installerContact || installerContactDetails || 'Not provided'}</p>
          <p><strong>Has Installer Ceased Trading:</strong> ${installerCeasedTrading || 'Unknown'}</p>
          ${cessationEvidence ? `<p><strong>Cessation Evidence:</strong> ${cessationEvidence}</p>` : ''}
          <p><strong>Date Installer Contacted:</strong> ${installerContactedDate || 'Not contacted'}</p>
          <p><strong>Customer Contacted Installer:</strong> ${contactedInstaller ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div class="section">
        <h3>Previous Actions Taken</h3>
        <div class="info-box">
          <p><strong>Obtained Repair Quotes:</strong> ${obtainedQuotes ? 'Yes' : 'No'}</p>
          <p><strong>Made Temporary Repairs:</strong> ${temporaryRepairs ? 'Yes' : 'No'}</p>
          ${temporaryRepairsDetails ? `<p><strong>Repair Details:</strong> ${temporaryRepairsDetails}</p>` : ''}
        </div>
      </div>

      ${documentUrls && documentUrls.length > 0 ? `
      <div class="section">
        <h3>Supporting Documents</h3>
        <div class="info-box">
          <p><strong>${documentUrls.length} document(s) attached to this email</strong></p>
          <p style="margin-top: 10px; color: #666; font-size: 14px;">Documents include: InsuraGuard certificate, photos of defect, evidence of installer cessation, installation docs, correspondence, repair quotes, and performance data.</p>
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h3>Declaration</h3>
        <div class="info-box">
          <p><strong>Customer Declaration:</strong> ${declarationAccepted ? '✓ Accepted' : '✗ Not accepted'}</p>
          <p style="margin-top: 10px; color: #666; font-size: 14px;">Customer has declared that all information provided is true and accurate, and authorizes InsuraGuard to contact relevant parties to verify this claim.</p>
        </div>
      </div>

      <p style="margin-top: 30px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #E67E22;">
        <strong>Action Required:</strong> Please review this claim in the admin dashboard and contact the customer within 2 working days.
      </p>
    </div>

    <div class="footer">
      <p><strong>InsuraGuard</strong> - Protection you can trust for clean energy investments</p>
      <p>This is an automated notification. Please review the claim when it is submitted.</p>
    </div>
</body>
</html>
    `

    // Download and attach documents if any
    const attachments = []
    if (documentUrls && documentUrls.length > 0) {
      console.log('Processing documents:', documentUrls)
      for (const docPath of documentUrls) {
        try {
          console.log('Downloading document from path:', docPath)
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('claim-documents')
            .download(docPath)
          
          if (downloadError) {
            console.error('Download error for', docPath, ':', downloadError)
            continue
          }
          
          if (fileData) {
            console.log('File downloaded, size:', fileData.size, 'type:', fileData.type)
            const arrayBuffer = await fileData.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            
            // Use Deno's base64 encoder for large files
            const base64 = base64Encode(bytes)
            
            const fileName = docPath.split('/').pop() || 'document'
            
            attachments.push({
              content: base64,
              filename: fileName,
              type: fileData.type || 'application/octet-stream',
              disposition: 'attachment'
            })
            console.log('Attachment added:', fileName, 'size:', bytes.length, 'bytes')
          }
        } catch (error) {
          console.error('Error processing document:', docPath, error)
        }
      }
      console.log('Total attachments prepared:', attachments.length)
    } else {
      console.log('No documents to attach. documentUrls:', documentUrls)
    }

    // Send email using SendGrid
    const emailPayload: any = {
      personalizations: [{
        to: [{ email: 'support@insuraguard.co.uk' }],
      }],
      from: { email: 'support@insuraguard.co.uk', name: 'InsuraGuard' },
      subject: `Claim Submitted - ${claimId} - ${customerName}`,
      content: [{
        type: 'text/html',
        value: emailContent,
      }],
    }

    if (attachments.length > 0) {
      emailPayload.attachments = attachments
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid error response:', errorText)
      throw new Error(`SendGrid error: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Excess fee email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error sending excess fee email:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
