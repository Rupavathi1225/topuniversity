import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Enable CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    // Get IP from various headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               'unknown'
    
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Detect device type
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())
    const device = isMobile ? 'Mobile' : 'Desktop'
    
    // Get country from IP (using Deno's built-in location or fallback)
    let country = 'Unknown'
    let source = 'direct'
    
    try {
      // Try to get geolocation from IP
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        country = geoData.country_name || geoData.country || 'Unknown'
      }
    } catch (error) {
      console.error('Geolocation error:', error)
    }
    
    // Detect source from referrer
    const referer = req.headers.get('referer') || ''
    if (referer) {
      if (referer.includes('google')) source = 'Google'
      else if (referer.includes('facebook')) source = 'Facebook'
      else if (referer.includes('twitter') || referer.includes('t.co')) source = 'Twitter'
      else if (referer.includes('linkedin')) source = 'LinkedIn'
      else source = 'Referral'
    }

    return new Response(
      JSON.stringify({
        ip_address: ip,
        country,
        source,
        device,
        user_agent: userAgent,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
