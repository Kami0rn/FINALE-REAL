import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './pages/login/Login';
import Index from './pages/index/Index';
import Register from './pages/register/Register';
import UserProfile from './pages/login/Profile';
import Tracing from './pages/tracing/Tracing';
import Train from './pages/train/Train';
import Generate from './pages/generate/Generate';
import Blockchain from './pages/blockchain/Blockchain';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register'element={<Register />} />
        <Route path='/train' element={<Train />} />
        <Route path='/blockchain' element={<Blockchain />} />
        <Route path='/tracing' element={<Tracing />} />\
        <Route path='/generate' element={<Generate />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
