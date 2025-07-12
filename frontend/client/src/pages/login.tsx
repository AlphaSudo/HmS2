import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { User, Lock } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, quickLogin, isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (user.role === 'patient') {
        setLocation('/patient/dashboard');
      } else if (user.role === 'doctor') {
        setLocation('/doctor/dashboard');
      } else {
        setLocation('/');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  const handleRoleLogin = async (role: UserRole) => {
    if (!username || !password) {
      toast({
        title: t('auth.errors.missingCredentials'),
        description: t('auth.errors.missingCredentialsDesc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password, role);
      
      if (success) {
        toast({
          title: t('auth.success.loginSuccess'),
          description: t('auth.success.loginSuccessDesc', { role }),
          className: `${theme === 'dark' ? "bg-[#05002E] border border-[#5D0A72]/20 text-white" : "bg-primary text-foreground"}`,
        });
        
      } else {
        toast({
          title: t('auth.errors.loginFailed'),
          description: t('auth.errors.loginFailedDesc'),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('auth.errors.loginError'),
        description: t('auth.errors.loginErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI-only toggle for developer quick-access buttons
  const [quickVisible, setQuickVisible] = useState(false);

  const handleQuickRole = (role: 'admin' | 'patient' | 'doctor') => {
    quickLogin(role);
    if (role === 'admin') {
      setLocation('/admin/dashboard');
    } else if (role === 'patient') {
      setLocation('/patient/dashboard');
    } else if (role === 'doctor') {
      setLocation('/doctor/dashboard');
    }
  };

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
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('auth.landing.brandName')}</span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle />
              <Link href="/">
                <button
                  className={`transition-colors duration-300 rounded-full px-4 py-2 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-black/10'
                  }`}
                >
                  {t('auth.login.backToHome')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Section */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Login Card */}
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
                <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('auth.login.title')}</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('auth.login.subtitle')}</p>
              </div>

              {/* Login Form */}
              <form className="space-y-6" noValidate>
                <div>
                  <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.login.username')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.login.usernamePlaceholder')} className="w-full">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.login.usernamePlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <User className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>
                    {t('auth.login.password')}
                  </label>
                  <div className="relative">
                    <Tooltip content={t('auth.login.passwordPlaceholder')} className="w-full">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full py-3 ${isRTL ? 'pr-12 pl-16' : 'pl-12 pr-16'} rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'bg-[#040223]/50 border-2 border-purple-700 text-white placeholder-gray-500 focus:ring-purple-500' 
                            : 'bg-input border-2 border-gray-400 text-foreground placeholder-muted-foreground focus:ring-primary'
                        }`}
                        placeholder={t('auth.login.passwordPlaceholder')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </Tooltip>
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'
                    }`} />
                    <Tooltip content={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}>
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

                {/* Quick Fill Credentials */}
                <div className="space-y-3">
                  <p className={`text-sm font-medium text-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>{t('auth.login.quickFill', 'Quick Fill Credentials')}</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* Admin Credentials */}
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('admin');
                        setPassword('password');
                      }}
                      className={`w-full py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-300 hover:scale-105 border ${
                        theme === 'dark'
                          ? 'bg-purple-900/30 border-purple-600 text-purple-300 hover:bg-purple-800/50 hover:shadow-md hover:shadow-purple-500/20'
                          : 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 hover:shadow-md hover:shadow-purple-500/20'
                      }`}
                    >
                      <span className="flex flex-col items-center">
                        <svg className="w-3 h-3 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin
                      </span>
                    </button>

                    {/* Doctor Credentials */}
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('dr.smith');
                        setPassword('password');
                      }}
                      className={`w-full py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-300 hover:scale-105 border ${
                        theme === 'dark'
                          ? 'bg-teal-900/30 border-teal-600 text-teal-300 hover:bg-teal-800/50 hover:shadow-md hover:shadow-teal-500/20'
                          : 'bg-teal-50 border-teal-300 text-teal-700 hover:bg-teal-100 hover:shadow-md hover:shadow-teal-500/20'
                      }`}
                    >
                      <span className="flex flex-col items-center">
                        <svg className="w-3 h-3 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Dr.Smith
                      </span>
                    </button>

                    {/* Patient Credentials */}
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('john.doe');
                        setPassword('password');
                      }}
                      className={`w-full py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-300 hover:scale-105 border ${
                        theme === 'dark'
                          ? 'bg-blue-900/30 border-blue-600 text-blue-300 hover:bg-blue-800/50 hover:shadow-md hover:shadow-blue-500/20'
                          : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-500/20'
                      }`}
                    >
                      <span className="flex flex-col items-center">
                        <svg className="w-3 h-3 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        John.Doe
                      </span>
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <p className={`text-sm font-medium text-center ${
                    theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                  }`}>{t('auth.login.roleSelection')}</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Patient Button */}
                    <button
                      type="button"
                      onClick={() => handleRoleLogin('patient')}
                      disabled={!username || !password || isLoading}
                      className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('auth.login.signingIn')}
                          </>
                        ) : (
                          <>
                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {t('auth.login.loginAsPatient')}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Admin Button */}
                    <button
                      type="button"
                      onClick={() => handleRoleLogin('admin')}
                      disabled={!username || !password || isLoading}
                      className="w-full bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('auth.login.signingIn')}
                          </>
                        ) : (
                          <>
                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {t('auth.login.loginAsAdmin')}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#A020F0] to-[#5D0A72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                     {/* Doctor Button */}
                     <button
                      type="button"
                      onClick={() => handleRoleLogin('doctor')}
                      disabled={!username || !password || isLoading}
                      className="w-full bg-gradient-to-r from-[#0d9488] to-[#0f766e] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('auth.login.signingIn')}
                          </>
                        ) : (
                          <>
                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8.5l-6.25 6.25-2.5-2.5-6.25 6.25" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a5 5 0 015 5c0 2.5-2 4.5-5 4.5S7 9.5 7 7a5 5 0 015-5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c-3.5 0-6.5 2-6.5 4.5V18h13v-1.5c0-2.5-3-4.5-6.5-4.5z" />
                             </svg>
                            {t('auth.login.loginAsDoctor')}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0f766e] to-[#0d9488] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>

                {/* Toggle for dev-only quick access */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setQuickVisible(!quickVisible)}
                    className="text-xs underline text-primary hover:text-primary/80"
                  >
                    {quickVisible ? 'Hide quick access' : 'Show quick access'}
                  </button>
                </div>

                {quickVisible && (
                  <div className="mt-2 space-y-2">
                    <p className={`text-sm font-medium text-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-foreground'
                    }`}>Quick Access (dev only)</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button type="button" className="py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700" onClick={() => handleQuickRole('admin')}>Admin</button>
                      <button type="button" className="py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => handleQuickRole('patient')}>Patient</button>
                      <button type="button" className="py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600" onClick={() => handleQuickRole('doctor')}>Doctor</button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {t('auth.login.noAccount')} 
              <Link href="/signup" className={`text-purple-400 hover:text-purple-300 ${isRTL ? 'mr-1' : 'ml-1'} font-medium`}>
                {t('auth.login.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-500"></div>
      </div>

    </div>
  );
} 