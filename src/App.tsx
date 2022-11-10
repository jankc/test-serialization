import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { createS11n } from './hooks/createS11n'
import { z } from 'zod';

function App() {

  const countSchema = z.number().int().min(0);
  const [serialize, deserialize] = createS11n({
    key: 'count',
    schema: countSchema,
    defaultValue: 0,
  })

  const [count, setCount] = useState(deserialize())

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          setCount((count) => count + 1);
          serialize(count + 1);
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
