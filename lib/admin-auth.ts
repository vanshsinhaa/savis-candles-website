const EXPIRY_MS = 24 * 60 * 60 * 1000

function base64urlEncode(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
  let binary = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

async function getKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage
  )
}

export async function createAdminToken(secret: string): Promise<string> {
  const payload = base64urlEncode(
    new TextEncoder().encode(JSON.stringify({ exp: Date.now() + EXPIRY_MS, v: 1 }))
  )
  const key = await getKey(secret, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${base64urlEncode(sig)}`
}

export async function verifyAdminToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return false
    const key = await getKey(secret, ['verify'])
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(sig),
      new TextEncoder().encode(payload)
    )
    if (!valid) return false
    const { exp } = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)))
    return typeof exp === 'number' && Date.now() < exp
  } catch {
    return false
  }
}
