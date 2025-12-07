import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './routes/Home.jsx'
import Details from './routes/Details.jsx'
import Ticket from './routes/Tickets.jsx'
import Header from "./ui/Header.jsx"

function AppWrapper() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/tickets/:id" element={<Ticket />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)