import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'living-paraguay-language';

// Correcciones de contenido migratorio vigentes.
// La residencia temporal bajo la Ley N.º 6984/2022 ya no exige un depósito
// bancario de USD 5.000 ni un monto mínimo de inversión.
const migrationContentCorrections: Record<Language, {
  permits: Partial<Translations['permits']>;
  faq: Partial<Translations['faq']>;
}> = {
  es: {
    permits: {
      temporaryRequirement: 'Depósito bancario:',
      temporaryReq2: 'No se exige para la residencia temporal ni existe un monto mínimo de inversión',
      comparisonInvestment5k: 'No requerida',
    },
    faq: {
      q3: '¿Necesito realizar un depósito bancario para la residencia temporal?',
      a3: 'No. Para la residencia temporal bajo la Ley N.º 6984/2022 no se exige un depósito bancario de USD 5.000 ni un monto mínimo de inversión. La acreditación de solvencia económica se exige en determinados trámites de residencia permanente, según la categoría aplicable.',
    },
  },
  pt: {
    permits: {
      temporaryRequirement: 'Depósito bancário:',
      temporaryReq2: 'Não é exigido para a residência temporária e não há valor mínimo de investimento',
      comparisonInvestment5k: 'Não exigido',
    },
    faq: {
      q3: 'Preciso fazer um depósito bancário para a residência temporária?',
      a3: 'Não. Para a residência temporária pela Lei nº 6984/2022 não é exigido depósito bancário de USD 5.000 nem valor mínimo de investimento. A comprovação de solvência econômica é exigida em determinados processos de residência permanente, conforme a categoria aplicável.',
    },
  },
  en: {
    permits: {
      temporaryRequirement: 'Bank deposit:',
      temporaryReq2: 'Not required for temporary residence and there is no minimum investment amount',
      comparisonInvestment5k: 'Not required',
    },
    faq: {
      q3: 'Do I need to make a bank deposit for temporary residence?',
      a3: 'No. Temporary residence under Law No. 6984/2022 does not require a USD 5,000 bank deposit or any minimum investment amount. Proof of financial solvency is required for certain permanent-residence procedures, depending on the applicable category.',
    },
  },
  zh: {
    permits: {
      temporaryRequirement: '银行存款：',
      temporaryReq2: '临时居留无需银行存款，也没有最低投资金额要求',
      comparisonInvestment5k: '无需',
    },
    faq: {
      q3: '申请临时居留需要银行存款吗？',
      a3: '不需要。根据第6984/2022号法律，临时居留不要求5,000美元银行存款，也没有最低投资金额要求。根据适用类别，某些永久居留手续可能需要证明经济偿付能力。',
    },
  },
  de: {
    permits: {
      temporaryRequirement: 'Bankeinlage:',
      temporaryReq2: 'Für die befristete Aufenthaltserlaubnis nicht erforderlich; es gibt keinen Mindestinvestitionsbetrag',
      comparisonInvestment5k: 'Nicht erforderlich',
    },
    faq: {
      q3: 'Muss ich für die befristete Aufenthaltserlaubnis eine Bankeinlage leisten?',
      a3: 'Nein. Für die befristete Aufenthaltserlaubnis nach Gesetz Nr. 6984/2022 ist weder eine Bankeinlage von 5.000 USD noch ein Mindestinvestitionsbetrag erforderlich. Ein Nachweis der wirtschaftlichen Solvenz ist bei bestimmten Verfahren für die dauerhafte Aufenthaltserlaubnis je nach anwendbarer Kategorie erforderlich.',
    },
  },
};

const getTranslations = (language: Language): Translations => {
  const base = translations[language];
  const corrections = migrationContentCorrections[language];

  return {
    ...base,
    permits: {
      ...base.permits,
      ...corrections.permits,
    },
    faq: {
      ...base.faq,
      ...corrections.faq,
    },
  };
};

// Función para obtener el idioma guardado o el predeterminado
const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'es' || savedLanguage === 'pt' || savedLanguage === 'en' || savedLanguage === 'zh' || savedLanguage === 'de') {
      return savedLanguage;
    }
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }
  return 'es'; // Idioma predeterminado
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Guardar el idioma en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: getTranslations(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
