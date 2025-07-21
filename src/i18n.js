// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                "welcome": "Welcome to Digi Shiksha",
                "voice_assistant": "Voice Assistant",
                "digital_learning": "Digital Learning",
                "wealth_management": "Wealth Management",
                "ask_ai": "Ask AI Anything",
                "notifications": "Notifications",
                "get_to_know": "Get to Know You",
                "education": "What is your education level?",
                "age": "What is your age?",
                "profession": "What is your profession?",
                "salary": "What is your monthly income?",
                "savings": "How much do you save monthly?",
                "existing_schemes": "Are you using any government schemes currently?",
                "thank_you": "Thank you! We will suggest solutions based on your answers.",
                "current_question": "Current Question",
                "listening": "Listening",
                "your_answer": "Your Answer",
                "collected": "Collected Data"
            }
        },
        hi: {
            translation: {
                "welcome": "डिजी शिक्षा में आपका स्वागत है",
                "voice_assistant": "वॉयस असिस्टेंट",
                "digital_learning": "डिजिटल लर्निंग",
                "wealth_management": "वेल्थ मैनेजमेंट",
                "ask_ai": "एआई से पूछें",
                "notifications": "सूचनाएं",
                "get_to_know": "हम आपको जानना चाहते हैं",
                "education": "आपकी शिक्षा स्तर क्या है?",
                "age": "आपकी उम्र क्या है?",
                "profession": "आपका पेशा क्या है?",
                "salary": "आपकी मासिक आय कितनी है?",
                "savings": "आप हर महीने कितनी बचत करते हैं?",
                "existing_schemes": "क्या आप किसी सरकारी योजना का उपयोग कर रहे हैं?",
                "thank_you": "धन्यवाद! हम आपके उत्तरों के आधार पर समाधान सुझाएंगे।"
            }
        }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
