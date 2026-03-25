/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { usePortfolioData } from './hooks';
import { Project, FestivalItem } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import AdminPanel from './components/AdminPanel';
import { Menu, X, ArrowRight, Github, Mail, Phone, ExternalLink, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { about, projects, festivals, loading, isAdmin, login } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const groupedProjects = useMemo(() => {
    return {
      environmental: projects.filter(p => p.category === 'environmental'),
      interior: projects.filter(p => p.category === 'interior'),
      others: projects.filter(p => p.category === 'others'),
    };
  }, [projects]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [password, setPassword] = useState('');

  const handleAdminClick = () => {
    const input = prompt("비밀번호를 입력하세요 (4845)");
    if (input === '4845') {
      if (!isAdmin) {
        login();
      } else {
        setShowAdmin(true);
      }
    } else if (input !== null) {
      alert("비밀번호가 틀렸습니다.");
    }
  };

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
            <div className="text-2xl font-black tracking-tighter uppercase">{about.name}.</div>
            <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-widest font-bold">
              <a href="#about" className="nav-link">About</a>
              <a href="#environmental" className="nav-link">Environmental</a>
              <a href="#festival" className="nav-link">Festival</a>
              <a href="#interior" className="nav-link">Interior</a>
              <a href="#others" className="nav-link">Others</a>
              <a href="#contact" className="nav-link">Contact</a>
              <button onClick={handleAdminClick} className="text-gray-300 hover:text-black transition">
                <Settings className="w-4 h-4" />
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
                  <a href="#festival" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Festival</a>
                  <a href="#interior" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Interior</a>
                  <a href="#others" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Others</a>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)} className="nav-link inline-block">Contact</a>
                  <button onClick={handleAdminClick} className="flex items-center gap-2 text-gray-300">
                    <Settings className="w-4 h-4" /> Admin
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Admin Panel */}
        <AnimatePresence>
          {showAdmin && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <AdminPanel onClose={() => setShowAdmin(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <header className="h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none z-1"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl w-full relative z-10"
          >
            <p className="text-sm md:text-lg tracking-[0.8em] mb-12 uppercase font-light opacity-40">Design Portfolio</p>
            <h1 className="serif text-6xl md:text-[12rem] mb-12 leading-[0.9] tracking-tighter font-medium">
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
                <h3 className="serif text-5xl md:text-8xl font-bold mb-10 leading-tight italic text-gray-100 select-none uppercase">Values</h3>
                <div className="text-xl md:text-3xl font-bold mb-8 leading-tight">
                  "{about.highlight.split('\n')[0]} <br />
                  <span className="bg-black text-white px-2">하지은</span>입니다."
                </div>
                <p className="text-gray-600 leading-relaxed text-lg max-w-2xl text-justify font-light mb-12">
                  {about.description}
                </p>
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
                  {about.experiences.map((exp) => (
                    <li key={exp.id} className={`flex flex-col mb-1 ${exp.opacity === 70 ? 'opacity-70' : exp.opacity === 50 ? 'opacity-50' : ''}`}>
                      <span className="font-bold text-lg leading-tight uppercase">{exp.company}</span>
                      <span className="text-gray-400 text-xs">{exp.period}</span>
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
            <h2 className="section-title uppercase">environmental</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {groupedProjects['environmental'].map((project) => (
                <div 
                  key={project.id} 
                  className="project-card bg-white p-1 border border-gray-100 hover:border-black transition-all group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video bg-gray-50 overflow-hidden relative">
                    <img 
                      src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-8 text-left">
                    <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter">{project.title}</h3>
                    <p className="serif-italic text-gray-500 mb-6 text-lg">{project.subtitle}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-gray-400 font-bold italic text-sm">
                      <span>{project.tags[0]} / {project.period}</span>
                      <span className="group-hover:text-black transition">상세보기</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Section */}
        <section id="festival" className="py-32 px-6 max-w-7xl mx-auto">
          <h2 className="section-title">FESTIVAL</h2>
          <div className="grid grid-cols-1">
            {festivals.map((item, idx) => (
              <div 
                key={item.id} 
                className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between group hover:bg-gray-50 transition-all cursor-pointer"
                onClick={() => setSelectedFestival(item)}
              >
                <div className="flex items-center space-x-8">
                  <span className="text-xs font-black opacity-20 group-hover:opacity-100 transition">{(idx + 1).toString().padStart(2, '0')}</span>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{item.title}</h3>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <span className="serif-italic text-gray-400 italic">{item.sub}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interior & Others Sections */}
        {(['interior', 'others'] as const).map((cat) => (
          <section key={cat} id={cat} className={`py-32 px-6 ${cat === 'interior' ? 'bg-gray-50' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <h2 className="section-title uppercase">{cat}</h2>
              <div className="grid md:grid-cols-2 gap-10">
                {groupedProjects[cat].map((project) => (
                  <div 
                    key={project.id} 
                    className="project-card bg-white p-1 border border-gray-100 hover:border-black transition-all group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="aspect-video bg-gray-50 overflow-hidden relative">
                      <img 
                        src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-8 text-left">
                      <h3 className="text-2xl font-black mb-1 uppercase tracking-tighter">{project.title}</h3>
                      <p className="serif-italic text-gray-500 mb-6 text-lg">{project.subtitle}</p>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-gray-400 font-bold italic text-sm">
                        <span>{project.tags[0]} / {project.period}</span>
                        <span className="group-hover:text-black transition">상세보기</span>
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
                <div className="mb-20">
                  <div className="mb-12 flex flex-wrap gap-2">
                    {selectedProject.tags.map(t => (
                      <span key={t} className="border border-black px-2 py-1 text-[10px] font-black uppercase tracking-widest italic">{t}</span>
                    ))}
                  </div>
                  <h2 className="serif text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-8">{selectedProject.title}</h2>
                  <p className="serif-italic text-2xl md:text-4xl text-gray-400 italic">{selectedProject.subtitle}</p>
                </div>

                {/* Main Image Section */}
                <div className="aspect-[16/9] bg-gray-50 mb-20 overflow-hidden border border-gray-100">
                  <img 
                    src={selectedProject.imageUrl || `https://picsum.photos/seed/${selectedProject.id}-detail/1200/800`} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & Overview Section */}
                <div className="mb-32 flex flex-col items-start">
                  <div className="w-fit border-t border-gray-100 py-6 mb-10">
                    <div className="grid grid-cols-2 gap-16">
                      <div><span className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic">Timeline</span><span className="text-xl font-bold">{selectedProject.period}</span></div>
                      <div><span className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic">Category</span><span className="text-xl font-bold uppercase">{selectedProject.category}</span></div>
                    </div>
                  </div>
                  
                  <div className="w-full border-t border-gray-100 py-16 text-left">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Project Overview</h4>
                    <div className="text-gray-700 leading-relaxed text-xl font-light space-y-10 text-justify break-keep">
                      <p>{selectedProject.description}</p>
                      {selectedProject.details?.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Process & Details Section */}
                {selectedProject.completedImages && selectedProject.completedImages.length > 0 && (
                  <div className="pt-20 border-t border-gray-100 mb-20">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Completed Photos (완공사진)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedProject.completedImages.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-50 overflow-hidden border border-gray-100">
                          <img 
                            src={img} 
                            alt={`${selectedProject.title} completed ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.designImages && selectedProject.designImages.length > 0 && (
                  <div className="pt-20 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">3D Designs (3D시안)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedProject.designImages.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-50 overflow-hidden border border-gray-100">
                          <img 
                            src={img} 
                            alt={`${selectedProject.title} design ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy Detail Images (if any) */}
                {selectedProject.detailImages && selectedProject.detailImages.length > 0 && (
                  <div className="pt-20 border-t border-gray-100">
                    <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 italic">Process & Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedProject.detailImages.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-50 overflow-hidden border border-gray-100">
                          <img 
                            src={img} 
                            alt={`${selectedProject.title} detail ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
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
                <div className="grid md:grid-cols-12 gap-20">
                  <div className="md:col-span-5">
                    <div className="mb-12 flex flex-wrap gap-2">
                      {selectedFestival.tags?.map(t => (
                        <span key={t} className="border border-black px-2 py-1 text-[10px] font-black uppercase tracking-widest italic">{t}</span>
                      ))}
                    </div>
                    <h2 className="serif text-5xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8">{selectedFestival.title}</h2>
                    <p className="serif-italic text-2xl md:text-3xl text-gray-400 mb-20 italic">{selectedFestival.sub}</p>
                    <div className="grid grid-cols-2 gap-8 py-10 border-t border-gray-100">
                      <div><span className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic">Timeline</span><span className="text-xl font-bold">{selectedFestival.period || '-'}</span></div>
                      <div><span className="text-[10px] uppercase text-gray-300 font-black block mb-2 italic">Type</span><span className="text-xl font-bold uppercase">Festival / Event</span></div>
                    </div>
                  </div>
                  <div className="md:col-span-7">
                    <div className="aspect-[16/10] bg-gray-50 mb-20 overflow-hidden border border-gray-100">
                      <img 
                        src={selectedFestival.imageUrl || `https://picsum.photos/seed/${selectedFestival.id}-detail/1200/800`} 
                        alt={selectedFestival.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="max-w-xl">
                      <h4 className="text-[10px] uppercase text-gray-300 font-black mb-10 pb-4 border-b italic">Festival Overview</h4>
                      <div className="text-gray-700 leading-relaxed text-xl font-light space-y-10 text-justify">{selectedFestival.description || '상세 설명이 준비 중입니다.'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact */}
        <footer id="contact" className="py-40 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
              <h2 className="text-6xl font-black tracking-tighter mb-4 uppercase">Contact.</h2>
              <p className="serif-italic text-2xl text-gray-400 mb-8 italic">공간에 디자인 가치를 더합니다.</p>
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-black mb-2 tracking-tighter">{about.phone}</p>
              <p className="text-xl text-gray-400 font-medium serif-italic mb-8">{about.email}</p>
              <div className="flex items-center justify-center md:justify-end gap-6">
                {about.social?.instagram && <a href={about.social.instagram} className="text-gray-300 hover:text-black transition"><i className="fa-brands fa-instagram text-xl"></i></a>}
                {about.social?.behance && <a href={about.social.behance} className="text-gray-300 hover:text-black transition"><i className="fa-brands fa-behance text-xl"></i></a>}
                {about.social?.notion && <a href={about.social.notion} className="text-gray-300 hover:text-black transition"><i className="fa-solid fa-note-sticky text-xl"></i></a>}
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 {about.name}. All Rights Reserved.</p>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Designed for Spatial & Graphic Experience</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
