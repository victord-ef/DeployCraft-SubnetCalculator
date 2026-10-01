import { useState, useMemo } from 'react'
import { splitSubnet } from '../utils/subnet'

export default function SubnetSplitter({ info }) {
  const maxPrefix = Math.min(info.prefix + 8, 32)
  const [newPrefix, setNewPrefix] = useState(Math.min(info.prefix + 1, 32))

  const subnets = useMemo(() => splitSubnet(info, newPrefix), [info, newPrefix])

  const count      = Math.pow(2, newPrefix - info.prefix)
  const capped     = count > 256
  const hostsEach  = subnets[0]?.usableHosts ?? 0

  return (
    <div className="card">
      <p className="card-title">Subnet Splitter</p>
      <p className="card-sub">
        Divide <strong style={{ color: 'var(--cyan)', fontFamily: 'monospace' }}>{info.cidr}</strong> into equal subnets by selecting a new prefix length.
      </p>

      <div className="splitter-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
            New prefix
          </span>
          <select
            value={newPrefix}
            onChange={e => setNewPrefix(Number(e.target.value))}
            className="input-field"
            style={{ width: '110px', flex: 'none' }}
          >
            {Array.from({ length: maxPrefix - info.prefix }, (_, i) => info.prefix + 1 + i).map(p => (
              <option key={p} value={p}>/{p}</option>
            ))}
          </select>
        </div>
        <span className="splitter-stat">Subnets: <span style={{ color: 'var(--cyan)' }}>{capped ? '256+' : count}</span></span>
        <span className="splitter-stat">Usable hosts each: <span style={{ color: 'var(--accent)' }}>{hostsEach.toLocaleString()}</span></span>
      </div>

      {capped && (
        <p className="warn-text">Showing first 256 of {count.toLocaleString()} subnets.</p>
      )}

      <table className="subnet-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Network</th>
            <th>First Host</th>
            <th>Last Host</th>
            <th>Broadcast</th>
            <th style={{ textAlign: 'right' }}>Usable</th>
          </tr>
        </thead>
        <tbody>
          {subnets.map((s, i) => (
            <tr key={i}>
              <td className="td-index">{i + 1}</td>
              <td className="td-net">{s.cidr}</td>
              <td>{s.firstHost}</td>
              <td>{s.lastHost}</td>
              <td style={{ color: 'var(--muted)' }}>{s.broadcast}</td>
              <td className="td-hosts">{s.usableHosts.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
