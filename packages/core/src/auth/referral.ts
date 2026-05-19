interface ReferralInfo {
  affiliateToken: string;
  utmCampaign: string;
  utmSource?: string;
  utmMedium?: string;
}

/**
 * Parse a Deriv partner referral link and extract affiliate tracking params.
 *
 * Supports three formats:
 * 1. deriv.com/signup?sidc=TOKEN&utm_campaign=dynamicworks
 *    → affiliateToken = sidc value, utmCampaign = utm_campaign value
 *
 * 2. track.deriv.com/_TOKEN_/1/
 *    → affiliateToken = TOKEN (path segment without underscores), utmCampaign = 'myaffiliates'
 *
 * 3. deriv.com/?t=TOKEN&utm_source=...&utm_medium=...&utm_campaign=...
 *    → affiliateToken = t value, utmSource, utmMedium, utmCampaign from query params
 */
export function parseReferralLink(referralLink: string): ReferralInfo | null {
  if (!referralLink) return null;

  try {
    const url = new URL(referralLink);

    // Format 3: deriv.com/?t=...&utm_source=...&utm_medium=...&utm_campaign=...
    const t = url.searchParams.get('t');
    if (t) {
      return {
        affiliateToken: t,
        utmCampaign: url.searchParams.get('utm_campaign') ?? '',
        utmSource: url.searchParams.get('utm_source') ?? undefined,
        utmMedium: url.searchParams.get('utm_medium') ?? undefined,
      };
    }

    // Format 1: deriv.com/signup?sidc=...&utm_campaign=...
    const sidc = url.searchParams.get('sidc');
    if (sidc) {
      return {
        affiliateToken: sidc,
        utmCampaign: url.searchParams.get('utm_campaign') ?? 'dynamicworks',
      };
    }

    // Format 2: track.deriv.com/_TOKEN_/1/
    if (url.hostname.includes('track.deriv.com')) {
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        // Remove leading/trailing underscores from the token segment
        const rawToken = pathSegments[0].replace(/^_|_$/g, '');
        if (rawToken) {
          return {
            affiliateToken: rawToken,
            utmCampaign: 'myaffiliates',
          };
        }
      }
    }
  } catch {
    // Invalid URL
  }

  return null;
}
