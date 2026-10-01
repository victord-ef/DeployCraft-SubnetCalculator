import { toBinary } from '../utils/subnet'

function OctetBits({ octet, start, prefix }) {
  return (
    <>
      {octet.split('').map((bit, i) => (
        <span key={i} className={start + i < prefix ? 'bit-net' : 'bit-host'}>{bit}</span>
      ))}
    </>
  )
}

function BinRow({ label, ipInt, prefix }) {
  const octets = toBinary(ipInt)
  const dec = octets.map(o => parseInt(o, 2)).join('.')
  return (
    <div className="binary-row">
      <span className="binary-label">{label}</span>
      <span className="binary-bits">
        {octets.map((octet, i) => (
          <span key={i}>
            <OctetBits octet={octet} start={i * 8} prefix={prefix} />
            {i < 3 && <span className="octet-sep">.</span>}
          </span>
        ))}
      </span>
      <span className="binary-dec">{dec}</span>
    </div>
  )
}

export default function BinaryView({ info }) {
  const broadInt = (info.networkInt | (~info.maskInt >>> 0)) >>> 0
  return (
    <div className="card">
      <div className="summary-header">
        <p className="card-title" style={{ marginBottom: 0 }}>Binary View</p>
        <div className="binary-legend">
          <span className="legend-item">
            <span className="legend-swatch legend-net" /> <span style={{ color: 'var(--cyan)' }}>Network bits</span>
          </span>
          <span className="legend-item">
            <span className="legend-swatch legend-host" /> <span style={{ color: 'var(--accent)' }}>Host bits</span>
          </span>
        </div>
      </div>

      <BinRow label="IP Address"      ipInt={info.ipInt}      prefix={info.prefix} />
      <BinRow label="Subnet Mask"     ipInt={info.maskInt}    prefix={info.prefix} />
      <BinRow label="Network Address" ipInt={info.networkInt} prefix={info.prefix} />
      <BinRow label="Broadcast"       ipInt={broadInt}        prefix={info.prefix} />

      <div className="binary-meta">
        <span>Prefix: <span>/{info.prefix}</span></span>
        <span>Network bits: <span style={{ color: 'var(--cyan)' }}>{info.prefix}</span></span>
        <span>Host bits: <span style={{ color: 'var(--accent)' }}>{32 - info.prefix}</span></span>
      </div>
    </div>
  )
}
