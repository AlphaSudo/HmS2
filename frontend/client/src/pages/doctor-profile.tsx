import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Briefcase, User as UserIcon, Edit, Save, X, Calendar, Award, Users, Star } from 'lucide-react';
import { DoctorSidebar } from '@/components/ui/DoctorSidebar';
import { DoctorHeader } from '@/components/ui/DoctorHeader';
import { cn } from '@/lib/utils';
import { Doctor, UpdateDoctorRequest, Specialization, Gender, getSpecializationDisplay, getGenderDisplay, getStatusDisplay } from '@/components/types/doctor';
import { DoctorService } from '@/services/doctorService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DoctorProfilePage = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const { user, isDoctor } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateDoctorRequest>({});
  const [saving, setSaving] = useState(false);

  // Get current user ID from authentication context
  const currentUserId = user?.id ? parseInt(user.id) : null;

  useEffect(() => {
    fetchDoctorData();
  }, [currentUserId, isDoctor]);

  const fetchDoctorData = async () => {
    if (!currentUserId || !isDoctor) {
      setError('User not authenticated as doctor');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const doctorData = await DoctorService.getDoctorByUserId(currentUserId);
      setDoctor(doctorData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load doctor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (doctor) {
      setEditData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        mobile: doctor.mobile,
        licenseNumber: doctor.licenseNumber,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        qualification: doctor.qualification,
        dateOfBirth: doctor.dateOfBirth,
        gender: doctor.gender,
        hireDate: doctor.hireDate,
        status: doctor.status,
        consultationFee: doctor.consultationFee,
        bio: doctor.bio,
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSave = async () => {
    if (!doctor) return;

    try {
      setSaving(true);
      const updatedDoctor = await DoctorService.updateDoctor(doctor.id, editData);
      setDoctor(updatedDoctor);
      setIsEditing(false);
      setEditData({});
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UpdateDoctorRequest, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getYearsOfExperience = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
        <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64'))}>
          <DoctorHeader 
            title="Profile"
            subtitle="View and manage your professional profile"
            icon={<UserIcon className="w-6 h-6 text-teal-400" />}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
              <p className="mt-4 text-lg">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
        <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64'))}>
          <DoctorHeader 
            title="Profile"
            subtitle="View and manage your professional profile"
            icon={<UserIcon className="w-6 h-6 text-teal-400" />}
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error || "Failed to load profile"}</p>
              {currentUserId && isDoctor ? (
                <Button onClick={fetchDoctorData} variant="outline">
                  Try Again
                </Button>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Please make sure you are logged in as a doctor.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

  return (
    <div className={cn("min-h-screen flex", theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-gray-300' : 'bg-background text-foreground')}>
      <DoctorSidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? (isRTL ? 'mr-16' : 'ml-16') : (isRTL ? 'mr-64' : 'ml-64'))}>
        <DoctorHeader 
          title="Profile"
          subtitle="View and manage your professional profile"
          icon={<UserIcon className="w-6 h-6 text-teal-400" />}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className={cn("overflow-hidden shadow-lg rounded-2xl", theme === 'dark' ? 'bg-gray-800/60 border border-teal-500/20' : 'bg-white')}>
              <div className="h-48 bg-gradient-to-r from-teal-500 to-green-600 relative">
                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={saving}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-start -mt-24">
                  <Avatar className="w-32 h-32 border-4 shadow-lg" style={{ borderColor: theme === 'dark' ? '#111827' : 'white' }}>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${doctor.email}`} alt={fullName} />
                    <AvatarFallback className="text-2xl">{doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-6 mt-24">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editData.firstName || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                            placeholder="First Name"
                            className={`w-40 px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                              theme === 'dark' 
                                ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                            }`}
                          />
                          <input
                            type="text"
                            value={editData.lastName || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                            placeholder="Last Name"
                            className={`w-40 px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                              theme === 'dark' 
                                ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                                : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                            }`}
                          />
                        </div>
                        <select
                          value={editData.specialization || ''}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('specialization', e.target.value)}
                          className={`w-80 px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                        >
                          <option value="">Select specialization</option>
                          {Object.values(Specialization).map((spec) => (
                            <option key={spec} value={spec}>
                              {getSpecializationDisplay(spec)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold">{fullName}</h1>
                        <p className="text-lg text-teal-400">{getSpecializationDisplay(doctor.specialization)}</p>
                        <p className="text-sm text-gray-400">{getStatusDisplay(doctor.status)}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <Card className={cn("p-4", theme === 'dark' ? 'bg-gray-900/70' : 'bg-gray-100')}>
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <p className="text-2xl font-bold">{doctor.experienceYears}+</p>
                    <p className="text-sm text-gray-400">Years Experience</p>
                  </Card>
                  <Card className={cn("p-4", theme === 'dark' ? 'bg-gray-900/70' : 'bg-gray-100')}>
                    <div className="flex items-center justify-center mb-2">
                      <Award className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold">${doctor.consultationFee}</p>
                    <p className="text-sm text-gray-400">Consultation Fee</p>
                  </Card>
                  <Card className={cn("p-4", theme === 'dark' ? 'bg-gray-900/70' : 'bg-gray-100')}>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-bold">{doctor.licenseNumber}</p>
                    <p className="text-sm text-gray-400">License Number</p>
                  </Card>
                  <Card className={cn("p-4", theme === 'dark' ? 'bg-gray-900/70' : 'bg-gray-100')}>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold">{getYearsOfExperience(doctor.hireDate)}</p>
                    <p className="text-sm text-gray-400">Years at Hospital</p>
                  </Card>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-teal-500/30">About Me</h2>
                  {isEditing ? (
                    <textarea
                      value={editData.bio || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={5}
                      className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                        theme === 'dark' 
                          ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                          : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                      }`}
                    />
                  ) : (
                    <p className="text-base leading-relaxed">
                      {doctor.bio || "No bio available."}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-teal-500/30">Contact & Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-teal-400"/>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                          placeholder="Email"
                          className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                        />
                      ) : (
                        <a href={`mailto:${doctor.email}`} className="hover:underline">{doctor.email}</a>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-green-400"/>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.mobile || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mobile', e.target.value)}
                          placeholder="Mobile"
                          className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                        />
                      ) : (
                        <span>{doctor.mobile}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-3 text-cyan-400"/>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.qualification || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('qualification', e.target.value)}
                          placeholder="Qualification"
                          className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                            theme === 'dark' 
                              ? 'bg-[#040223]/50 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                              : 'bg-input border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                          }`}
                        />
                      ) : (
                        <span>{doctor.qualification}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="w-5 h-5 mr-3 text-purple-400"/>
                      <span>{getGenderDisplay(doctor.gender)} • Hired: {formatDate(doctor.hireDate)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfilePage; 