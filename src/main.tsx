import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as DatabaseHandler from './Handlers/DatabaseHandler.tsx'
import { BrowserRouter } from 'react-router-dom'

await DatabaseHandler.openDatabase();
const weddingResult = await DatabaseHandler.getWedding();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App wedding={weddingResult} />
  </StrictMode>,
)
