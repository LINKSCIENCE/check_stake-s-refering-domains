import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }
    
    // Extract domain from URL
    let domain;
    try {
      domain = new URL(url).hostname;
      // Remove www. if present
      domain = domain.replace(/^www\./, '');
    } catch (error) {
      return NextResponse.json({ message: 'Invalid URL format' }, { status: 400 });
    }
    
    // Get your target domain (the domain you want to check backlinks to)
    const targetDomain = process.env.TARGET_DOMAIN || 'yourdomain.com';
    
    // DataForSEO API credentials
    const login = process.env.DATAFORSEO_LOGIN || 'admin@linkscience.ai';
    const password = process.env.DATAFORSEO_PASSWORD;
    
    try {
      // DataForSEO API authentication
      const auth = Buffer.from(`${login}:${password}`).toString('base64');
      
      // DataForSEO Backlinks API - check if the domain exists in backlinks
      const apiResponse = await axios.post(
        'https://api.dataforseo.com/v3/backlinks/referring_domains/live',
        {
          target: targetDomain,
          limit: 10,
          filters: [
            ["domain", "=", domain]
          ]
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Check if the API request was successful
      if (apiResponse.data.status_code !== 20000) {
        throw new Error(`DataForSEO API error: ${apiResponse.data.status_message}`);
      }
      
      // Check if the domain exists in the results
      const exists = apiResponse.data.tasks && 
                     apiResponse.data.tasks[0].result && 
                     apiResponse.data.tasks[0].result.total_count > 0;
      
      // Gather details from the response
      let details = {
        checkedDomain: domain,
        targetDomain: targetDomain,
        checkedUrl: url,
        timestamp: new Date().toISOString()
      };
      
      // Add more details if the domain exists in the backlink profile
      if (exists && apiResponse.data.tasks[0].result.items.length > 0) {
        const domainData = apiResponse.data.tasks[0].result.items[0];
        details = {
          ...details,
          backlinks: domainData.backlinks,
          dofollow: domainData.dofollow,
          lastSeen: domainData.last_visited,
          rankData: {
            alexa_rank: domainData.alexa_rank,
            semrush_rank: domainData.rank,
            domain_rank: domainData.domain_rank
          }
        };
      }
      
      return NextResponse.json({
        exists,
        details,
        message: exists ? 'Domain found in referring domains' : 'Domain not found in referring domains'
      });
      
    } catch (apiError) {
      console.error('DataForSEO API error:', apiError);
      return NextResponse.json({ 
        message: 'Error connecting to DataForSEO API',
        error: apiError.message 
      }, { status: 502 });
    }
    
  } catch (error) {
    console.error('Error checking link:', error);
    return NextResponse.json({ 
      message: 'Error checking link status',
      error: error.message 
    }, { status: 500 });
  }
}
