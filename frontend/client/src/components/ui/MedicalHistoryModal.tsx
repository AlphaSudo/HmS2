import React from 'react';
import { MedicalHistory } from '@/components/types/patient';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MedicalHistory | null;
}

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <div className="py-2">
      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className={`mt-1 text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value || 'N/A'}</p>
    </div>
  );
};

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({ isOpen, onClose, history }) => {
  const { theme } = useTheme();

  if (!isOpen || !history) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden transform transition-all ${theme === 'dark' ? 'bg-[#040223] border border-purple-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Medical History</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <DetailItem label="Height" value={`${history.height || 'N/A'} cm`} />
            <DetailItem label="Weight" value={`${history.weight || 'N/A'} kg`} />
          </div>
          <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
          <DetailItem label="Allergies" value={history.allergies?.join(', ')} />
          <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
          <DetailItem label="Past Conditions" value={history.pastConditions?.join(', ')} />
          <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Surgeries</h3>
            {history.surgeries?.length > 0 ? (
              <ul className="space-y-3">
                {history.surgeries.map((s, i) => (
                  <li key={i} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <p className="font-semibold">{s.surgery} - <span className="font-normal">{new Date(s.date).toLocaleDateString()}</span></p>
                    <p className="text-sm text-gray-500 mt-1">{s.notes}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No surgeries recorded.</p>}
          </div>

          <hr className={`my-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Medications</h3>
            {history.medications?.length > 0 ? (
              <ul className="space-y-3">
                {history.medications.map((m, i) => (
                  <li key={i} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <p className="font-semibold">{m.medication} ({m.dosage}, {m.frequency})</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(m.startDate).toLocaleDateString()} - {m.endDate ? new Date(m.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{m.notes}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500">No medications recorded.</p>}
          </div>
        </div>
        <div className="p-4 bg-opacity-50 border-t flex justify-end">
           <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}; 