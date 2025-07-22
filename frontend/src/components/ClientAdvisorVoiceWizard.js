import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Card, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const questionsData = [
  { key: "education", en: "What is your education?", hi: "आपकी शिक्षा क्या है?", mr: "तुमचं शिक्षण काय आहे?" },
  { key: "age", en: "What is your age?", hi: "आपकी उम्र क्या है?", mr: "तुमचं वय काय आहे?" },
  // { key: "profession", en: "What is your profession?", hi: "आपका पेशा क्या है?", mr: "तुमचं व्यवसाय काय आहे?" },
  { key: "salary", en: "What is your monthly income?", hi: "आपकी मासिक आय कितनी है?", mr: "तुमचं मासिक उत्पन्न काय आहे?" },
  { key: "savings", en: "How much do you save monthly?", hi: "आप हर महीने कितनी बचत करते हैं?", mr: "तुम दर महिन्याला किती बचत करता?" },
  { key: "schemes", en: "Are you using any government scheme?", hi: "क्या आप किसी सरकारी योजना का उपयोग कर रहे हैं?", mr: "तुम्ही कोणत्याही सरकारी योजनेंत भाग घेतलाय का?" }
];

function ClientAdvisorVoiceWizard({ setAiResponse }) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lang, setLang] = useState('hi'); // 'en' | 'hi' | 'mr'
  const [retryCount, setRetryCount] = useState(0);
  // const [aiResponse, setAiResponse] = useState('');


  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { t } = useTranslation();

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition not supported");
    }
  }, []);

  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      saveAnswer(transcript.trim());
    }
  }, [listening]);

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onend = () => {
      if (callback) callback();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    setShow(true);
    setCurrent(0);
    setAnswers({});
    setRetryCount(0);
    setTimeout(() => {
      askQuestion(0);
    }, 500);
  };

  const askQuestion = (index) => {
    clearTimeout(timeoutRef.current);

    const q = questionsData[index];
    setRetryCount(0);

    SpeechRecognition.stopListening();

    speak(q[lang], () => {
      startListeningWithTimeout();
    });
  };

  const startListeningWithTimeout = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-US' });

    timeoutRef.current = setTimeout(() => {
      handleNoResponse();
    }, 10000); // 10 seconds timeout
  };

  const handleNoResponse = () => {
    SpeechRecognition.stopListening();

    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      speak(lang === 'hi' ? "मैंने आपकी बात नहीं सुनी, कृपया दोहराएं।" :
        lang === 'mr' ? "मी तुमचं उत्तर ऐकू शकलो नाही, पुन्हा सांगा." :
          "I could not hear you, please repeat.", () => {
            startListeningWithTimeout();
          });
    } else {
      saveAnswer("No response");
    }
  };

  const saveAnswer = (text) => {
    clearTimeout(timeoutRef.current);
    const key = questionsData[current].key;
    const newAnswers = { ...answers, [key]: text };
    setAnswers(newAnswers);
    resetTranscript();

    if (current < questionsData.length - 1) {
      setCurrent(current + 1);
      setRetryCount(0);
      askQuestion(current + 1);
    } else {
      finishInterview(newAnswers);
    }
  };

  const finishInterview = async (collectedAnswers) => {
    console.log("Collected Profile: ", collectedAnswers);

    // Stop listening to microphone
    SpeechRecognition.stopListening();

    // Thank you message in selected language
    const thankYouMsg = lang === 'hi'
      ? "धन्यवाद! हम आपके उत्तरों के अनुसार सुझाव देंगे।"
      : lang === 'mr'
        ? "धन्यवाद! आम्ही तुमच्या उत्तरांनुसार उपाय सुचवू."
        : "Thank you! We will suggest solutions based on your answers.";

    speak(thankYouMsg);

    setTimeout(() => setShow(false), 1000);


    try {
      setAiResponse("loading");
      // Call backend API to get AI suggestions
      const res = await fetch('http://localhost:5000/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectedAnswers),
      });

      const data = await res.json();

      if (data.suggestion) {
        console.log(data.suggestion);
        // Show suggestion on the main screen
        setAiResponse(data.suggestion);
      } else {
        setAiResponse("No suggestions returned from AI.")
        // alert("No suggestions returned from AI.");
      }

    } catch (err) {
      console.error("Error contacting backend:", err);
      setAiResponse("Server error. Please try again later.");
    }

    // Close the wizard after a delay
    // setTimeout(() => setShow(false), 3000);
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
