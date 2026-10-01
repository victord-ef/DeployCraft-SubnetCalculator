import { useState } from 'react'

function Row({ label, value, copyable = true }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="summary-row">
      <span className="row-label">{label}</span>
      <span className="row-value">{value}</span>
      {copyable && (
        <button className="copy-btn" onClick={copy}>{copied ? '✓ copied' : 'copy'}</button>
      )}
    </div>
  )
}

export default function SubnetSummary({ info }) {
  return (
    <div className="card">
      <div className="summary-header">
        <p className="card-title" style={{ marginBottom: 0 }}>Network Summary</p>
        <div className="badge-row">
          <span className={`badge ${info.isPrivate ? 'badge-private' : 'badge-public'}`}>
            {info.isPrivate ? 'Private' : 'Public'}
          </span>
          <span className="badge badge-class">Class {info.ipClass}</span>
        </div>
      </div>

      <Row label="Network Address"   value={info.network} />
      <Row label="Broadcast Address" value={info.broadcast} />
      <Row label="Subnet Mask"       value={info.mask} />
      <Row label="Wildcard Mask"     value={info.wildcard} />
      <Row label="CIDR Notation"     value={info.cidr} />
      <Row label="First Host"        value={info.firstHost} />
      <Row label="Last Host"         value={info.lastHost} />
      <Row label="Total Hosts"       value={info.totalHosts.toLocaleString()} copyable={false} />
      <Row label="Usable Hosts"      value={info.usableHosts.toLocaleString()} copyable={false} />
    </div>
  )
}
