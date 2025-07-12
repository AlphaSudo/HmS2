import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PatientHeader } from "@/components/ui/PatientHeader";
import { PatientSidebar } from "@/components/ui/PatientSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { GenericFormModal, FieldConfig } from "@/components/ui/GenericFormModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface StrokeAssessmentData {
  patientId?: number;
  gender: string;
  age: number;
  hypertension: number;
  heart_disease: number;
  ever_married: string;
  work_type: string;
  Residence_type: string;
  avg_glucose_level: number;
  bmi: number;
  smoking_status: string;
}

interface StrokePredictionResult {
  stroke_risk: number;
  probability: number;
  risk_level: string;
  patient_id?: number;
  prediction_timestamp: string;
}

export default function StrokeAssessmentPage() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<StrokePredictionResult | null>(null);
  const [formData, setFormData] = useState<Partial<StrokeAssessmentData>>({
    gender: "",
    age: 0,
    hypertension: 0,
    heart_disease: 0,
    ever_married: "",
    work_type: "",
    Residence_type: "",
    avg_glucose_level: 0,
    bmi: 0,
    smoking_status: ""
  });
  
  const { toast } = useToast();
  const { theme } = useTheme();

  const formFields: FieldConfig[] = [
    {
      id: "gender",
      label: t('strokeAssessment.gender','Gender'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.selectGender','Select Gender'), disabled: true },
        { value: "Male", label: t('common.male','Male') },
        { value: "Female", label: t('common.female','Female') }
      ]
    },
    {
      id: "age",
      label: t('strokeAssessment.age','Age'),
      type: "number",
      required: true
    },
    {
      id: "hypertension",
      label: t('strokeAssessment.hypertension','Hypertension'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.select','Select'), disabled: true },
        { value: "0", label: t('common.no','No') },
        { value: "1", label: t('common.yes','Yes') }
      ]
    },
    {
      id: "heart_disease",
      label: t('strokeAssessment.heartDisease','Heart Disease'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.select','Select'), disabled: true },
        { value: "0", label: t('common.no','No') },
        { value: "1", label: t('common.yes','Yes') }
      ]
    },
    {
      id: "ever_married",
      label: t('strokeAssessment.everMarried','Ever Married'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.select','Select'), disabled: true },
        { value: "Yes", label: t('common.yes','Yes') },
        { value: "No", label: t('common.no','No') }
      ]
    },
    {
      id: "work_type",
      label: t('strokeAssessment.workType','Work Type'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('strokeAssessment.selectWorkType','Select Work Type'), disabled: true },
        { value: "Private", label: t('common.private','Private') },
        { value: "Self-employed", label: t('common.selfEmployed','Self-employed') },
        { value: "Govt_job", label: t('common.govtJob','Government Job') },
        { value: "children", label: t('common.children','Children') },
        { value: "Never_worked", label: t('common.neverWorked','Never Worked') }
      ]
    },
    {
      id: "Residence_type",
      label: t('strokeAssessment.residenceType','Residence Type'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.selectResidence','Select Residence'), disabled: true },
        { value: "Urban", label: t('common.urban','Urban') },
        { value: "Rural", label: t('common.rural','Rural') }
      ]
    },
    {
      id: "avg_glucose_level",
      label: t('strokeAssessment.avgGlucoseLevel','Average Glucose Level (mg/dL)'),
      type: "number",
      required: true
    },
    {
      id: "bmi",
      label: t('strokeAssessment.bmi','BMI (Body Mass Index)'),
      type: "number",
      required: true
    },
    {
      id: "smoking_status",
      label: t('strokeAssessment.smokingStatus','Smoking Status'),
      type: "select",
      required: true,
      options: [
        { value: "", label: t('common.selectSmokingStatus','Select Smoking Status'), disabled: true },
        { value: "never smoked", label: t('common.neverSmoked','Never Smoked') },
        { value: "formerly smoked", label: t('common.formerlySmoked','Formerly Smoked') },
        { value: "smokes", label: t('common.currentlySmokes','Currently Smokes') },
        { value: "Unknown", label: t('common.unknown','Unknown') }
      ]
    }
  ];

  const handleFormSubmit = async (data: Partial<StrokeAssessmentData>) => {
    setIsLoading(true);
    try {
      // Convert string values to numbers where needed
      const assessmentData: StrokeAssessmentData = {
        ...data,
        age: Number(data.age),
        hypertension: Number(data.hypertension),
        heart_disease: Number(data.heart_disease),
        avg_glucose_level: Number(data.avg_glucose_level),
        bmi: Number(data.bmi)
      } as StrokeAssessmentData;

      // Call the backend API
      const response = await fetch('/api/patients/stroke-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to get stroke prediction');
      }

      const result: StrokePredictionResult = await response.json();
      setPrediction(result);
      setIsFormOpen(false);

      toast({
        title: t('strokeAssessment.assessmentComplete','Assessment Complete'),
        description: `${t('strokeAssessment.riskLevel', 'Stroke risk assessment completed. Risk level:')} ${result.risk_level}`,
        variant: result.stroke_risk === 1 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('common.error','Error'),
        description: `${t('strokeAssessment.assessmentFailed','Failed to complete stroke risk assessment. Please try again.')}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high risk':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low risk':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={cn('flex h-screen', theme==='dark' ? 'bg-gradient-to-br from-[#05002E] to-[#12072e] text-white' : 'bg-background text-foreground')}>
      <PatientSidebar isOpen={true} isCollapsed={!sidebarOpen} setIsCollapsed={(collapsed: boolean) => setSidebarOpen(!collapsed)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : (isRTL ? 'mr-16' : 'ml-16')}`}>
        <PatientHeader 
            title={t('strokeAssessment.title','Stroke Risk Assessment')} 
            subtitle={t('strokeAssessment.subtitle','AI-powered stroke risk prediction')} 
            icon={<Activity className="w-5 h-5 text-white" />} 
         />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className={`text-3xl font-bold ${theme==='dark' ? 'text-white' : 'text-gray-900'}`}>{t('strokeAssessment.heading','Stroke Risk Assessment')}</h1>
              <p className={`${theme==='dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                {t('strokeAssessment.subheading','AI-powered stroke risk prediction based on patient medical data')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assessment Form Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('strokeAssessment.patientAssessment','Patient Assessment')}</CardTitle>
                  <CardDescription>
                    {t('strokeAssessment.enterPatientInfo','Enter patient information to assess stroke risk')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button 
                    onClick={() => {
                      // Reset form data to defaults before opening
                      setFormData({
                        gender: "",
                        age: 0,
                        hypertension: 0,
                        heart_disease: 0,
                        ever_married: "",
                        work_type: "",
                        Residence_type: "",
                        avg_glucose_level: 0,
                        bmi: 0,
                        smoking_status: ""
                      });
                      setIsFormOpen(true);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? t('strokeAssessment.processing','Processing...') : t('strokeAssessment.startNewAssessment','Start New Assessment')}
                  </button>
                </CardContent>
              </Card>

              {/* Results Card */}
              {prediction && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('strokeAssessment.assessmentResults','Assessment Results')}</CardTitle>
                    <CardDescription>
                      {t('strokeAssessment.latestPrediction','Latest stroke risk prediction')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getRiskLevelColor(prediction.risk_level)}`}>
                      <h3 className="font-semibold text-lg">{prediction.risk_level}</h3>
                      <p className="text-sm opacity-75">
                        {t('strokeAssessment.probability','Probability')}: {(prediction.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>{t('strokeAssessment.assessmentCompleted','Assessment completed')}: {new Date(prediction.prediction_timestamp).toLocaleString()}</p>
                      {prediction.patient_id && (
                        <p>{t('strokeAssessment.patientId','Patient ID')}: {prediction.patient_id}</p>
                      )}
                    </div>

                    {prediction.stroke_risk === 1 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800">{t('strokeAssessment.immediateActionRequired','⚠️ Immediate Action Required')}</h4>
                        <p className="text-red-700 text-sm mt-1">
                          {t('strokeAssessment.highStrokeRiskDetected','High stroke risk detected. Please consult with a physician immediately for further evaluation and preventive measures.')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Assessment Form Modal */}
      <GenericFormModal<StrokeAssessmentData>
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditMode={false}
        title={t('strokeAssessment.title','Stroke Risk Assessment')}
        fields={formFields}
      />
    </div>
  );
} 