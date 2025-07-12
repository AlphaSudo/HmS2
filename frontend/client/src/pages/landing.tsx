import { Link } from "wouter";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Maximize2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Icons - In a real app, these might be separate components or from an icon library
const CardiologyIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const DiagnosticsIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const OrthopedicIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8z" /></svg>;
const DentalIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SurgeryIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 9l-5 5h10l-5-5zM7 9V3m0 6h10m-5 5v6" /></svg>;
const NeurologyIcon = ({ theme }: { theme: string }) => <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 16.663c.248.248.57.38.904.38s.656-.132.904-.38l2.828-2.828c.497-.497.497-1.31 0-1.808l-2.828-2.828c-.497-.497-1.31-.497-1.808 0l-2.828 2.828c-.497.497-.497 1.31 0 1.808l2.828 2.828zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>;

export default function LandingPage() {
  const [openAccordion, setOpenAccordion] = useState('mission');
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { logout } = useAuth();

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const services = [
    { name: t('landing.services.cardiology.name'), icon: <CardiologyIcon theme={theme} />, description: t('landing.services.cardiology.description') },
    { name: t('landing.services.diagnostics.name'), icon: <DiagnosticsIcon theme={theme} />, description: t('landing.services.diagnostics.description') },
    { name: t('landing.services.orthopedic.name'), icon: <OrthopedicIcon theme={theme} />, description: t('landing.services.orthopedic.description') },
    { name: t('landing.services.dental.name'), icon: <DentalIcon theme={theme} />, description: t('landing.services.dental.description') },
    { name: t('landing.services.surgery.name'), icon: <SurgeryIcon theme={theme} />, description: t('landing.services.surgery.description') },
    { name: t('landing.services.neurology.name'), icon: <NeurologyIcon theme={theme} />, description: t('landing.services.neurology.description') },
  ];

  const doctors = [
    { name: 'Dr. John Doe', specialty: t('landing.doctors.specialties.cardiologist'), image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Dr. Jane Smith', specialty: t('landing.doctors.specialties.neurologist'), image: 'https://images.unsplash.com/photo-1594824804732-ca8db7f60262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Dr. Robert Brown', specialty: t('landing.doctors.specialties.orthopedicSurgeon'), image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  const testimonials = [
    { quote: t('landing.testimonials.testimonial1'), name: `${t('landing.testimonials.patient')} A` },
    { quote: t('landing.testimonials.testimonial2'), name: `${t('landing.testimonials.patient')} B` },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#040223] text-white' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <header className={`backdrop-blur-md shadow-2xl sticky top-0 z-50 ${theme === 'dark' ? 'bg-[#05002E]/80 border-b border-purple-500/20' : 'bg-card/80 border-b border-primary/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4 justify-between">
            {/* LTR Layout: Logo → Navigation → Actions */}
            {!isRTL ? (
              <>
                {/* Logo Section - Left side for LTR */}
                <div className="flex items-center space-x-3 logo-container">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.brandName')}</span>
                </div>

                {/* Navigation - Center for LTR */}
                <nav className="hidden lg:flex navigation-menu space-x-8">
                  <a href="#home" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.home')}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#about" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.about')}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#departments" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.departments')}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#doctors" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.doctors')}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#contact" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.contact')}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                </nav>

                {/* Actions Section - Right side for LTR */}
                <div className="flex items-center gap-4 actions-container">
                  <ThemeToggle />
                  <LanguageToggle />
                  <button onClick={handleToggleFullScreen} className={`p-2 rounded-full transition-colors ${theme==='dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-primary/10 hover:bg-primary/20'}`}> 
                    <Maximize2 className={`w-5 h-5 ${theme==='dark' ? 'text-gray-300' : 'text-primary'}`} />
                  </button>
                  <Link href="/login">
                    <button onClick={logout} className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white hover:shadow-2xl hover:shadow-purple-500/40' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40'
                    }`}>
                      <span className="relative z-10">{t('landing.navigation.login')}</span>
                      {theme === 'dark' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#A020F0] to-[#5D0A72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              /* RTL Layout: Login → Language → Theme → Contact → Doctors → Departments → About → Home → Logo */
              <div className="w-full flex items-center justify-between">
                {/* Left side for RTL: Actions first */}
                <div className="flex items-center gap-4">
                  <Link href="/login">
                    <button onClick={logout} className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white hover:shadow-2xl hover:shadow-purple-500/40' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40'
                    }`}>
                      <span className="relative z-10">{t('landing.navigation.login')}</span>
                      {theme === 'dark' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#A020F0] to-[#5D0A72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  </Link>
                  <LanguageToggle />
                  <ThemeToggle />
                  <button onClick={handleToggleFullScreen} className={`p-2 rounded-full transition-colors ${theme==='dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-primary/10 hover:bg-primary/20'}`}>
                    <Maximize2 className={`w-5 h-5 ${theme==='dark' ? 'text-gray-300' : 'text-primary'}`} />
                  </button>
                </div>

                {/* Center for RTL: Navigation in specific order */}
                <nav className="hidden lg:flex navigation-menu gap-8">
                  <a href="#contact" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.contact')}
                    <span className={`absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#doctors" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.doctors')}
                    <span className={`absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#departments" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.departments')}
                    <span className={`absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#about" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.about')}
                    <span className={`absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                  <a href="#home" className={`font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t('landing.navigation.home')}
                    <span className={`absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-[#5D0A72] to-[#A020F0]' : 'bg-gradient-to-r from-primary to-accent'}`}></span>
                  </a>
                </nav>

                {/* Right side for RTL: Logo */}
                <div className="flex items-center space-x-reverse space-x-3 logo-container">
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.brandName')}</span>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative bg-cover bg-center py-40 overflow-hidden" style={{
          backgroundImage: theme === 'dark' 
            ? 'linear-gradient(135deg, #040223ee, #5D0A72aa, #040223ee), url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)'
            : 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
          backgroundAttachment: 'fixed'
        }}>
          {/* Theme-aware background overlay */}
          {theme === 'light' && <div className="absolute inset-0 bg-background/90"></div>}
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className={`absolute top-20 right-32 w-32 h-32 rounded-full animate-pulse ${
              theme === 'dark' ? 'bg-gradient-to-br from-purple-500/20 to-transparent' : 'bg-gradient-to-br from-primary/20 to-transparent'
            }`}></div>
            <div className={`absolute top-60 left-20 w-24 h-24 rounded-full animate-bounce delay-1000 ${
              theme === 'dark' ? 'bg-gradient-to-br from-pink-500/15 to-transparent' : 'bg-gradient-to-br from-accent/15 to-transparent'
            }`}></div>
            <div className={`absolute bottom-40 right-1/4 w-40 h-40 rounded-full animate-pulse delay-500 ${
              theme === 'dark' ? 'bg-gradient-to-br from-blue-500/10 to-transparent' : 'bg-gradient-to-br from-primary/10 to-transparent'
            }`}></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 left-1/3 w-2 h-2 rounded-full animate-ping ${
              theme === 'dark' ? 'bg-purple-400' : 'bg-primary'
            }`}></div>
            <div className={`absolute top-3/4 right-1/3 w-1 h-1 rounded-full animate-ping delay-1000 ${
              theme === 'dark' ? 'bg-pink-400' : 'bg-accent'
            }`}></div>
            <div className={`absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full animate-ping delay-500 ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-primary'
            }`}></div>
            <div className={`absolute top-1/3 right-1/2 w-1 h-1 rounded-full animate-ping delay-700 ${
              theme === 'dark' ? 'bg-purple-300' : 'bg-primary/70'
            }`}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-3xl animate-fade-in-up">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className={`drop-shadow-2xl hero-title-shadow ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
                  {t('landing.hero.title')} 
                </span>
                <br />
                <span className={`text-transparent bg-clip-text animate-gradient-x ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-[#A020F0] via-[#FF6B9D] to-[#5D0A72]' 
                    : 'bg-gradient-to-r from-primary via-accent to-primary'
                }`} style={{
                  backgroundSize: '200% 200%'
                }}>
                  {t('landing.hero.titleHighlight')}
                </span>
              </h1>
              <p className={`mt-8 text-xl leading-relaxed font-medium hero-subtitle-shadow ${
                theme === 'dark' ? 'text-gray-300 opacity-95' : 'text-foreground/90'
              }`}>
                {t('landing.hero.subtitle')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-6">
                <a href="#departments" className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-center relative overflow-hidden group ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-[#5D0A72] via-[#A020F0] to-[#FF6B9D] text-white hover:shadow-2xl hover:shadow-purple-500/40' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40'
                }`}>
                  <span className="relative z-10">{t('landing.hero.servicesButton')}</span>
                  {theme === 'dark' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#A020F0] to-[#5D0A72] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </a>
                <a href="#about" className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-center backdrop-blur-sm ${
                  theme === 'dark' 
                    ? 'bg-black/30 border-2 border-purple-400/60 text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-300' 
                    : 'bg-card/30 border-2 border-primary/60 text-foreground hover:bg-primary/10 hover:border-primary'
                }`}>
                  {t('landing.hero.aboutButton')}
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1.2s ease-out;
          }
          .animate-gradient-x {
            animation: gradient 4s ease infinite;
          }
          
          /* Theme-aware text shadows for hero section */
          .hero-title-shadow {
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.1);
          }
          .hero-subtitle-shadow {
            text-shadow: 1px 1px 4px rgba(0,0,0,0.2);
          }
          
          /* Light mode adjustments */
          .light-mode .hero-title-shadow {
            text-shadow: 2px 2px 8px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4);
          }
          .light-mode .hero-subtitle-shadow {
            text-shadow: 1px 1px 4px rgba(255,255,255,0.6);
          }
        `}</style>

        {/* Welcome Section */}
        <section id="about" className={`py-24 ${theme === 'dark' ? 'bg-[#05002E]' : 'bg-card'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{t('landing.welcome.welcomeTo')}</span>
              <h2 className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.welcome.title')}</h2>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {t('landing.welcome.description')}
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><svg className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> {t('landing.welcome.features.emergency')}</li>
                <li className="flex items-center"><svg className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> {t('landing.welcome.features.doctors')}</li>
                <li className="flex items-center"><svg className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> {t('landing.welcome.features.staff')}</li>
              </ul>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1559757175-7db1c4d0e6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Doctor and Patient" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="departments" className={`py-24 relative ${theme === 'dark' ? 'bg-[#040223]' : 'bg-background'}`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[#040223]/90' : 'bg-background/90'}`}></div>
          <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{t('landing.services.title')}</span>
              <h2 className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.services.subtitle')}</h2>
            </div>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={service.name} className={`backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center hover:transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-[#05002E]/80 to-[#05002E]/60 border border-purple-900/50 hover:border-purple-500/80 hover:shadow-purple-500/30' 
                    : 'bg-gradient-to-br from-card/80 to-card/60 border border-border hover:border-primary/80 hover:shadow-primary/30'
                }`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10' 
                      : 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10'
                  }`}></div>
                  <div className="relative z-10">
                    <div className={`inline-block p-6 rounded-full transition-all duration-500 group-hover:shadow-xl ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-purple-900/60 to-purple-700/60 group-hover:bg-gradient-to-br group-hover:from-purple-600/80 group-hover:to-pink-600/80 group-hover:shadow-purple-500/40' 
                        : 'bg-gradient-to-br from-primary/20 to-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-accent/30 group-hover:shadow-primary/40'
                    }`}>
                      {service.icon}
                    </div>
                    <h3 className={`mt-6 text-2xl font-bold transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'text-white group-hover:text-purple-200' 
                        : 'text-foreground group-hover:text-primary'
                    }`}>{service.name}</h3>
                    <p className={`mt-3 transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'text-gray-400 group-hover:text-gray-300' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}>{service.description}</p>
                  </div>
                  <div className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={`py-24 ${theme === 'dark' ? 'bg-[#05002E]' : 'bg-card'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{t('landing.whyChooseUs.title')}</span>
              <h2 className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.whyChooseUs.subtitle')}</h2>
              <div className="mt-8 space-y-2">
                <div>
                  <button onClick={() => setOpenAccordion('mission')} className={`w-full text-left p-4 rounded-lg font-bold text-lg ${
                    theme === 'dark' 
                      ? `${openAccordion === 'mission' ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-white'}` 
                      : `text-foreground ${openAccordion === 'mission' ? 'bg-primary' : 'bg-muted'}`
                  }`}>{t('landing.whyChooseUs.mission.title')}</button>
                  {openAccordion === 'mission' && <div className={`p-4 rounded-b-lg ${theme === 'dark' ? 'bg-black/20' : 'bg-muted/50'}`}><p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('landing.whyChooseUs.mission.description')}</p></div>}
                </div>
                <div>
                  <button onClick={() => setOpenAccordion('vision')} className={`w-full text-left p-4 rounded-lg font-bold text-lg ${
                    theme === 'dark' 
                      ? `${openAccordion === 'vision' ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-white'}` 
                      : `text-foreground ${openAccordion === 'vision' ? 'bg-primary' : 'bg-muted'}`
                  }`}>{t('landing.whyChooseUs.vision.title')}</button>
                  {openAccordion === 'vision' && <div className={`p-4 rounded-b-lg ${theme === 'dark' ? 'bg-black/20' : 'bg-muted/50'}`}><p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('landing.whyChooseUs.vision.description')}</p></div>}
                </div>
                <div>
                  <button onClick={() => setOpenAccordion('value')} className={`w-full text-left p-4 rounded-lg font-bold text-lg ${
                    theme === 'dark' 
                      ? `${openAccordion === 'value' ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-white'}` 
                      : `text-foreground ${openAccordion === 'value' ? 'bg-primary' : 'bg-muted'}`
                  }`}>{t('landing.whyChooseUs.value.title')}</button>
                  {openAccordion === 'value' && <div className={`p-4 rounded-b-lg ${theme === 'dark' ? 'bg-black/20' : 'bg-muted/50'}`}><p className={`${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('landing.whyChooseUs.value.description')}</p></div>}
                </div>
              </div>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Medical Staff" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className={`py-24 ${theme === 'dark' ? 'bg-[#040223]' : 'bg-background'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{t('landing.doctorsSection.title')}</span>
              <h2 className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.doctorsSection.subtitle')}</h2>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {doctors.map(doctor => (
                <div key={doctor.name} className={`rounded-xl overflow-hidden shadow-lg transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#05002E] border border-purple-900 hover:border-purple-600' 
                    : 'bg-card border border-border hover:border-primary'
                }`}>
                  <img src={doctor.image} alt={doctor.name} className="h-64 w-full object-cover" />
                  <div className="p-6 text-center">
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{doctor.name}</h3>
                    <p className={`${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{doctor.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-24 ${theme === 'dark' ? 'bg-[#05002E]' : 'bg-card'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>{t('landing.testimonials.title')}</span>
            <h2 className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.testimonials.subtitle')}</h2>
            <div className="mt-12 space-y-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className={`p-8 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-purple-900/30 border border-purple-800 hover:border-purple-600 hover:bg-purple-900/40' 
                    : 'bg-muted/30 border border-border hover:border-primary hover:bg-muted/40'
                }`}>
                  <div className={`absolute top-4 left-4 opacity-30 ${theme === 'dark' ? 'text-purple-400' : 'text-primary'}`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  <p className={`text-lg italic relative z-10 ${theme === 'dark' ? 'text-gray-300' : 'text-foreground'}`}>"{testimonial.quote}"</p>
                  <p className={`mt-4 font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className={`pt-20 pb-8 ${theme === 'dark' ? 'bg-black/50' : 'bg-muted/50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.footer.aboutTitle')}</h3>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('landing.footer.aboutDescription')}</p>
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.footer.quickLinksTitle')}</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#home" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>{t('landing.navigation.home')}</a></li>
                <li><a href="#about" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>{t('landing.navigation.about')}</a></li>
                <li><a href="#departments" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>{t('landing.navigation.departments')}</a></li>
                <li><a href="#doctors" className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>{t('landing.navigation.doctors')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.footer.contactTitle')}</h3>
              <ul className={`mt-4 space-y-2 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                <li>123 Health St, MedCity</li>
                <li>contact@sirona.com</li>
                <li>(123) 456-7890</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>{t('landing.footer.newsletterTitle')}</h3>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>{t('landing.footer.newsletterDescription')}</p>
              <div className="mt-4 flex">
                {!isRTL ? (
                  // LTR Layout: Email Input → Go Button
                  <>
                    <input 
                      type="email" 
                      placeholder={t('landing.footer.emailPlaceholder')} 
                      className={`p-2 rounded-l-lg focus:outline-none w-full text-left ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-input border-border text-foreground'
                      }`} 
                    />
                    <button className={`p-2 rounded-r-lg ${
                      theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-primary text-primary-foreground'
                    }`}>
                      {t('landing.footer.goButton')}
                    </button>
                  </>
                ) : (
                  // RTL Layout: Go Button → Email Input
                  <>
                    <button className={`p-2 rounded-l-lg ${
                      theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-primary text-primary-foreground'
                    }`}>
                      {t('landing.footer.goButton')}
                    </button>
                    <input 
                      type="email" 
                      placeholder={t('landing.footer.emailPlaceholder')} 
                      className={`p-2 rounded-r-lg focus:outline-none w-full text-right ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-input border-border text-foreground'
                      }`} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`mt-16 pt-8 text-center ${
            theme === 'dark' ? 'border-t border-gray-800 text-gray-500' : 'border-t border-border text-muted-foreground'
          }`}>
            &copy; {new Date().getFullYear()} {t('landing.brandName')}. {t('landing.footer.copyright')}
          </div>
        </footer>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/appointments">
          <button className="bg-gradient-to-r from-[#5D0A72] to-[#A020F0] text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </Link>
      </div>

      {/* HMS Access Button */}
      <div className="fixed bottom-6 left-6 z-30">
        <Link href="/dashboard">
          <button className={`backdrop-blur-sm px-5 py-3 rounded-xl font-medium transition-colors shadow-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border border-gray-700 text-white hover:bg-gray-800' 
              : 'bg-card/50 border border-border text-foreground hover:bg-card'
          }`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>HMS Access</span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}