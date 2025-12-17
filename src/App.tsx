// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from './contexts/LocalizationContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import EnhancedAIAssistant from './components/AIAssistant/EnhancedAIAssistant';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Owners from './pages/clients/Owners';
import TravelerSpace from './pages/clients/TravelerSpace';
import PropertyDetail from './pages/PropertyDetail';
import Agency from './pages/company/Agency';
import Mag from './pages/company/Mag';
import Contact from './pages/company/Contact';
import SellingMultiStep from './pages/clients/SellingMultiStep';
import ConfidentialSelection from './pages/ConfidentialSelection';
import Auth from './pages/auth/Auth';
import Dashboard from './pages/auth/Dashboard';
import Services from './pages/auth/Services';
import NotFound from './pages/support/NotFound';
import Markets from './pages/auth/Markets';
import Privacy from './pages/support/Privacy';
import Terms from './pages/support/Terms';
import Help from './pages/support/Help';
import Concierge from './pages/special-pages/Concierge';
import Success from './pages/special-pages/Success';
import Careers from './pages/special-pages/Careers';
import LanguageCurrency from './pages/Settings/LanguageCurrency';
import AIFeaturesDemo from './pages/AIFeaturesDemo';

function App() {
  return (
    <LocalizationProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <Router>
          <div className="min-h-screen bg-ivory">
            <Header />
            <main>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/traveler" element={<TravelerSpace />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/mag" element={<Mag />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/selling-multistep" element={<SellingMultiStep />} />
            <Route path="/confidential" element={<ConfidentialSelection />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/concierge" element={<Concierge />} />
            <Route path="/success" element={<Success />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/settings" element={<LanguageCurrency />} />
            <Route path="/ai-demo" element={<AIFeaturesDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
            </main>
            <Footer />
            <EnhancedAIAssistant />
          </div>
        </Router>
      </Suspense>
    </LocalizationProvider>
  );
}

export default App;