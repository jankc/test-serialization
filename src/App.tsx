import './App.css'
import { CountWithHooks } from './CoutWithHooka';
import { Count } from './Count';

function App() {


  
  return (
    <div className="App">
      <h1>UI Settings MVP</h1>
      <div className="card">
        <p>
          Count
        </p>
        <Count />
      </div>
      <div className="card">
        <p>
          Count with Hooks
        </p>
        <CountWithHooks />
      </div>
    </div>
  )
}

export default App
