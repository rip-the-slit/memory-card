import { useState } from 'react'
import './App.css'

function ScoresPanel({scores}) {
  return <section>
    <p><b className=''>Current score: </b>{scores.current}</p>
    <p><b className=''>Best score: </b>{scores.best}</p>
  </section>
}

function App() {
  const [scores, setScores] = useState({current: 0, best: 0})

  return (
    <>
      <main className='bg-black text-white m-0 h-screen'>
        <ScoresPanel scores={scores}></ScoresPanel>
        
      </main>
    </>
  )
}

export default App
