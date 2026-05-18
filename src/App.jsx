import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import AlternatifPage from './pages/AlternatifPage';
import KriteriaPage from './pages/KriteriaPage';
import KalkulatorPage from './pages/KalkulatorPage';
import PerangkinganPage from './pages/PerangkinganPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alternatif" element={<AlternatifPage />} />
            <Route path="/kriteria" element={<KriteriaPage />} />
            <Route path="/kalkulator" element={<KalkulatorPage />} />
            <Route path="/perangkingan" element={<PerangkinganPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
