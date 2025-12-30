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
  console.log('=== Certificate Generation Function Called ===')
  console.log('Method:', req.method)
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body first (can only be read once)
    console.log('Parsing request body...')
    const { registrationId } = await req.json()
    console.log('Registration ID:', registrationId)

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

    const certificateTemplate = templates?.find(t => t.template_type === 'certificate_template')?.content || ''
    const underwriterInfo = templates?.find(t => t.template_type === 'underwriter_info')?.content || 'Underwriter information'
    
    // Calculate coverage end date (10 years from commissioning)
    const commissioningDate = new Date(registration.commissioning_date)
    const coverageEndDate = new Date(commissioningDate)
    coverageEndDate.setFullYear(coverageEndDate.getFullYear() + 10)
    
    // Replace template variables with actual data
    const templateData: Record<string, string> = {
      urn: registration.urn,
      full_name: registration.full_name,
      email: registration.email,
      phone: registration.phone,
      installation_address: registration.installation_address,
      system_description: registration.system_description,
      system_cost: registration.system_cost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      commissioning_date: commissioningDate.toLocaleDateString('en-GB'),
      coverage_end_date: coverageEndDate.toLocaleDateString('en-GB'),
      installer_company: registration.installer_company,
      inverter_serial: registration.inverter_serial || 'N/A',
      battery_serial: registration.battery_serial || 'N/A',
      registration_date: new Date(registration.created_at).toLocaleDateString('en-GB'),
      underwriter_info: underwriterInfo
    }
    
    let certificateContent = certificateTemplate
    for (const [key, value] of Object.entries(templateData)) {
      // Sanitize value to remove problematic characters for PDF encoding
      const sanitizedValue = value.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ')
      certificateContent = certificateContent.replace(new RegExp(`{{${key}}}`, 'g'), sanitizedValue)
    }
    
    // Normalize line endings in the entire template
    certificateContent = certificateContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size in points
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const charcoal = rgb(0.23, 0.23, 0.23) // #3A3A3A
    const amber = rgb(0.9, 0.49, 0.13) // #E67E22

    let yPosition = height - 60

    // Try to embed logo from site
    try {
      const logoUrl = `${SITE_URL}/InsuraGuard-logo-transparent-1200.png`
      console.log('Fetching logo from:', logoUrl)
      const logoResponse = await fetch(logoUrl)
      console.log('Logo response status:', logoResponse.status)
      
      if (logoResponse.ok) {
        const logoBytes = await logoResponse.arrayBuffer()
        console.log('Logo bytes received:', logoBytes.byteLength)
        const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes))
        const logoDims = logoImage.scale(0.1) // Slightly larger scale
        page.drawImage(logoImage, {
          x: 50,
          y: yPosition - logoDims.height + 20,
          width: logoDims.width,
          height: logoDims.height,
        })
        yPosition -= logoDims.height + 10
        console.log('Logo embedded successfully')
      } else {
        throw new Error(`Logo fetch failed with status ${logoResponse.status}`)
      }
    } catch (logoError) {
      console.log('Logo embedding failed:', logoError.message)
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

    // Draw certificate content from template
    const lines = certificateContent.split('\n')
    const maxWidth = width - 100

    for (let line of lines) {
      // Remove any remaining control characters (carriage returns, etc.)
      line = line.replace(/[\r\x00-\x1F]/g, '')
      
      if (line.trim() === '') {
        yPosition -= 15
        continue
      }

      if (line.trim() === '---') {
        // Draw separator line
        page.drawLine({
          start: { x: 50, y: yPosition },
          end: { x: width - 50, y: yPosition },
          thickness: 1,
          color: amber,
        })
        yPosition -= 20
        continue
      }

      // Word wrap long lines
      const words = line.split(' ')
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine + word + ' '
        const testWidth = font.widthOfTextAtSize(testLine, 10)
        
        if (testWidth > maxWidth && currentLine !== '') {
          page.drawText(currentLine, {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: charcoal,
          })
          yPosition -= 15
          currentLine = word + ' '
        } else {
          currentLine = testLine
        }
      }

      if (currentLine.trim() !== '') {
        page.drawText(currentLine, {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
          color: charcoal,
        })
        yPosition -= 15
      }
    }

    // Footer
    yPosition = 60

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
    console.log('Uploading PDF to:', filePath)
    console.log('PDF size:', pdfBytes.length, 'bytes')
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('insuraguard-documents')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }
    
    console.log('Upload successful:', uploadData)

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
