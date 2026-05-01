import type * as Types from './Models/Types'
import './App.css'
import './css/shared.css'
import { TopBar } from './Views/TopBar'
import { Home } from './Views/Home'
import { NewWedding } from './Views/NewWedding'
import * as DatabaseHandler from './Handlers/DatabaseHandler.tsx'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Guests } from './Views/Guests'

await DatabaseHandler.openDatabase();


// function useAddGuest() {
//   // Doing something with the guest after adding it
//   const [status, setStatus] = useState('pending')
//   return {
//     add: (user) => {
//       setStatus('success')
//     },
//     status: status,
//   }
// }

// function Body(props: { wedding: Types.Wedding | null }) {
//   const isNewEvent = props.wedding == null;

//   return (
//     <Routes>
//       <Route path="/" element={<Home wedding={props.wedding} />}></Route>
//       <Route path="/guests" element={isNewEvent ? <Home wedding={null} /> : <Guests />}></Route>
//     </Routes>
//   )
// }

function App(props: { wedding: Types.Wedding | null }) {
  // hook method
  // const myhook = useAddGuest();
  // console.log(myhook.status)
  const isNewEvent = props.wedding == null;

  return (
    <BrowserRouter>
      <TopBar />
      <nav>
        <Link to="/"></Link>
        <Link to="/guests"></Link>
      </nav>
      <Routes>
        <Route path="/" element={isNewEvent ? <Navigate to="/newWedding" replace /> : <Home wedding={props.wedding!} />}></Route>
        <Route path="/guests" element={isNewEvent ? <NewWedding /> : <Guests />}></Route>
        <Route path="/newWedding" element={<NewWedding />}></Route>
      </Routes>
      {/* <Body wedding={props.wedding} /> */}

      {/* <div className="card">
        <button onClick={async () => {
          const res = await DatabaseHandler.addGuest({})
          // do something with the promise result
        }}>
          Add Guest
        </button>
        <button onClick={() => {
          DatabaseHandler.getGuests().then(guests => {
            // do something with the promise result
          })
        }}>
          Get Guests
        </button>
        <ButtonGroup />
      </div> */}
    </BrowserRouter>
  )
}

export default App