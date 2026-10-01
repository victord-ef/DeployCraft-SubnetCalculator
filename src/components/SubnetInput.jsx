import { useState } from 'react'

const EXAMPLES = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '10.10.0.0/16', '192.168.100.64/26']

export default function SubnetInput({ onCalculate, error }) {
  const [value, setValue] = useState('192.168.1.0/24')

  function submit(e) {
    e.preventDefault()
    onCalculate(value.trim())
  }

  return (
    <div className="card">
      <p className="card-title">Enter IP / CIDR</p>
      <p className="card-sub">Enter an IP address with prefix length to calculate all network details.</p>

      <form onSubmit={submit} className="input-row">
        <input
          className="input-field"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="e.g. 192.168.1.0/24"
          spellCheck={false}
          autoComplete="off"
        />
        <button type="submit" className="btn-primary">Calculate →</button>
      </form>

      {error && (
        <div className="error-msg">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="examples">
        <span className="examples-label">Examples:</span>
        {EXAMPLES.map(ex => (
          <button key={ex} className="btn-ghost" onClick={() => { setValue(ex); onCalculate(ex) }}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
