import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, timestamp, ipAddress, deviceInfo, referralSource } = await req.json();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('\n=============================================================');
      console.log('--- ADMIN REAL EMAIL NOTIFICATION (RESEND_API_KEY NOT SET) ---');
      console.log(`New user registration: ${email}`);
      console.log(`Time: ${timestamp}`);
      console.log(`IP: ${ipAddress}`);
      console.log(`Referral: ${referralSource}`);
      console.log(`Device: ${deviceInfo}`);
      console.log('-------------------------------------------------------------');
      console.log('TIP: To receive real email notifications, set RESEND_API_KEY');
      console.log('in a .env.local file in the project root directory.');
      console.log('=============================================================\n');
      
      return NextResponse.json({ success: true, simulated: true });
    }

    // Call Resend email dispatch API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'SEO Pulse Admin <onboarding@resend.dev>', // Default Resend testing sender address
        to: 'kapilsaini.dm@gmail.com',
        subject: `New SEO Community Sign-up: ${email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 8px; background-color: #0b0f19; color: #f3f4f6;">
            <h2 style="color: #10b981; border-bottom: 1px solid #1e293b; padding-bottom: 10px; font-family: monospace;">[SEO_INTEL_DECK] MEMBERSHIP REQUEST</h2>
            <p>Admin, a new user has submitted their email for access authorization.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: monospace; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">USER EMAIL:</td>
                <td style="padding: 8px 0; color: #f3f4f6; font-weight: bold;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">TIMESTAMP:</td>
                <td style="padding: 8px 0; color: #f3f4f6;">${new Date(timestamp).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">IP ADDRESS:</td>
                <td style="padding: 8px 0; color: #f3f4f6;">${ipAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">REFERRAL:</td>
                <td style="padding: 8px 0; color: #f3f4f6;">${referralSource}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">USER AGENT:</td>
                <td style="padding: 8px 0; color: #f3f4f6; font-size: 11px;">${deviceInfo}</td>
              </tr>
            </table>
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000" style="background: linear-gradient(to right, #10b981, #06b6d4); color: #030712; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-family: monospace; font-size: 12px; display: inline-block;">
                LAUNCH ADMIN PANEL
              </a>
            </div>
            <p style="font-size: 10px; color: #4b5563; margin-top: 40px; text-align: center; font-family: monospace;">
              SECURE SMTP AUTO-ALERT SECTOR_14 // SEO PULSE
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API failed:', errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
