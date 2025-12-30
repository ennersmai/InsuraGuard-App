import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@1.17.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

const SITE_URL = Deno.env.get('SITE_URL') || 'https://insuraguard.com'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body first (can only be read once)
    const { registrationId } = await req.json()

    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch registration data using service role (has full access)
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      throw new Error('Registration not found')
    }

    // Fetch templates
    const { data: templates } = await supabase
      .from('admin_templates')
      .select('*')

    const pdfLegalText = templates?.find(t => t.template_type === 'pdf_legal_text')?.content || 'Standard terms apply.'
    const underwriterInfo = templates?.find(t => t.template_type === 'underwriter_info')?.content || 'Underwriter information'

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size in points
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const charcoal = rgb(0.23, 0.23, 0.23) // #3A3A3A
    const amber = rgb(0.9, 0.49, 0.13) // #E67E22

    let yPosition = height - 60

    // Try to embed logo
    try {
      const logoUrl = `${SITE_URL}/InsuraGuard-logo-transparent-1200.png`
      const logoResponse = await fetch(logoUrl)
      if (logoResponse.ok) {
        const logoBytes = await logoResponse.arrayBuffer()
        const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes))
        const logoDims = logoImage.scale(0.08)
        page.drawImage(logoImage, {
          x: 50,
          y: yPosition - logoDims.height + 20,
          width: logoDims.width,
          height: logoDims.height,
        })
        yPosition -= logoDims.height + 10
      }
    } catch (logoError) {
      console.log('Logo embedding skipped:', logoError.message)
      // Fallback to text logo
      page.drawText('Insura', {
        x: 50,
        y: yPosition,
        size: 28,
        font: fontBold,
        color: charcoal,
      })
      page.drawText('Guard', {
        x: 50 + fontBold.widthOfTextAtSize('Insura', 28),
        y: yPosition,
        size: 28,
        font: fontBold,
        color: amber,
      })
      yPosition -= 20
    }

    yPosition -= 40

    page.drawText('CERTIFICATE OF INSURANCE-BACKED GUARANTEE', {
      x: 50,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: charcoal,
    })

    yPosition -= 30

    page.drawText(`Unique Reference: ${registration.urn}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: amber,
    })

    yPosition -= 40

    // The Insured
    page.drawText('THE INSURED', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: charcoal,
    })

    page.drawLine({
      start: { x: 50, y: yPosition - 5 },
      end: { x: width - 50, y: yPosition - 5 },
      thickness: 2,
      color: amber,
    })

    yPosition -= 25

    const insuredDetails = [
      `Policyholder Name: ${registration.full_name}`,
      `Installation Address: ${registration.installation_address}`,
      `Registration Date: ${new Date(registration.created_at).toLocaleDateString('en-GB')}`,
      `System Details: ${registration.system_description}`,
    ]

    for (const detail of insuredDetails) {
      page.drawText(detail, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: charcoal,
      })
      yPosition -= 20
    }

    yPosition -= 20

    // Coverage Summary
    page.drawText('COVERAGE SUMMARY', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: charcoal,
    })

    page.drawLine({
      start: { x: 50, y: yPosition - 5 },
      end: { x: width - 50, y: yPosition - 5 },
      thickness: 2,
      color: amber,
    })

    yPosition -= 25

    const commissioningDate = new Date(registration.commissioning_date)
    const coverageEndDate = new Date(commissioningDate)
    coverageEndDate.setFullYear(coverageEndDate.getFullYear() + 10)

    const coverageDetails = [
      `Period of Cover: 10 years from ${commissioningDate.toLocaleDateString('en-GB')} to ${coverageEndDate.toLocaleDateString('en-GB')}`,
      `Insured Value: £${registration.system_cost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
      `Scope of Cover: This policy protects the guarantee if the original installer ceases to trade.`,
      '',
      `Underwriter: ${underwriterInfo}`,
    ]

    for (const detail of coverageDetails) {
      page.drawText(detail, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: charcoal,
      })
      yPosition -= 20
    }

    yPosition -= 20

    // Technical Specifications
    page.drawText('TECHNICAL SPECIFICATIONS', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: charcoal,
    })

    page.drawLine({
      start: { x: 50, y: yPosition - 5 },
      end: { x: width - 50, y: yPosition - 5 },
      thickness: 2,
      color: amber,
    })

    yPosition -= 25

    const technicalDetails = [
      `Installer Company: ${registration.installer_company}`,
      `Inverter Serial: ${registration.inverter_serial || 'N/A'}`,
      `Battery Serial: ${registration.battery_serial || 'N/A'}`,
      `Commissioning Date: ${commissioningDate.toLocaleDateString('en-GB')}`,
    ]

    for (const detail of technicalDetails) {
      page.drawText(detail, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: charcoal,
      })
      yPosition -= 20
    }

    yPosition -= 20

    // Key Policy Terms
    page.drawText('KEY POLICY TERMS', {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: charcoal,
    })

    page.drawLine({
      start: { x: 50, y: yPosition - 5 },
      end: { x: width - 50, y: yPosition - 5 },
      thickness: 2,
      color: amber,
    })

    yPosition -= 25

    // Wrap legal text
    const maxWidth = width - 100
    const words = pdfLegalText.split(' ')
    let line = ''

    for (const word of words) {
      const testLine = line + word + ' '
      const testWidth = font.widthOfTextAtSize(testLine, 9)
      
      if (testWidth > maxWidth && line !== '') {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 9,
          font: font,
          color: charcoal,
        })
        line = word + ' '
        yPosition -= 15
      } else {
        line = testLine
      }
    }

    if (line !== '') {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: 9,
        font: font,
        color: charcoal,
      })
      yPosition -= 20
    }

    yPosition -= 10

    page.drawText('How to Claim: Visit insuraguard.com/claim', {
      x: 50,
      y: yPosition,
      size: 9,
      font: fontBold,
      color: amber,
    })

    // Footer
    yPosition = 80

    page.drawLine({
      start: { x: 50, y: yPosition + 20 },
      end: { x: width - 50, y: yPosition + 20 },
      thickness: 1,
      color: amber,
    })

    page.drawText(`Document Generated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`, {
      x: 50,
      y: yPosition,
      size: 8,
      font: font,
      color: charcoal,
    })

    page.drawText('Digitally Validated', {
      x: width - 150,
      y: yPosition,
      size: 8,
      font: fontBold,
      color: amber,
    })

    // Save PDF
    const pdfBytes = await pdfDoc.save()

    // Upload to Supabase Storage
    const filePath = `certificates/${registrationId}/certificate.pdf`
    const { error: uploadError } = await supabase.storage
      .from('insuraguard-documents')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Update registration with certificate path (not URL, since bucket is private)
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
        pdf_url: filePath,
        certificate_generated: true 
      })
      .eq('id', registrationId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true,
        certificatePath: filePath 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('PDF generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
