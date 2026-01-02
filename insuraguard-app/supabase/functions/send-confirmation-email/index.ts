import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

// Generate payment receipt PDF using pdf-lib (same as certificate)
async function generateReceiptPDF(data: {
  urn: string
  fullName: string
  email: string
  paymentDate: string
  paymentAmount: number
  paymentReference: string
  systemDescription: string
  systemCost: number
  commissioningDate: string
}): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const orange = rgb(0.9, 0.49, 0.13) // #E67E22
  const black = rgb(0, 0, 0)
  const darkGray = rgb(0.2, 0.2, 0.2)
  const lightGray = rgb(0.4, 0.4, 0.4)
  
  let yPosition = height - 60
  
  // Try to embed logo from site
  const SITE_URL = Deno.env.get('SITE_URL') || 'https://insuraguard.co.uk'
  try {
    const logoUrl = `${SITE_URL}/InsuraGuard-logo-transparent-1200.png`
    const logoResponse = await fetch(logoUrl)
    
    if (logoResponse.ok) {
      const logoBytes = await logoResponse.arrayBuffer()
      const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes))
      const logoDims = logoImage.scale(0.1)
      page.drawImage(logoImage, {
        x: 50,
        y: yPosition - logoDims.height + 20,
        width: logoDims.width,
        height: logoDims.height,
      })
      yPosition -= logoDims.height + 10
    } else {
      throw new Error('Logo fetch failed')
    }
  } catch (logoError) {
    // Fallback to text logo: black "Insura" + orange "Guard"
    page.drawText('Insura', {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: black,
    })
    page.drawText('Guard', {
      x: 50 + boldFont.widthOfTextAtSize('Insura', 24),
      y: yPosition,
      size: 24,
      font: boldFont,
      color: orange,
    })
    yPosition -= 20
  }
  
  yPosition -= 10
  
  page.drawText('Registered Insurance Provider', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: lightGray,
  })
  yPosition -= 15
  
  page.drawText('Protection for Clean Energy Investments', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: lightGray,
  })
  yPosition -= 40
  
  // Title
  page.drawText('PAYMENT RECEIPT', {
    x: width / 2 - 80,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: darkGray,
  })
  yPosition -= 40
  
  // Receipt details
  const drawRow = (label: string, value: string) => {
    page.drawText(label, {
      x: 50,
      y: yPosition,
      size: 11,
      font: font,
      color: lightGray,
    })
    page.drawText(value, {
      x: 350,
      y: yPosition,
      size: 11,
      font: boldFont,
      color: darkGray,
    })
    yPosition -= 25
  }
  
  drawRow('Receipt Number:', data.urn)
  drawRow('Payment Date:', data.paymentDate)
  drawRow('Payment Reference:', data.paymentReference)
  
  yPosition -= 10
  drawRow('Customer Name:', data.fullName)
  drawRow('Email:', data.email)
  
  yPosition -= 10
  drawRow('Description:', 'Clean Energy System Insurance')
  drawRow('System:', data.systemDescription.substring(0, 40))
  drawRow('Insured Value:', `£${data.systemCost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`)
  drawRow('Coverage Period:', `10 years from ${new Date(data.commissioningDate).toLocaleDateString('en-GB')}`)
  drawRow('Payment Method:', 'Credit Card (Stripe)')
  
  yPosition -= 20
  
  // Total box
  page.drawRectangle({
    x: 50,
    y: yPosition - 30,
    width: width - 100,
    height: 50,
    color: rgb(0.98, 0.98, 0.98),
  })
  
  page.drawText('TOTAL PAID:', {
    x: 60,
    y: yPosition - 10,
    size: 14,
    font: boldFont,
    color: darkGray,
  })
  
  page.drawText(`£${data.paymentAmount.toFixed(2)}`, {
    x: width - 150,
    y: yPosition - 10,
    size: 20,
    font: boldFont,
    color: orange,
  })
  
  yPosition -= 80
  
  // Footer
  page.drawText('InsuraGuard Ltd - Registered Insurance Provider', {
    x: 50,
    y: yPosition,
    size: 9,
    font: boldFont,
    color: lightGray,
  })
  yPosition -= 15
  
  page.drawText('This payment has been processed securely through Stripe.', {
    x: 50,
    y: yPosition,
    size: 9,
    font: font,
    color: lightGray,
  })
  yPosition -= 15
  
  page.drawText('For inquiries, please contact: support@insuraguard.co.uk', {
    x: 50,
    y: yPosition,
    size: 9,
    font: font,
    color: lightGray,
  })
  yPosition -= 15
  
  page.drawText('Visit us at: https://insuraguard.co.uk', {
    x: 50,
    y: yPosition,
    size: 9,
    font: font,
    color: lightGray,
  })
  yPosition -= 25
  
  page.drawText('This is an official payment receipt. Please retain for your records.', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: lightGray,
  })
  
  const pdfBytes = await pdfDoc.save()
  return btoa(String.fromCharCode(...new Uint8Array(pdfBytes)))
}

serve(async (req) => {
  try {
    const { registrationId } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if SendGrid is configured
    const sendGridKey = Deno.env.get('SENDGRID_API_KEY')
    if (!sendGridKey || sendGridKey === 'SG.xxxxx') {
      // Mock mode: Generate certificate and return URL for download
      const { data: registration, error: fetchError } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', registrationId)
        .single()

      if (fetchError || !registration) {
        throw new Error('Registration not found')
      }

      // Generate certificate if it doesn't exist
      const pdfPath = `certificates/${registrationId}/certificate.pdf`
      const { data: existingPdf } = await supabase.storage
        .from('insuraguard-documents')
        .getPublicUrl(pdfPath)

      // If PDF doesn't exist, generate it
      let pdfUrl = existingPdf.publicUrl
      try {
        const response = await fetch(existingPdf.publicUrl)
        if (!response.ok) {
          // Generate certificate
          const certResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-certificate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ registrationId }),
          })
          
          if (certResponse.ok) {
            const { pdfUrl: newPdfUrl } = await certResponse.json()
            pdfUrl = newPdfUrl
          }
        }
      } catch (e) {
        // PDF generation failed, but return what we have
        console.log('PDF generation skipped in mock mode')
      }

      return new Response(
        JSON.stringify({ 
          sent: true, 
          mock: true, 
          pdfUrl,
          message: 'Test mode - Certificate ready for download'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Real SendGrid flow
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      throw new Error('Registration not found')
    }

    console.log('Registration data for email:', {
      urn: registration.urn,
      payment_amount: registration.payment_amount,
      stripe_payment_id: registration.stripe_payment_id,
      payment_status: registration.payment_status
    })

    // Format payment date
    const paymentDate = new Date(registration.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    // Get payment reference (use stripe_payment_id or fallback to URN)
    const paymentReference = registration.stripe_payment_id || registration.urn

    // Download certificate PDF from storage
    const pdfPath = `certificates/${registrationId}/certificate.pdf`
    const { data: pdfBlob, error: downloadError } = await supabase.storage
      .from('insuraguard-documents')
      .download(pdfPath)

    if (downloadError) throw downloadError

    // Convert certificate blob to base64
    const arrayBuffer = await pdfBlob.arrayBuffer()
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Generate payment receipt PDF using jsPDF
    const receiptPdfContent = await generateReceiptPDF({
      urn: registration.urn,
      fullName: registration.full_name,
      email: registration.email,
      paymentDate,
      paymentAmount: registration.payment_amount || 0,
      paymentReference,
      systemDescription: registration.system_description,
      systemCost: registration.system_cost || 0,
      commissioningDate: registration.commissioning_date
    })

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
    
    <p>Your insurance certificate and payment receipt are attached to this email. Please keep them safe for your records.</p>
    
    <p><strong>Payment Confirmation</strong></p>
    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
      <p style="margin: 0; font-size: 14px; color: #333;">
        <strong>Amount Paid:</strong> £${registration.payment_amount?.toFixed(2) || '0.00'}<br>
        <strong>Payment Date:</strong> ${paymentDate}<br>
        <strong>Payment Reference:</strong> ${paymentReference}<br>
        <strong>Payment Method:</strong> Credit Card (Stripe)
      </p>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">
        A detailed payment receipt is attached as a separate PDF document.
      </p>
    </div>
    
    <p><strong>Coverage Details:</strong></p>
    <ul>
      <li>Period: 10 years from ${new Date(registration.commissioning_date).toLocaleDateString('en-GB')}</li>
      <li>Insured Value: £${registration.system_cost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</li>
      <li>System: ${registration.system_description}</li>
    </ul>
    
    <p>If you need to make a claim, visit: <a href="https://insuraguard.co.uk/claim" style="color: #E67E22;">https://insuraguard.co.uk/claim</a></p>
    
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
          email: 'support@insuraguard.co.uk', 
          name: 'InsuraGuard' 
        },
        subject: `Your InsuraGuard Certificate & Receipt - ${registration.urn}`,
        content: [{ 
          type: 'text/html', 
          value: emailHtml 
        }],
        attachments: [
          {
            content: base64Pdf,
            filename: `InsuraGuard_Certificate_${registration.urn}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
          {
            content: receiptPdfContent,
            filename: `InsuraGuard_Receipt_${registration.urn}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SendGrid error: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ sent: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
