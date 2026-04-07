/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { PortfolioProvider, usePortfolioData } from './hooks';
import { Project, FestivalItem } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import AdminPanel from './components/AdminPanel';
import { ImageViewer } from './components/ImageViewer';
import Masonry from 'react-masonry-css';
import { Menu, X, ArrowRight, Github, Mail, Phone, ExternalLink, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { about, projects, festivals, loading, user, isAdmin, login } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordAuthorized, setIsPasswordAuthorized] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [festivalFilter, setFestivalFilter] = useState<'ALL' | 'FESTIVAL' | 'EXHIBITION' | 'CONVENTION'>('ALL');

  const openViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => setIsViewerOpen(false);
  const nextImage = () => setViewerIndex((prev) => (prev + 1) % viewerImages.length);
  const prevImage = () => setViewerIndex((prev) => (prev - 1 + viewerImages.length) % viewerImages.length);

  const masonryBreakpoints = {
    default: 2,
    1100: 2,
    768: 1
  };

  const groupedProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
    return {
      environmental: sorted.filter(p => p.category === 'environmental'),
      interior: sorted.filter(p => p.category === 'interior'),
      others: sorted.filter(p => p.category === 'others'),
    };
  }, [projects]);

  const handleAdminClick = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '4845') {
      setShowPasswordModal(false);
      setIsPasswordAuthorized(true);
      if (!user) {
        await login();
      }
      setShowAdmin(true);
    } else {
      setPasswordError(true);
    }
  };

  const filteredFestivals = useMemo(() => {
    const sorted = [...festivals].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (festivalFilter === 'ALL') return sorted;
    return sorted.filter(f => f.sub_category === festivalFilter);
  }, [festivals, festivalFilter]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Loading Portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div 
              className="text-2xl font-black tracking-tighter uppercase cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              dangerouslySetInnerHTML={{ __html: about.name }}
            />
            <div className="hidden md:flex items-center space-x-8 text-[10px] uppercase tracking-widest font-bold">
              <a href="#about" className="nav-link">About</a>
              <a href="#environmental" className="nav-link">Environmental</a>
              <a href="#festival" className="nav-link">Experience</a>
              <a href="#interior" className="nav-link">Interior</a>
              <a href="#others" className="nav-link">Others</a>
              <a href="#contact" className="nav-link">Contact</a>
              <button 
                onClick={handleAdminClick} 
                className="nav-link flex items-center gap-2 text-gray-300 hover:text-black transition-colors"
                title="Admin Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
            <button 
              className="md:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col p-6 space-y-4 text-[10px] uppercase tracking-widest font-bold">
                  <a href="#about" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">About</a>
                  <a href="#environmental" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Environmental</a>
                  <a href="#festival" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Experience</a>
                  <a href="#interior" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Interior</a>
                  <a href="#others" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Others</a>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Contact</a>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleAdminClick();
                    }} 
                    className="flex items-center gap-2 text-black font-black"
                  >
                    <Settings className="w-4 h-4" /> Admin Panel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-10 max-w-sm w-full border border-gray-100"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Admin Access</h3>
                  <button onClick={() => setShowPasswordModal(false)} className="text-gray-300 hover:text-black transition">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Enter Password</label>
                    <input
                      type="password"
                      autoFocus
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(false);
                      }}
                      className={`w-full p-4 border ${passwordError ? 'border-red-500' : 'border-gray-100'} focus:border-black outline-none font-bold text-center tracking-[0.5em]`}
                      placeholder="••••"
                    />
                    {passwordError && (
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center mt-2">Incorrect Password</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-gray-900 transition"
                  >
                    Verify & Continue
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 z-[100] bg-white overflow-y-auto"
            >
              {isAdmin || isPasswordAuthorized ? (
                <AdminPanel onClose={() => {
                  setShowAdmin(false);
                  setIsPasswordAuthorized(false);
                }} />
              ) : (
                <div className="h-screen flex items-center justify-center p-8">
                  <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <X className="w-10 h-10 text-gray-300" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black uppercase tracking-tighter">
                        {user ? 'Access Denied' : 'Authentication Required'}
                      </h2>
                      <p className="text-gray-400 font-light leading-relaxed">
                        {user ? (
                          <>
                            You are logged in as <span className="font-bold text-black">{user.email}</span>.<br />
                            This account does not have administrative privileges.
                          </>
                        ) : (
                          'Please log in with an administrator account to access this panel.'
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      {!user && (
                        <button 
                          onClick={login}
                          className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-gray-900 transition"
                        >
                          Log In with Google
                        </button>
                      )}
                      <button 
                        onClick={() => setShowAdmin(false)}
                        className={`w-full py-4 ${user ? 'bg-black text-white' : 'bg-gray-100 text-black'} text-[10px] font-black uppercase tracking-widest italic hover:bg-gray-200 transition`}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <header className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-32 text-center relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none z-1"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl w-full relative z-10"
          >
            <p className="text-sm md:text-lg tracking-[0.8em] mb-12 uppercase font-light opacity-40">Design Portfolio</p>
            <h1 className="serif text-5xl md:text-[10rem] mb-12 leading-tight md:leading-[0.9] tracking-tighter font-medium">
              <span className="block">Spatial</span>
              <span className="block">Graphic</span>
              <span className="block">Experience</span>
            </h1>
            <div className="flex flex-col items-center mt-12">
              <div className="h-24 w-[1px] bg-white opacity-20 mb-12"></div>
              <a href="#environmental" className="group relative border border-white/30 px-12 py-4 hover:border-white transition-all uppercase text-[10px] tracking-[0.4em] font-bold">
                <span className="relative z-10">View Works</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity z-20">View Works</span>
              </a>
            </div>
          </motion.div>

        </header>

        {/* Marquee Section */}
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Spatial Design</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Graphic Experience</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Environmental Designer</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
            {/* Duplicate for seamless loop */}
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Spatial Design</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Graphic Experience</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
            <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter mx-8">Environmental Designer</span>
            <span className="serif-italic text-4xl md:text-7xl italic mx-8 opacity-30">&</span>
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="py-40 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-7">
              <h2 className="section-title">ABOUT</h2>
              <div className="mt-8">
                <h3 className="serif text-3xl md:text-8xl font-bold mb-10 leading-tight italic text-gray-100 select-none uppercase">Values</h3>
                <div className="text-lg md:text-3xl font-bold mb-8 leading-tight whitespace-pre-wrap">
                  <div dangerouslySetInnerHTML={{ __html: about.highlight }} />
                </div>
                <div 
                  className="text-gray-600 leading-relaxed text-lg max-w-2xl text-justify font-light mb-12 whitespace-pre-wrap rich-text-content"
                  dangerouslySetInnerHTML={{ 
                    __html: (isMobile ? about.content_mobile : about.content_pc) 
                            || about.description 
                            || '' 
                  }}
                />
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center space-y-12 border-l border-gray-100 md:pl-12 pt-12 md:pt-0">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-bold">Contact Info</h4>
                <div className="space-y-3">
                  <p className="text-2xl font-black">{about.phone}</p>
                  <p className="text-xl font-medium text-gray-500 serif-italic">{about.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-bold">Experience Timeline</h4>
                <ul className="space-y-4 text-sm font-light">
                  {(about.experiences || []).map((exp) => (
                    <li key={exp.id} className={`flex flex-col mb-1 ${exp.opacity === 70 ? 'opacity-70' : exp.opacity === 50 ? 'opacity-50' : ''}`}>
                      <span className="font-bold text-lg leading-tight uppercase" dangerouslySetInnerHTML={{ __html: exp.company }} />
                      <span className="text-gray-400 text-xs" dangerouslySetInnerHTML={{ __html: exp.period }} />
                    </li>
                  ))}
                  
                  <li className="pt-6 border-t border-gray-100 max-w-[320px]">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[10px] font-black text-gray-300 w-6 shrink-0">2D</span>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider text-center">Illustrator</span>
                        <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider text-center">Photoshop</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-gray-300 w-6 shrink-0">3D</span>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase text-center">3ds MAX</span>
                        <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase text-center">D5 Render</span>
                        <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase text-center">Lumion</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Environmental Section */}
        <section id="environmental" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="section-title uppercase whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: about.environmentalTitle || 'environmental' }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(groupedProjects['environmental'] || []).map((project) => (
                <div 
                  key={project.id} 
                  className="project-card bg-white p-1 border border-gray-100 hover:border-black transition-all group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img 
                      src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                      alt="Project"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-8 text-left">
                    <h3 
                      className="text-2xl font-black mb-1 uppercase tracking-tighter whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: project.title }}
                    />
                    <div 
                      className="serif-italic text-gray-500 mb-6 text-lg whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: project.subtitle }}
                    />
                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-gray-300 font-black italic mb-1">Project Info</span>
                        <span className="text-sm font-bold text-gray-400 italic" dangerouslySetInnerHTML={{ __html: `${project.tags[0]} / ${project.period}` }} />
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 group-hover:text-black transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">상세보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Section */}
        <section id="festival" className="py-32 px-6 max-w-7xl mx-auto">
          <h2 
            className="section-title uppercase whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: (about.festivalTitle && about.festivalTitle.replace(/<[^>]*>/g, '').trim().toUpperCase().includes('FESTIVAL')) ? 'EXPERIENCE' : (about.festivalTitle || 'EXPERIENCE') }}
          />
          
          {/* Sub Category Filter */}
          <div className="flex flex-wrap gap-4 mb-12">
            {(['ALL', 'FESTIVAL', 'EXHIBITION', 'CONVENTION'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFestivalFilter(filter)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  festivalFilter === filter 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="festival-list-view flex flex-col">
            {(filteredFestivals || []).map((item, idx) => (
              <div 
                key={item.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer px-4"
                onClick={() => setSelectedFestival(item)}
              >
                <div className="flex items-baseline gap-6 flex-1">
                  <span className="text-[10px] font-black text-gray-200 group-hover:text-black transition-colors">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 
                      className="text-lg md:text-xl font-black uppercase tracking-tighter leading-tight group-hover:italic transition-all"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <div 
                      className="serif-italic text-gray-400 italic text-[10px] md:text-xs opacity-60 group-hover:opacity-100 transition-opacity"
                      dangerouslySetInnerHTML={{ __html: item.sub }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8 mt-6 md:mt-0">
                  <div className="hidden lg:flex flex-col items-end text-right">
                    <span className="text-[10px] uppercase text-gray-300 font-black italic mb-1">Period</span>
                    <span className="text-sm font-bold text-gray-400 italic" dangerouslySetInnerHTML={{ __html: item.period || '-' }} />
                  </div>
                  <div className="flex items-center gap-3 text-gray-200 group-hover:text-black transition-all transform group-hover:translate-x-2">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">View Detail</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interior & Others Sections */}
        {(['interior', 'others'] as const).map((cat) => (
          <section key={cat} id={cat} className={`py-32 px-6 ${cat === 'interior' ? 'bg-gray-50' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h2 
                className="section-title uppercase whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: cat === 'interior' ? (about.interiorTitle || 'interior') : (about.othersTitle || 'others') }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {groupedProjects[cat].map((project) => (
                  <div 
                    key={project.id} 
                    className="project-card bg-white p-1 border border-gray-100 hover:border-black transition-all group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                      <img 
                        src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                        alt="Project"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-8 text-left">
                      <h3 
                        className="text-2xl font-black mb-1 uppercase tracking-tighter whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: project.title }}
                      />
                      <div 
                        className="serif-italic text-gray-500 mb-6 text-lg whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: project.subtitle }}
                      />
                      <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-gray-300 font-black italic mb-1">Project Info</span>
                          <span className="text-sm font-bold text-gray-400 italic" dangerouslySetInnerHTML={{ __html: `${project.tags[0]} / ${project.period}` }} />
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 group-hover:text-black transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-widest italic">상세보기</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="fixed top-8 right-8 z-[110] w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="max-w-7xl mx-auto px-8 py-32 md:py-48">
                {/* Header Section */}
                <div className="mb-20 [column-span:all] text-left">
                  <h2 
                    className="serif text-4xl md:text-9xl font-black uppercase leading-tight tracking-tighter whitespace-pre-wrap text-left"
                    style={{ marginBottom: `${about.detailTitleSpacing || 32}px` }}
                    dangerouslySetInnerHTML={{ __html: selectedProject.title || '' }}
                  />
                  <div 
                    className="serif-italic text-xl md:text-4xl text-gray-400 italic whitespace-pre-wrap text-left"
                    dangerouslySetInnerHTML={{ __html: selectedProject.subtitle || '' }}
                  />
                </div>

                {/* Main Image Section */}
                <div className="bg-gray-50 mb-20 overflow-hidden border border-gray-100 cursor-pointer" onClick={() => openViewer([selectedProject.imageUrl || ''], 0)}>
                  <img 
                    src={selectedProject.imageUrl || `https://picsum.photos/seed/${selectedProject.id}-detail/1200/800`} 
                    alt="Project Detail"
                    className="w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & Overview Section */}
                <div className="mb-16 w-full">
                  <div className="grid md:grid-cols-12 gap-12 border-t border-gray-100 pt-10">
                    <div className="md:col-span-4 space-y-10">
                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.projectInfoLabel || 'Project Info' }}
                        />
                        <div 
                          className="text-xl md:text-2xl font-bold italic text-gray-400 leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedProject.projectInfoRich || selectedProject.categoryRich || selectedProject.category }}
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.timelineLabel || 'Timeline' }}
                        />
                        <div 
                          className="text-lg md:text-xl font-bold leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedProject.periodRich || selectedProject.period }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.categoryLabel || 'Category' }}
                        />
                        <div 
                          className="text-lg md:text-xl font-bold uppercase leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedProject.categoryRich || selectedProject.category }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.tagsLabel || 'Tags' }}
                        />
                        {selectedProject.tagsRich ? (
                          <div 
                            className="text-sm font-bold uppercase tracking-tight text-gray-500"
                            dangerouslySetInnerHTML={{ __html: selectedProject.tagsRich }}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {(selectedProject.tags || []).map(t => (
                              <span key={t} className="text-sm font-bold uppercase tracking-tight text-gray-500" dangerouslySetInnerHTML={{ __html: t }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-8">
                      <h4 className="text-[10px] uppercase text-gray-300 font-black mb-6 italic">Project Overview</h4>
                      <div className="text-gray-700 text-xl font-light rich-text-content">
                        <div className="!mb-10 whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                          __html: (isMobile ? selectedProject.content_mobile : selectedProject.content_pc) 
                                  || selectedProject.description 
                                  || '' 
                        }} />
                        {(selectedProject.details || []).map((detail, idx) => (
                          <div key={idx} className="!mb-6 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: detail || '' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process & Details Section */}
                {selectedProject.completedImages && selectedProject.completedImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Completed Photos (완공사진)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedProject.completedImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedProject.completedImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedProject.title} completed ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.design2DImages && selectedProject.design2DImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">2D Designs (2D 시안)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedProject.design2DImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedProject.design2DImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedProject.title} 2d design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.design3DImages && selectedProject.design3DImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">3D Designs (3D 시안)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedProject.design3DImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedProject.design3DImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedProject.title} 3d design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.designImages && selectedProject.designImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">
                          {selectedProject.id === 'dongju' ? '2D & 3D Designs (2D/3D 시안)' : 
                           selectedProject.category === 'others' ? '2D Designs (2D시안)' : '3D Designs (3D시안)'}
                        </h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedProject.designImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedProject.designImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedProject.title} design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legacy Detail Images (if any) */}
                {selectedProject.detailImages && selectedProject.detailImages.length > 0 && (
                  <div className="pt-20 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Process & Details</h4>
                    <Masonry
                      breakpointCols={masonryBreakpoints}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column"
                    >
                      {(selectedProject.detailImages || []).map((img, idx) => (
                        <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedProject.detailImages || [], idx)}>
                          <img 
                            src={img} 
                            alt={`${selectedProject.title} detail ${idx + 1}`}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </Masonry>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Festival Modal */}
        <AnimatePresence>
          {selectedFestival && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-white overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedFestival(null)}
                className="fixed top-8 right-8 z-[110] w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="max-w-7xl mx-auto px-8 py-32 md:py-48">
                {/* Header Section */}
                <div className="mb-20 [column-span:all] text-left">
                  <h2 
                    className="serif text-4xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter whitespace-pre-wrap text-left"
                    style={{ marginBottom: `${about.detailTitleSpacing || 32}px` }}
                    dangerouslySetInnerHTML={{ __html: selectedFestival.title || '' }}
                  />
                  <div 
                    className="serif-italic text-xl md:text-4xl text-gray-400 italic whitespace-pre-wrap text-left"
                    dangerouslySetInnerHTML={{ __html: selectedFestival.sub || '' }}
                  />
                </div>

                {/* Main Image Section */}
                <div className="bg-gray-50 mb-20 overflow-hidden border border-gray-100 cursor-pointer" onClick={() => openViewer([selectedFestival.imageUrl || ''], 0)}>
                  <img 
                    src={selectedFestival.imageUrl || `https://picsum.photos/seed/${selectedFestival.id}-detail/1200/800`} 
                    alt="Festival Detail"
                    className="w-full h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & Overview Section */}
                <div className="mb-16 w-full">
                  <div className="grid md:grid-cols-12 gap-12 border-t border-gray-100 pt-10">
                    <div className="md:col-span-4 space-y-10">
                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.projectInfoLabel || 'Project Info' }}
                        />
                        <div 
                          className="text-xl md:text-2xl font-bold italic text-gray-400 leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedFestival.projectInfoRich || (selectedFestival.categoryRich && selectedFestival.categoryRich.replace(/<[^>]*>/g, '').trim().toUpperCase().includes('FESTIVAL') ? 'EXPERIENCE' : (selectedFestival.categoryRich || 'EXPERIENCE')) }}
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.timelineLabel || 'Timeline' }}
                        />
                        <div 
                          className="text-lg md:text-xl font-bold leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedFestival.periodRich || selectedFestival.period || '-' }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.categoryLabel || 'Category' }}
                        />
                        <div 
                          className="text-lg md:text-xl font-bold uppercase leading-tight"
                          dangerouslySetInnerHTML={{ __html: selectedFestival.categoryRich && selectedFestival.categoryRich.replace(/<[^>]*>/g, '').trim().toUpperCase().includes('FESTIVAL') ? 'EXPERIENCE' : (selectedFestival.categoryRich || 'EXPERIENCE') }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h4 
                          className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: about.tagsLabel || 'Tags' }}
                        />
                        {selectedFestival.tagsRich ? (
                          <div 
                            className="text-sm font-bold uppercase tracking-tight text-gray-500"
                            dangerouslySetInnerHTML={{ __html: selectedFestival.tagsRich }}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedFestival.tags?.map(t => (
                              <span key={t} className="text-sm font-bold uppercase tracking-tight text-gray-500" dangerouslySetInnerHTML={{ __html: t }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-8">
                      <h4 className="text-[10px] uppercase text-gray-300 font-black mb-6 italic">Experience Overview</h4>
                      <div className="text-gray-700 text-xl font-light rich-text-content">
                        <div className="!mb-10 whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                          __html: (isMobile ? selectedFestival.content_mobile : selectedFestival.content_pc) 
                                  || selectedFestival.description 
                                  || '상세 설명이 준비 중입니다.' 
                        }} />
                        {(selectedFestival.details || []).map((detail, idx) => (
                          <div key={idx} className="!mb-6 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: detail || '' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Image Sections */}
                {selectedFestival.completedImages && selectedFestival.completedImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Completed Photos (준공 사진)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedFestival.completedImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedFestival.completedImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedFestival.title} completed ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFestival.design2DImages && selectedFestival.design2DImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">2D Designs (2D 시안)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedFestival.design2DImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedFestival.design2DImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedFestival.title} 2d design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFestival.design3DImages && selectedFestival.design3DImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">3D Designs (3D 시안)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedFestival.design3DImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedFestival.design3DImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedFestival.title} 3d design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFestival.designImages && selectedFestival.designImages.length > 0 && (
                  <div className="pt-16 border-t border-gray-100 mb-24">
                    <div className="grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-4">
                        <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Design Images (기타 시안)</h4>
                      </div>
                      <div className="md:col-span-8">
                        <Masonry
                          breakpointCols={masonryBreakpoints}
                          className="my-masonry-grid"
                          columnClassName="my-masonry-grid_column"
                        >
                          {(selectedFestival.designImages || []).map((img, idx) => (
                            <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedFestival.designImages || [], idx)}>
                              <img 
                                src={img} 
                                alt={`${selectedFestival.title} design ${idx + 1}`}
                                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </Masonry>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFestival.detailImages && selectedFestival.detailImages.length > 0 && (
                  <div className="pt-20 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Process & Details</h4>
                    <Masonry
                      breakpointCols={masonryBreakpoints}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column"
                    >
                      {(selectedFestival.detailImages || []).map((img, idx) => (
                        <div key={idx} className="cursor-pointer" onClick={() => openViewer(selectedFestival.detailImages || [], idx)}>
                          <img 
                            src={img} 
                            alt={`${selectedFestival.title} detail ${idx + 1}`}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </Masonry>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Section */}
        <section id="contact" className="py-40 px-6 bg-black text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 
              className="text-[10vw] font-black uppercase tracking-tighter leading-[0.8] mb-20 opacity-20"
              dangerouslySetInnerHTML={{ __html: about.contactTitle || "LET'S TALK" }}
            />
            <div className="grid md:grid-cols-2 gap-20">
              <div>
                <div 
                  className="text-3xl md:text-5xl font-bold mb-12 leading-tight"
                  dangerouslySetInnerHTML={{ __html: about.contactHighlight || "공간의 가치를 함께 <br /> 만들어갈 파트너를 기다립니다." }}
                />
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-4 italic">{about.phoneLabel || 'Phone'}</span>
                    <a href={`tel:${about.phone}`} className="text-4xl md:text-6xl font-black hover:text-gray-400 transition-colors">{about.phone}</a>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-4 italic">{about.emailLabel || 'Email'}</span>
                    <a href={`mailto:${about.email}`} className="text-2xl md:text-4xl font-medium serif-italic hover:text-gray-400 transition-colors">{about.email}</a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex gap-8 text-xs font-black uppercase tracking-widest italic mb-20">
                  {about.social?.instagram && <a href={about.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:line-through">Instagram</a>}
                  {about.social?.behance && <a href={about.social.behance} target="_blank" rel="noopener noreferrer" className="hover:line-through">Behance</a>}
                  {about.social?.notion && <a href={about.social.notion} target="_blank" rel="noopener noreferrer" className="hover:line-through">Notion</a>}
                </div>
                <div className="h-[1px] w-full bg-white opacity-10"></div>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-20 -right-20 text-[30vw] font-black opacity-5 select-none pointer-events-none">{about.contactDecorativeText || 'HI'}</div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div 
              className="text-[10px] font-bold text-gray-300 uppercase tracking-widest"
              dangerouslySetInnerHTML={{ __html: about.footerCopyright || `© 2026 ${about.name}. All Rights Reserved.` }}
            />
            <div 
              className="text-[10px] font-bold text-gray-300 uppercase tracking-widest"
              dangerouslySetInnerHTML={{ __html: about.footerSubtext || "Designed for Spatial & Graphic Experience" }}
            />
          </div>
        </footer>
        {isViewerOpen && (
          <ImageViewer 
            images={viewerImages}
            currentIndex={viewerIndex}
            onClose={closeViewer}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
