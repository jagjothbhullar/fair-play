import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface ScanResultEmail {
  email: string
  summary: string
  overallRisk: string
  redFlagsCount: number
  redFlags: Array<{
    name: string
    severity: string
    explanation: string
    recommendation: string
  }>
  keyTerms: {
    compensation: string | null
    duration: string | null
    exclusivity: string | null
    terminationRights: string | null
    usageRights: string | null
  }
  suggestedRedlinesCount: number
}

export async function sendScanResultsEmail(data: ScanResultEmail): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email')
    return false
  }

  const riskColors: Record<string, string> = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  }

  const riskColor = riskColors[data.overallRisk] || riskColors.medium

  try {
    await resend.emails.send({
      from: 'Fair Play <onboarding@resend.dev>',
      to: data.email,
      subject: `Your Contract Scan Results - ${data.overallRisk.toUpperCase()} Risk`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0f172a; margin: 0;">Fair Play</h1>
    <p style="color: #64748b; margin: 5px 0 0 0;">Contract Scan Results</p>
  </div>

  <div style="background: ${riskColor}15; border: 1px solid ${riskColor}40; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="margin: 0; color: #0f172a; font-size: 16px;">Overall Risk Level</h2>
      </div>
      <div style="background: ${riskColor}; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 18px;">
        ${data.overallRisk.toUpperCase()}
      </div>
    </div>
  </div>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 12px 0; color: #0f172a;">Summary</h3>
    <p style="margin: 0; color: #475569;">${data.summary}</p>
  </div>

  ${data.redFlagsCount > 0 ? `
  <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px 0; color: #991b1b;">Red Flags Found (${data.redFlagsCount})</h3>
    ${data.redFlags.slice(0, 3).map(flag => `
    <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #fecaca;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">${flag.name}</div>
      <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">${flag.explanation}</p>
      <p style="margin: 0; color: #059669; font-size: 14px;"><strong>Recommendation:</strong> ${flag.recommendation}</p>
    </div>
    `).join('')}
    ${data.redFlagsCount > 3 ? `<p style="margin: 0; color: #991b1b; font-size: 14px;">+ ${data.redFlagsCount - 3} more red flags. View full results on Fair Play.</p>` : ''}
  </div>
  ` : ''}

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px 0; color: #0f172a;">Key Terms</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Compensation</td><td style="color: #0f172a;">${data.keyTerms.compensation || 'Not specified'}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Duration</td><td style="color: #0f172a;">${data.keyTerms.duration || 'Not specified'}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Exclusivity</td><td style="color: #0f172a;">${data.keyTerms.exclusivity || 'Not specified'}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Termination</td><td style="color: #0f172a;">${data.keyTerms.terminationRights || 'Not specified'}</td></tr>
      <tr><td style="padding: 8px 0; color: #64748b;">Usage Rights</td><td style="color: #0f172a;">${data.keyTerms.usageRights || 'Not specified'}</td></tr>
    </table>
  </div>

  ${data.suggestedRedlinesCount > 0 ? `
  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0; color: #1e40af;">
      <strong>${data.suggestedRedlinesCount} suggested redlines</strong> are available in your full results.
    </p>
  </div>
  ` : ''}

  <div style="text-align: center; margin-top: 32px;">
    <a href="https://fairplay.app/signup" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
      Get Unlimited Scans
    </a>
    <p style="margin: 16px 0 0 0; color: #64748b; font-size: 14px;">
      Create a free account for unlimited scans and premium features.
    </p>
  </div>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

  <div style="text-align: center; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">This is not legal advice. For binding legal matters, consult a licensed attorney.</p>
    <p style="margin: 0;">&copy; 2025 Fair Play. Level the playing field.</p>
  </div>

</body>
</html>
      `,
    })

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
