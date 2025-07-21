import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Card, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const questionsData = [
  { key: "education", en: "What is your education?", hi: "आपकी शिक्षा क्या है?", mr: "तुमचं शिक्षण काय आहे?" },
  { key: "age", en: "What is your age?", hi: "आपकी उम्र क्या है?", mr: "तुमचं वय काय आहे?" },
  { key: "profession", en: "What is your profession?", hi: "आपका पेशा क्या है?", mr: "तुमचं व्यवसाय काय आहे?" },
  { key: "salary", en: "What is your monthly income?", hi: "आपकी मासिक आय कितनी है?", mr: "तुमचं मासिक उत्पन्न काय आहे?" },
  { key: "savings", en: "How much do you save monthly?", hi: "आप हर महीने कितनी बचत करते हैं?", mr: "तुम दर महिन्याला किती बचत करता?" },
  { key: "schemes", en: "Are you using any government scheme?", hi: "क्या आप किसी सरकारी योजना का उपयोग कर रहे हैं?", mr: "तुम्ही कोणत्याही सरकारी योजनेंत भाग घेतलाय का?" }
];

function ClientAdvisorVoiceWizard() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lang, setLang] = useState('hi'); // 'en' | 'hi' | 'mr'

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { t } = useTranslation();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition not supported");
    }
  }, []);

  useEffect(() => {
    if (!listening && transcript) {
      saveAnswer(transcript);
    }
  }, [listening]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    setShow(true);
    setCurrent(0);
    setAnswers({});
    setTimeout(() => {
      askQuestion(0);
    }, 500);
  };

const askQuestion = (index) => {
  const q = questionsData[index];
  const utterance = new SpeechSynthesisUtterance(q[lang]);
  utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';

  // 🔴 Stop mic while speaking
  SpeechRecognition.stopListening();

  utterance.onend = () => {
    // ✅ Start mic when speaker finishes
    SpeechRecognition.startListening({ continuous: false, language: lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US' });
  };

  window.speechSynthesis.cancel(); // Cancel any existing speech
  window.speechSynthesis.speak(utterance);
};


  const saveAnswer = (text) => {
    const key = questionsData[current].key;
    const newAnswers = { ...answers, [key]: text };
    setAnswers(newAnswers);
    resetTranscript();

    if (current < questionsData.length - 1) {
      setCurrent(current + 1);
      askQuestion(current + 1);
    } else {
      finishInterview(newAnswers);
    }
  };

  const finishInterview = (collectedAnswers) => {
    console.log("Collected Profile: ", collectedAnswers);
    speak(lang === 'hi' ? "धन्यवाद! हम आपके उत्तरों के अनुसार सुझाव देंगे।" :
      lang === 'mr' ? "धन्यवाद! आम्ही तुमच्या उत्तरांनुसार उपाय सुचवू." :
        "Thank you! We will suggest solutions based on your answers.");
    SpeechRecognition.stopListening();
    setTimeout(() => setShow(false), 4000);
  };

  return (
    <>
      <Button
        variant="warning"
        style={{
          position: 'fixed',
          top: '40%',
          right: '16px',
          transform: 'rotate(-90deg)',
          transformOrigin: 'right center',
          zIndex: 1050,
          borderRadius: '8px 8px 0 0',
          padding: '8px 20px',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0px 2px 6px rgba(0,0,0,0.2)'
        }}
        onClick={startInterview}
      >
        {t("get_to_know")}
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("get_to_know")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card body>
            <p><strong>{t("current_question")}:</strong> {questionsData[current][lang]}</p>
            <p><strong>{t("listening")}:</strong> {listening ? "🎤..." : "Stopped"}</p>
            <p><strong>{t("your_answer")}:</strong> {transcript}</p>

            <p className="mt-3"><strong>{t("collected")}:</strong></p>
            <pre>{JSON.stringify(answers, null, 2)}</pre>

            <label className="mt-3">Language:</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="form-select">
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="en">English</option>
            </select>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default ClientAdvisorVoiceWizard;
