export interface AuthConfig {
  clientId: string;
  redirectUri: string;
  /** OAuth scopes as a space-separated string. Defaults to 'trade account_manage' */
  scopes?: string;
  /** Affiliate token extracted from the partner referral link (sent as `t` on sign-up) */
  affiliateToken?: string;
  /** UTM campaign identifier (e.g., 'dynamicworks' or 'myaffiliates') */
  utmCampaign?: string;
  /** UTM source identifier (e.g., 'affiliate_248640') — sign-up attribution only */
  utmSource?: string;
  /** UTM medium (e.g., 'affiliate') — sign-up attribution only */
  utmMedium?: string;
}

export interface AuthInfo {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  scope: string;
  refresh_token: string;
}

export interface DerivAccount {
  account_id: string;
  account_type: 'demo' | 'real';
  currency: string;
  balance: string;
  group: string;
  status: string;
}

export interface OTPResponse {
  data: {
    url: string;
  };
}

export interface TokenExchangeParams {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface CallbackParams {
  code?: string | null;
  state?: string | null;
  scope?: string | null;
  error?: string | null;
  error_description?: string | null;
}

export type AuthState = 'unauthenticated' | 'authenticating' | 'authenticated' | 'error';

export interface StoredCSRFToken {
  value: string;
  createdAt: number;
}

export interface StoredCodeVerifier {
  value: string;
  createdAt: number;
}
