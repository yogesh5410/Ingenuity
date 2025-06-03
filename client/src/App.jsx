import React from 'react'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import toast, { Toaster } from 'react-hot-toast';
import Footer from './components/Footer.jsx';

const App = () => {

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />

        <Toaster />
        
    </div>
  )
}

export default App
