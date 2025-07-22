import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import VoiceAssistant from './components/VoiceAssistant';
import DigitalLearning from './components/DigitalLearning';
import WealthManagement from './components/WealthManagement';
import AIAnything from './components/AIAnything';
import Notifications from './components/Notifications';
import FeedbackWidget from './components/ClientAdvisorVoiceWizard';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
  const [aiSuggestions, setAiSuggestions] = useState('')
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<VoiceAssistant suggestions={aiSuggestions} />} />
        <Route path="/digital-learning" element={<DigitalLearning />} />
        <Route path="/wealth" element={<WealthManagement />} />
        <Route path="/ai-anything" element={<AIAnything />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
      <FeedbackWidget setAiResponse={setAiSuggestions}/>
    </Router>
  );
}

export default App;
