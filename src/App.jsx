import { useState } from 'react'
import { calculateSubnet } from './utils/subnet'
import SubnetInput from './components/SubnetInput'
import SubnetSummary from './components/SubnetSummary'
import BinaryView from './components/BinaryView'
import SubnetSplitter from './components/SubnetSplitter'

export default function App() {
  const [info, setInfo]   = useState(() => calculateSubnet('192.168.1.0/24'))
  const [error, setError] = useState(null)

  function handleCalculate(cidr) {
    try {
      setInfo(calculateSubnet(cidr))
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <header className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <a href="https://deploycraft.io" className="site">
              DeployCraft<span>.io</span>
            </a>
            <span className="sep">›</span>
            <span className="page">Subnet Calculator</span>
          </div>
          <span className="badge-tag">🌐 Networking Tools</span>
        </div>
      </header>

      <main className="main">
        <div>
          <h1 className="page-title">Subnet Calculator</h1>
          <p className="page-sub">
            CIDR to network range, mask, broadcast, host count, binary view, and subnet splitter — all in the browser.
          </p>
        </div>

        <SubnetInput onCalculate={handleCalculate} error={error} />

        {info && !error && (
          <>
            <SubnetSummary info={info} />
            <BinaryView info={info} />
            {info.prefix < 32 && <SubnetSplitter info={info} />}
          </>
        )}
      </main>

      <footer className="page-footer">
        © {new Date().getFullYear()} DeployCraft.io · Built by practitioners, for practitioners.
      </footer>
    </div>
  )
}
