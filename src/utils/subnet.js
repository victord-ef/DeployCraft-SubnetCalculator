export function ipToInt(ip) {
  const parts = ip.split('.')
  if (parts.length !== 4) throw new Error('Invalid IP')
  return parts.reduce((acc, octet) => {
    const n = parseInt(octet, 10)
    if (isNaN(n) || n < 0 || n > 255) throw new Error('Invalid octet')
    return ((acc << 8) | n) >>> 0
  }, 0)
}

export function intToIp(int) {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8)  & 0xff,
    int          & 0xff,
  ].join('.')
}

export function prefixToMask(prefix) {
  if (prefix === 0) return 0
  return (0xffffffff << (32 - prefix)) >>> 0
}

export function maskToPrefix(mask) {
  let bits = 0
  let m = mask >>> 0
  while (m & 0x80000000) { bits++; m = (m << 1) >>> 0 }
  return bits
}

export function isValidIp(ip) {
  try { ipToInt(ip); return true } catch { return false }
}

export function ipClass(ipInt) {
  const first = ipInt >>> 24
  if (first < 128)  return 'A'
  if (first < 192)  return 'B'
  if (first < 224)  return 'C'
  if (first < 240)  return 'D (Multicast)'
  return 'E (Reserved)'
}

export function isPrivate(ipInt) {
  const first  = (ipInt >>> 24) & 0xff
  const second = (ipInt >>> 16) & 0xff
  if (first === 10) return true
  if (first === 172 && second >= 16 && second <= 31) return true
  if (first === 192 && second === 168) return true
  return false
}

export function calculateSubnet(cidr) {
  const parts = cidr.trim().split('/')
  if (parts.length !== 2) throw new Error('Enter as IP/prefix e.g. 192.168.1.0/24')
  const ip = parts[0].trim()
  const prefix = parseInt(parts[1], 10)
  if (isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error('Prefix must be 0–32')
  if (!isValidIp(ip)) throw new Error('Invalid IP address')

  const ipInt      = ipToInt(ip)
  const maskInt    = prefixToMask(prefix)
  const networkInt = (ipInt & maskInt) >>> 0
  const broadInt   = (networkInt | (~maskInt >>> 0)) >>> 0
  const wildcardInt = (~maskInt) >>> 0
  const totalHosts = prefix === 32 ? 1 : prefix === 31 ? 2 : Math.pow(2, 32 - prefix)
  const usableHosts = prefix >= 31 ? totalHosts : totalHosts - 2
  const firstHost  = prefix >= 31 ? networkInt : networkInt + 1
  const lastHost   = prefix >= 31 ? broadInt   : broadInt   - 1

  return {
    inputIp:    ip,
    prefix,
    ipInt,
    networkInt,
    maskInt,
    network:    intToIp(networkInt),
    broadcast:  intToIp(broadInt),
    mask:       intToIp(maskInt),
    wildcard:   intToIp(wildcardInt),
    firstHost:  intToIp(firstHost),
    lastHost:   intToIp(lastHost),
    totalHosts,
    usableHosts,
    ipClass:    ipClass(networkInt),
    isPrivate:  isPrivate(networkInt),
    cidr:       `${intToIp(networkInt)}/${prefix}`,
  }
}

export function splitSubnet(info, newPrefix) {
  if (newPrefix <= info.prefix || newPrefix > 32) return []
  const count = Math.min(Math.pow(2, newPrefix - info.prefix), 256)
  const size  = Math.pow(2, 32 - newPrefix)
  return Array.from({ length: count }, (_, i) => {
    const netInt = (info.networkInt + i * size) >>> 0
    return calculateSubnet(`${intToIp(netInt)}/${newPrefix}`)
  })
}

export function toBinary(ipInt) {
  return [24, 16, 8, 0].map(shift =>
    ((ipInt >>> shift) & 0xff).toString(2).padStart(8, '0')
  )
}
