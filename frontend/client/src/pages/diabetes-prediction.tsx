
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Heart, Activity, Droplet, TestTube, AlertTriangle, FileText, Bot } from "lucide-react";
import { PatientHeader } from "@/components/ui/PatientHeader";

// Based on backend/hms/diabetes-prediction-service/app/schemas/diabetes.py
interface DiabetesPatientData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

interface PredictionResponse {
  diabetes_risk: number;
  probability: number;
  risk_level: string;
}

const initialFormData: DiabetesPatientData = {
    Pregnancies: 6,
    Glucose: 148,
    BloodPressure: 72,
    SkinThickness: 35,
    Insulin: 0,
    BMI: 33.6,
    DiabetesPedigreeFunction: 0.627,
    Age: 50,
};

export default function DiabetesPredictionPage() {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DiabetesPatientData>(initialFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handlePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8088/diabetes-prediction/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction request failed');
      }

      const result: PredictionResponse = await response.json();
      setPrediction(result);
      
      toast({
        title: "Prediction Successful",
        description: "Diabetes risk has been assessed.",
        className: "bg-green-500/20 text-green-300 border-green-500/30",
      });

    } catch (error) {
      toast({
        title: "Prediction Error",
        description: "Could not get a prediction. Please check the inputs or try again later.",
        variant: "destructive",
      });
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string, isLight: boolean) => {
    switch (riskLevel) {
      case 'High':
        return isLight ? 'text-red-600' : 'text-red-400';
      case 'Medium':
        return isLight ? 'text-yellow-600' : 'text-yellow-400';
      case 'Low':
        return isLight ? 'text-green-600' : 'text-green-400';
      default:
        return isLight ? 'text-gray-600' : 'text-gray-400';
    }
  };

  const isLightMode = theme === 'light';

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-[#0f0728] via-[#190a3e] to-[#0f0728] text-white' : 'bg-slate-50 text-slate-900')}>
      <PatientSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64')} p-8`}>
        <PatientHeader 
            title={t('diabetesPrediction.title', 'Diabetes Prediction')} 
            subtitle={t('diabetesPrediction.subtitle', 'Assess diabetes risk using health metrics')} 
            icon={<Activity className="w-5 h-5 text-white" />} 
         />

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form 
                onSubmit={handlePrediction} 
                className={cn(
                  'backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300', 
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
                )}
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <FileText className={cn("w-6 h-6", isLightMode ? "text-indigo-600" : "text-purple-400")} />
                  {t('diabetesPrediction.form.title', 'Patient Health Data')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(initialFormData).map((key) => (
                    <div key={key}>
                      <label className={cn("block text-sm font-medium mb-2", isLightMode ? "text-slate-700" : "text-gray-300")}>
                        {t(`diabetesPrediction.form.${key}`, key.replace(/([A-Z])/g, ' $1').trim())}
                      </label>
                      <input
                        type="number"
                        step={key === 'BMI' || key === 'DiabetesPedigreeFunction' ? '0.1' : '1'}
                        name={key}
                        value={formData[key as keyof DiabetesPatientData]}
                        onChange={handleInputChange}
                        className={cn('w-full px-3 py-3 rounded-xl focus:ring-2 focus:border-transparent', theme === 'dark' ? 'bg-[#1a0a2e] border-white/20 text-white focus:ring-purple-500' : 'bg-slate-100 border-slate-300 text-slate-900 focus:ring-indigo-500')}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:from-[#7C3AED] hover:to-[#0891B2] transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        {t('diabetesPrediction.buttons.assessing', 'Assessing...')}
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        {t('diabetesPrediction.buttons.predict', 'Predict Risk')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Prediction Result */}
            <motion.div 
              className="flex flex-col gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div 
                className={cn(
                  'backdrop-blur-sm rounded-2xl p-6 border h-full flex flex-col justify-center items-center transition-all duration-300', 
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-slate-200 shadow-sm'
                )}
              >
                <h3 className="text-xl font-semibold mb-4 text-center">{t('diabetesPrediction.result.title', 'Prediction Result')}</h3>
                {isLoading && (
                  <div className="text-center">
                    <Activity className={cn("w-12 h-12 mx-auto animate-pulse", isLightMode ? "text-indigo-500" : "text-purple-400")} />
                    <p className={cn("mt-4", isLightMode ? "text-slate-600" : "text-gray-400")}>{t('diabetesPrediction.result.loading', 'Analyzing data...')}</p>
                  </div>
                )}
                {!isLoading && !prediction && (
                  <div className="text-center">
                    <Droplet className={cn("w-12 h-12 mx-auto", isLightMode ? "text-slate-400" : "text-gray-500")} />
                    <p className={cn("mt-4", isLightMode ? "text-slate-600" : "text-gray-400")}>{t('diabetesPrediction.result.pending', 'Results will be displayed here.')}</p>
                  </div>
                )}
                {prediction && (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className={`text-5xl font-bold ${getRiskColor(prediction.risk_level, isLightMode)}`}>
                      {`${(prediction.probability * 100).toFixed(1)}%`}
                    </p>
                    <p className="mt-2 text-lg font-medium">{t('diabetesPrediction.result.riskOf', 'Risk of Diabetes')}</p>
                    <div className={cn(
                      'mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold border',
                      getRiskColor(prediction.risk_level, isLightMode),
                      isLightMode
                        ? `${getRiskColor(prediction.risk_level, isLightMode).replace('text', 'bg')}-100 ${getRiskColor(prediction.risk_level, isLightMode).replace('text', 'border')}-300`
                        : `${getRiskColor(prediction.risk_level, isLightMode).replace('text', 'bg')}/10 ${getRiskColor(prediction.risk_level, isLightMode).replace('text', 'border')}/30`
                    )}>
                       {prediction.risk_level === 'High' && <AlertTriangle className="w-5 h-5" />}
                       {prediction.risk_level === 'Medium' && <AlertTriangle className="w-5 h-5" />}
                       {prediction.risk_level === 'Low' && <TestTube className="w-5 h-5" />}
                      {prediction.risk_level} Risk
                    </div>
                    <p className={cn("mt-4 text-sm", isLightMode ? "text-slate-600" : "text-gray-400")}>
                      {prediction.diabetes_risk === 1 
                        ? t('diabetesPrediction.result.hasDisease', 'The model predicts a high risk of diabetes.')
                        : t('diabetesPrediction.result.noDisease', 'The model does not predict a high risk of diabetes.')}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 