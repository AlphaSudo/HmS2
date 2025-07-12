import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // Default to patient role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, setLocation] = useLocation();

  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { success, message } = await register(formData.username, formData.email, formData.password);
      
      if (success) {
        // After successful registration, automatically login the user
        const loginSuccess = await login(formData.username, formData.password, 'patient');
        
        if (loginSuccess) {
          // Now redirect to profile page as an authenticated user
          setLocation(`/patient-profile?email=${encodeURIComponent(formData.email)}`);
          toast({
            title: t('auth.success.signupSuccess'),
            description: t('auth.success.signupSuccessDesc'),
            variant: "default",
          });
        } else {
          // Registration succeeded but login failed - redirect to login page
          setLocation('/login');
          toast({
            title: t('auth.success.signupSuccess'),
            description: 'Account created! Please login to continue.',
            variant: "default",
          });
        }
      } else {
        toast({
          title: t('auth.errors.signupError'),
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: t('auth.errors.signupError'),
        description: t('auth.errors.signupErrorDesc'),
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.username && formData.email && formData.password && formData.confirmPassword && 
                     formData.password === formData.confirmPassword;

  return (
    <div className={`min-h-screen relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'} ${
      theme === 'dark' ? 'bg-[#040223]' : 'bg-background'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse ${
          theme === 'dark' ? 'bg-gradient-to-br from-purple-500/10 to-transparent' : 'bg-gradient-to-br from-primary/10 to-transparent'
        }`}></div>
        <div className={`absolute top-40 right-32 w-24 h-24 rounded-full animate-bounce delay-1000 ${
          theme === 'dark' ? 'bg-gradient-to-br from-pink-500/10 to-transparent' : 'bg-gradient-to-br from-accent/10 to-transparent'
        }`}></div>
        <div className={`absolute bottom-32 left-1/3 w-40 h-40 rounded-full animate-pulse delay-500 ${
          theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-transparent' : 'bg-gradient-to-br from-primary/10 to-transparent'
        }`}></div>
      </div>

      {/* Header */}
      <header className={`backdrop-blur-md shadow-2xl sticky top-0 z-50 ${
        theme === 'dark' ? 'bg-[#05002E]/80 border-b border-purple-500/20' : 'bg-card/80 border-b border-primary/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.brandName')}</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle />
              <Link href="/login">
                <button className={`transition-colors ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                }`}>
                  {t('auth.signup.backToLogin')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Signup Section */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Signup Card */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#05002E]/80 border border-purple-900/50 shadow-purple-900/30' 
              : 'bg-card/80 border border-border shadow-primary/30'
          }`}>
            {/* Card glow effect */}
            <div className={`absolute inset-0 opacity-50 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10' 
                : 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10'
            }`}></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('auth.signup.title')}</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('auth.signup.subtitle')}</p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.signup.username')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.signup.usernamePlaceholder')} className="w-full">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full py-3 ${isRTL ? 'pr-4 pl-12' : 'pl-12 pr-4'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.signup.usernamePlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <User className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.signup.email')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.signup.emailPlaceholder')} className="w-full">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full py-3 ${isRTL ? 'pr-4 pl-12' : 'pl-12 pr-4'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.signup.emailPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <Mail className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.signup.password')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.signup.passwordPlaceholder')} className="w-full">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full py-3 ${isRTL ? 'pr-12 pl-16' : 'pl-12 pr-16'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.signup.passwordPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                    <Tooltip content={showPassword ? t('auth.signup.hidePassword') : t('auth.signup.showPassword')}>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center transition-colors ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.signup.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.signup.confirmPasswordPlaceholder')} className="w-full">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full py-3 ${isRTL ? 'pr-12 pl-16' : 'pl-12 pr-16'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                    <Tooltip content={showConfirmPassword ? t('auth.signup.hidePassword') : t('auth.signup.showPassword')}>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center transition-colors ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-destructive'}`}>{t('auth.signup.passwordMismatch')}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <span className="relative z-10">{t('auth.signup.createAccount')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#A020F0] to-[#5D0A72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-muted-foreground'}`}>
              {t('auth.signup.alreadyHaveAccount')} 
              <Link href="/login" className={`${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:text-primary/80'} ${isRTL ? 'mr-1' : 'ml-1'} font-medium`}>
                {t('auth.signup.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-ping ${
          theme === 'dark' ? 'bg-purple-400' : 'bg-primary'
        }`}></div>
        <div className={`absolute top-3/4 right-1/4 w-1 h-1 rounded-full animate-ping delay-1000 ${
          theme === 'dark' ? 'bg-pink-400' : 'bg-accent'
        }`}></div>
        <div className={`absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full animate-ping delay-500 ${
          theme === 'dark' ? 'bg-blue-400' : 'bg-primary'
        }`}></div>
      </div>
    </div>
  );
} 