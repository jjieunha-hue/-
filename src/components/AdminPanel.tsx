/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, memo } from 'react';
import { Project, FestivalItem, AboutInfo } from '../types';
import { usePortfolioData } from '../hooks';
import { auth } from '../firebase';
import { stripHtml } from '../lib/utils';
import { X, Save, Plus, Trash2, LogOut, Settings, Upload, Loader2, Smartphone, Monitor } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { ImageViewer } from './ImageViewer';

const convertGoogleDriveLink = (url: string) => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
    if (idMatch && idMatch[1]) {
      return `https://docs.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }
  return url;
};

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { about, projects, festivals, updateAbout, updateProject, updateFestival, logout, uploadImage, login } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'about' | 'environmental' | 'interior' | 'others' | 'festivals'>('about');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => setIsViewerOpen(false);
  const nextImage = () => setViewerIndex((prev) => (prev + 1) % viewerImages.length);
  const prevImage = () => setViewerIndex((prev) => (prev - 1 + viewerImages.length) % viewerImages.length);

  const handleSyncProjects = async () => {
    if (confirm('모든 프로젝트 데이터를 초기 데이터(constants.ts)로 덮어쓰시겠습니까?')) {
      const { INITIAL_PROJECTS } = await import('../constants');
      for (const p of INITIAL_PROJECTS) {
        await updateProject(p);
      }
      alert('동기화되었습니다.');
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] ${isMobileView ? 'bg-gray-100' : 'bg-white'} overflow-y-auto transition-colors duration-500`}>
      <div className={`mx-auto px-6 py-20 transition-all duration-500 bg-white min-h-screen ${isMobileView ? 'admin-mobile-view' : 'max-w-7xl'}`}>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileView(!isMobileView)}
              className={`flex items-center gap-2 px-4 py-2 border transition-all text-[10px] font-black uppercase tracking-widest ${
                isMobileView 
                ? 'bg-black text-white border-black' 
                : 'border-gray-200 text-gray-400 hover:text-black hover:border-black'
              }`}
            >
              {isMobileView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              {isMobileView ? 'PC View' : 'Mobile View'}
            </button>
            <button 
              onClick={() => { logout(); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="flex gap-8 mb-12 border-b border-gray-100 items-center justify-between overflow-x-auto">
          <div className="flex gap-8 whitespace-nowrap">
            {(['about', 'environmental', 'interior', 'others', 'festivals'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-400'
                }`}
              >
                {tab === 'about' ? 'About & Contact' : tab}
              </button>
            ))}
          </div>
          {(activeTab === 'environmental' || activeTab === 'interior' || activeTab === 'others') && (
            <button 
              onClick={handleSyncProjects}
              className="mb-4 text-[10px] font-black uppercase bg-gray-100 px-3 py-1 hover:bg-black hover:text-white transition"
            >
              Sync from Constants
            </button>
          )}
        </div>

        {activeTab === 'about' && (
          <AboutEditor about={about} onSave={updateAbout} />
        )}

        {(activeTab === 'environmental' || activeTab === 'interior' || activeTab === 'others') && (
          <div className="space-y-4">
            {projects.filter(p => p.category === activeTab).map((project) => (
              <ProjectEditor 
                key={project.id} 
                project={project} 
                onSave={updateProject} 
                uploadImage={uploadImage}
                login={login}
                isExpanded={expandedId === project.id}
                onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
                onImageClick={openViewer}
              />
            ))}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div className="space-y-4">
            {festivals.map((f) => (
              <FestivalEditor 
                key={f.id} 
                festival={f} 
                onSave={updateFestival} 
                uploadImage={uploadImage}
                login={login}
                isExpanded={expandedId === f.id}
                onToggle={() => setExpandedId(expandedId === f.id ? null : f.id)}
                onImageClick={openViewer}
              />
            ))}
          </div>
        )}
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
    </div>
  );
}

const AboutEditor = memo(({ about, onSave }: { about: AboutInfo, onSave: (a: AboutInfo) => void }) => {
  const [aboutState, setAboutState] = useState<AboutInfo>(about);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  useEffect(() => {
    setAboutState(about);
  }, [about]);

  const handleUpdateAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('로그인이 필요합니다. (Authentication required)');
      return;
    }
    try {
      await currentUser.getIdToken(true);
      await onSave(aboutState);
      alert('저장되었습니다.');
    } catch (err) {
      alert('저장 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const addExperience = () => {
    const newExp = { id: `exp_${Date.now()}`, company: 'New Experience', period: '2024.01 - 2024.12' };
    setAboutState({ ...aboutState, experiences: [...(aboutState.experiences || []), newExp] });
  };

  const removeExperience = (id: string) => {
    setAboutState({ ...aboutState, experiences: aboutState.experiences.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setAboutState({
      ...aboutState,
      experiences: aboutState.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  return (
    <form onSubmit={handleUpdateAbout} className="space-y-6">
      {/* Basic Info Section */}
      <div className="border border-gray-100">
        <button 
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}
          className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-widest">Basic Information</span>
          <span className="text-[10px] font-bold text-gray-400">{expandedSection === 'basic' ? 'Collapse' : 'Expand'}</span>
        </button>
        {expandedSection === 'basic' && (
          <div className="p-6 space-y-8 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</label>
                <RichTextEditor value={aboutState.name || ''} onChange={(val) => setAboutState({...aboutState, name: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Title</label>
                <RichTextEditor value={aboutState.title || ''} onChange={(val) => setAboutState({...aboutState, title: val})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Highlight</label>
              <RichTextEditor value={aboutState.highlight || ''} onChange={(val) => setAboutState({...aboutState, highlight: val})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
              <RichTextEditor value={aboutState.description || ''} onChange={(val) => setAboutState({...aboutState, description: val})} />
            </div>
          </div>
        )}
      </div>

      {/* Labels & Titles Section */}
      <div className="border border-gray-100">
        <button 
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'labels' ? null : 'labels')}
          className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-widest">Labels & Category Titles</span>
          <span className="text-[10px] font-bold text-gray-400">{expandedSection === 'labels' ? 'Collapse' : 'Expand'}</span>
        </button>
        {expandedSection === 'labels' && (
          <div className="p-6 space-y-8 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Environmental Category Title</label>
                <RichTextEditor value={aboutState.environmentalTitle || 'ENVIRONMENTAL'} onChange={(val) => setAboutState({...aboutState, environmentalTitle: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Interior Category Title</label>
                <RichTextEditor value={aboutState.interiorTitle || 'INTERIOR'} onChange={(val) => setAboutState({...aboutState, interiorTitle: val})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Project Info Label</label>
                <RichTextEditor value={aboutState.projectInfoLabel || 'Project Info'} onChange={(val) => setAboutState({...aboutState, projectInfoLabel: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Timeline Label</label>
                <RichTextEditor value={aboutState.timelineLabel || 'Timeline'} onChange={(val) => setAboutState({...aboutState, timelineLabel: val})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category Label</label>
                <RichTextEditor value={aboutState.categoryLabel || 'Category'} onChange={(val) => setAboutState({...aboutState, categoryLabel: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags Label</label>
                <RichTextEditor value={aboutState.tagsLabel || 'Tags'} onChange={(val) => setAboutState({...aboutState, tagsLabel: val})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Others Category Title</label>
                <RichTextEditor value={aboutState.othersTitle || 'OTHERS'} onChange={(val) => setAboutState({...aboutState, othersTitle: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Festival Category Title</label>
                <RichTextEditor value={aboutState.festivalTitle || 'FESTIVAL'} onChange={(val) => setAboutState({...aboutState, festivalTitle: val})} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="border border-gray-100">
        <button 
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'experience' ? null : 'experience')}
          className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-widest">Experience Timeline</span>
          <span className="text-[10px] font-bold text-gray-400">{expandedSection === 'experience' ? 'Collapse' : 'Expand'}</span>
        </button>
        {expandedSection === 'experience' && (
          <div className="p-6 space-y-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Experience Items</label>
              <button type="button" onClick={addExperience} className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(aboutState.experiences || []).map((exp) => (
                <div key={exp.id} className="flex gap-4 items-center bg-gray-50 p-2 border border-gray-100">
                  <input 
                    value={exp.company || ''} 
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} 
                    className="flex-1 p-2 bg-white border border-gray-100 outline-none text-sm font-bold"
                    placeholder="Company Name"
                  />
                  <input 
                    value={exp.period || ''} 
                    onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} 
                    className="w-40 p-2 bg-white border border-gray-100 outline-none text-xs"
                    placeholder="Period"
                  />
                  <button type="button" onClick={() => removeExperience(exp.id)} className="p-2 text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact & Social Section */}
      <div className="border border-gray-100">
        <button 
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'contact' ? null : 'contact')}
          className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-widest">Contact & Footer</span>
          <span className="text-[10px] font-bold text-gray-400">{expandedSection === 'contact' ? 'Collapse' : 'Expand'}</span>
        </button>
        {expandedSection === 'contact' && (
          <div className="p-6 space-y-8 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Title (LET'S TALK)</label>
                <RichTextEditor value={aboutState.contactTitle || "LET'S TALK"} onChange={(val) => setAboutState({...aboutState, contactTitle: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Decorative Text (HI)</label>
                <input value={aboutState.contactDecorativeText || 'HI'} onChange={(e) => setAboutState({...aboutState, contactDecorativeText: e.target.value})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact Highlight (공간의 가치를 함께...)</label>
              <RichTextEditor value={aboutState.contactHighlight || "공간의 가치를 함께 <br /> 만들어갈 파트너를 기다립니다."} onChange={(val) => setAboutState({...aboutState, contactHighlight: val})} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</label>
                <div className="flex gap-4">
                  <input value={aboutState.phoneLabel || 'Phone'} onChange={(e) => setAboutState({...aboutState, phoneLabel: e.target.value})} className="w-1/3 p-4 border border-gray-100 focus:border-black outline-none font-bold" placeholder="Label" />
                  <input value={aboutState.phone || ''} onChange={(e) => setAboutState({...aboutState, phone: e.target.value})} className="flex-1 p-4 border border-gray-100 focus:border-black outline-none font-bold" placeholder="Value" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</label>
                <div className="flex gap-4">
                  <input value={aboutState.emailLabel || 'Email'} onChange={(e) => setAboutState({...aboutState, emailLabel: e.target.value})} className="w-1/3 p-4 border border-gray-100 focus:border-black outline-none font-bold" placeholder="Label" />
                  <input value={aboutState.email || ''} onChange={(e) => setAboutState({...aboutState, email: e.target.value})} className="flex-1 p-4 border border-gray-100 focus:border-black outline-none font-bold" placeholder="Value" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Instagram</label>
                <input value={aboutState.social?.instagram || ''} onChange={(e) => setAboutState({...aboutState, social: {...(aboutState.social || {}), instagram: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Behance</label>
                <input value={aboutState.social?.behance || ''} onChange={(e) => setAboutState({...aboutState, social: {...(aboutState.social || {}), behance: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Notion</label>
                <input value={aboutState.social?.notion || ''} onChange={(e) => setAboutState({...aboutState, social: {...(aboutState.social || {}), notion: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Footer Copyright</label>
                <RichTextEditor value={aboutState.footerCopyright || `© 2026 ${aboutState.name}. All Rights Reserved.`} onChange={(val) => setAboutState({...aboutState, footerCopyright: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Footer Subtext</label>
                <RichTextEditor value={aboutState.footerSubtext || "Designed for Spatial & Graphic Experience"} onChange={(val) => setAboutState({...aboutState, footerSubtext: val})} />
              </div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2">
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </form>
  );
});

const ImageUpload = memo(({ 
  onUpload, 
  label, 
  multiple = false, 
  compact = false,
  uploadImage,
  login
}: { 
  onUpload: (url: string) => void, 
  label: string, 
  multiple?: boolean, 
  compact?: boolean,
  uploadImage: (file: File, path: string, onProgress?: (p: number) => void) => Promise<string>,
  login: () => Promise<void>
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!auth.currentUser) {
      if (confirm("이미지 업로드를 위해 구글 로그인이 필요합니다. 로그인 하시겠습니까?")) {
        login();
      }
      return;
    }

    setUploading(true);
    const totalFiles = files.length;
    let completedFiles = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `portfolio/${Date.now()}_${file.name}`;
        
        const url = await uploadImage(file, path, (p) => {
          setProgress(Math.round(((completedFiles + (p / 100)) / totalFiles) * 100));
        });
        
        onUpload(url);
        completedFiles++;
        setProgress(Math.round((completedFiles / totalFiles) * 100));
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      
      if (error?.code === 'storage/unauthorized') {
        errorMessage = "서버 권한이 없습니다. (Storage Rules 확인 필요)";
      } else if (error?.code === 'storage/canceled') {
        errorMessage = "업로드가 취소되었습니다.";
      } else if (error?.code === 'storage/unknown') {
        errorMessage = "알 수 없는 서버 오류가 발생했습니다.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert(`이미지 업로드 실패!\n\n원인: ${errorMessage}\n\n로그인 상태를 확인하거나 파일 용량을 확인해주세요.`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (compact) {
    return (
      <label className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 hover:border-black hover:bg-gray-50 cursor-pointer transition-all relative overflow-hidden ${uploading ? 'pointer-events-none' : ''}`}>
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <span className="text-[8px] font-black uppercase mt-1">{progress}%</span>
            <div 
              className="absolute bottom-0 left-0 h-1 bg-black transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 text-gray-300" />
            <span className="text-[8px] font-black uppercase mt-1">{label}</span>
          </>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading} 
          multiple={multiple}
        />
      </label>
    );
  }

  return (
    <div className="space-y-2 pb-4">
      <label className="text-[10px] font-black uppercase text-gray-300 italic">{label}</label>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors relative overflow-hidden">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span className="text-[10px] font-black uppercase">
            {uploading ? `Uploading ${progress}%` : `Upload Image${multiple ? 's' : ''}`}
          </span>
          {multiple && !uploading && <span className="text-[8px] text-gray-400 absolute -bottom-4 left-0 whitespace-nowrap">Multiple files supported</span>}
          {uploading && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-black transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading} 
            multiple={multiple}
          />
        </label>
      </div>
    </div>
  );
});

interface ImageManagerProps {
  label: string; 
  images?: string[]; 
  onImagesChange: (imgs: string[]) => void; 
  uploadImage: (file: File, path: string, onProgress?: (p: number) => void) => Promise<string>;
  login: () => Promise<void>;
  onImageClick: (images: string[], index: number) => void;
}

const ImageManager = memo(({ label, images = [], onImagesChange, uploadImage, login, onImageClick }: ImageManagerProps) => {
  const [newUrl, setNewUrl] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const safeImages = images || [];

  const removeImage = (index: number) => {
    const newImages = [...safeImages];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const addImage = (url: string) => {
    onImagesChange([...safeImages, url]);
  };

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      addImage(convertGoogleDriveLink(newUrl.trim()));
      setNewUrl('');
    }
  };

  return (
    <div className="space-y-3 pt-4 border-t border-gray-50">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">{label}</label>
        <span className="text-[8px] font-black uppercase text-gray-300 italic">{safeImages.length} Photos</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {safeImages.map((url, idx) => (
          <div key={idx} className="group relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden cursor-pointer" onClick={() => onImageClick(safeImages, idx)}>
            <img 
              src={url} 
              alt={`${label} ${idx + 1}`} 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
              className="absolute top-1 right-1 p-1 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove image"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white p-1 truncate opacity-0 group-hover:opacity-100">
              {url}
            </div>
          </div>
        ))}
        
        {/* Upload Button */}
        <div className="aspect-square">
          <ImageUpload 
            label="Upload File" 
            multiple={true} 
            onUpload={addImage} 
            compact={true}
            uploadImage={uploadImage}
            login={login}
          />
        </div>
      </div>

      {/* URL Input Section */}
      <div className="flex gap-2">
        <input 
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
          placeholder="Paste image URL here..."
          className="flex-1 p-2 border border-gray-100 outline-none focus:border-black text-[10px]"
        />
        <button 
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase whitespace-nowrap"
        >
          Add URL
        </button>
      </div>

      {/* Bulk Editor Toggle */}
      <div className="pt-2">
        <button 
          type="button"
          onClick={() => setShowBulk(!showBulk)}
          className="text-[8px] font-black uppercase text-gray-300 hover:text-black transition-colors"
        >
          {showBulk ? 'Hide Bulk URL Editor' : 'Show Bulk URL Editor (Advanced)'}
        </button>
        {showBulk && (
          <textarea 
            value={safeImages.join('\n')} 
            onChange={(e) => onImagesChange(e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean))}
            className="w-full mt-2 p-2 border border-gray-50 outline-none focus:border-black text-[10px] font-mono text-gray-400 bg-gray-50/30"
            rows={4}
            placeholder="Paste multiple URLs here (one per line)..."
          />
        )}
      </div>
    </div>
  );
});

interface ProjectEditorProps {
  project: Project;
  onSave: (p: Project) => void;
  uploadImage: any;
  login: any;
  isExpanded: boolean;
  onToggle: () => void;
  onImageClick: (images: string[], index: number) => void;
}

const ProjectEditor = memo(({ 
  project, 
  onSave, 
  uploadImage, 
  login,
  isExpanded,
  onToggle,
  onImageClick
}: ProjectEditorProps) => {
  const [localProject, setLocalProject] = useState(project);
  
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const isDirty = useMemo(() => {
    // Simple shallow comparison for performance if possible, but deep is needed here.
    // We only run this when expanded to save cycles.
    if (!isExpanded) return false;
    return JSON.stringify(localProject) !== JSON.stringify(project);
  }, [localProject, project, isExpanded]);

  return (
    <div className={`border border-gray-100 transition-all ${isExpanded ? 'p-8 space-y-4' : 'p-4 hover:bg-gray-50'}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-black uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: project.title }} />
          <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1">{project.category}</span>
        </div>
        <div className="flex items-center gap-4">
          {isDirty && (
            <button 
              onClick={async (e) => { 
                e.stopPropagation(); 
                const currentUser = auth.currentUser;
                if (!currentUser) {
                  alert('로그인이 필요합니다. (Authentication required)');
                  return;
                }
                try {
                  await currentUser.getIdToken(true);
                  await onSave(localProject);
                  alert('저장되었습니다.');
                } catch (err) {
                  alert('저장 실패: ' + (err instanceof Error ? err.message : String(err)));
                }
              }}
              className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          )}
          <span className="text-xs font-bold text-gray-400">{isExpanded ? 'Collapse' : 'Expand to Edit'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Project Info Display</label>
              <RichTextEditor 
                value={localProject.projectInfoRich || localProject.categoryRich || localProject.category || ''} 
                onChange={(val) => setLocalProject({ ...localProject, projectInfoRich: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Timeline (Period)</label>
              <RichTextEditor 
                value={localProject.periodRich || localProject.period || ''} 
                onChange={(val) => setLocalProject({ ...localProject, periodRich: val, period: stripHtml(val) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Category Display</label>
              <RichTextEditor 
                value={localProject.categoryRich || localProject.category || ''} 
                onChange={(val) => setLocalProject({ ...localProject, categoryRich: val })}
              />
              <div className="pt-2">
                <label className="text-[8px] font-black uppercase text-gray-300 italic">Logic Category (for filtering)</label>
                <select 
                  value={localProject.category} 
                  onChange={(e) => setLocalProject({ ...localProject, category: e.target.value as any })}
                  className="w-full p-1 border border-gray-50 outline-none focus:border-black text-[10px] font-bold uppercase"
                >
                  <option value="environmental">Environmental</option>
                  <option value="interior">Interior</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Tags Display</label>
              <RichTextEditor 
                value={localProject.tagsRich || localProject.tags?.join(', ') || ''} 
                onChange={(val) => setLocalProject({ ...localProject, tagsRich: val, tags: stripHtml(val).split(',').map(t => t.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Title</label>
              <RichTextEditor 
                value={localProject.title || ''} 
                onChange={(val) => setLocalProject({ ...localProject, title: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-300 italic">Subtitle</label>
              <RichTextEditor 
                value={localProject.subtitle || ''} 
                onChange={(val) => setLocalProject({ ...localProject, subtitle: val })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-300 italic">Main Image URL</label>
            <div className="flex gap-4">
              <input 
                value={localProject.imageUrl || ''} 
                onChange={(e) => setLocalProject({ ...localProject, imageUrl: convertGoogleDriveLink(e.target.value) })}
                className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm"
                placeholder="Main image URL"
              />
              <ImageUpload 
                label="Upload Main Image" 
                onUpload={(url) => setLocalProject(prev => ({ ...prev, imageUrl: url }))} 
                uploadImage={uploadImage}
                login={login}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-300 italic">Short Description</label>
            <div className="max-w-[795px] border border-gray-100">
              <RichTextEditor 
                value={localProject.description || ''} 
                onChange={(val) => setLocalProject({ ...localProject, description: val })}
              />
            </div>
            <p className="text-[8px] text-gray-400 mt-1 italic">* Guide: The width above matches the detail page body width. Use Enter for manual line breaks.</p>
          </div>
          <div className="space-y-1 mt-6">
            <label className="text-[10px] font-black uppercase text-gray-300 italic">Detailed Paragraphs (one per line)</label>
            <div className="max-w-[795px] border border-gray-100">
              <RichTextEditor 
                value={(localProject.details || []).join('<br>')} 
                onChange={(val) => setLocalProject({ ...localProject, details: val.split('<br>').map(v => v.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ImageManager 
                label="Main Image (메인 이미지)" 
                images={localProject.imageUrl ? [localProject.imageUrl] : []} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, imageUrl: imgs[imgs.length - 1] || '' })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Completed Photos (완공사진)" 
                images={localProject.completedImages} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, completedImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="2D Designs (2D 시안)" 
                images={localProject.design2DImages} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, design2DImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
            </div>
            <div className="space-y-6">
              <ImageManager 
                label="3D Designs (3D 시안)" 
                images={localProject.design3DImages} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, design3DImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Legacy Design Images (기존 시안)" 
                images={localProject.designImages} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, designImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Detail Images (상세 이미지)" 
                images={localProject.detailImages} 
                onImagesChange={(imgs) => setLocalProject({ ...localProject, detailImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

interface FestivalEditorProps {
  festival: FestivalItem;
  onSave: (f: FestivalItem) => void;
  uploadImage: any;
  login: any;
  isExpanded: boolean;
  onToggle: () => void;
  onImageClick: (images: string[], index: number) => void;
}

const FestivalEditor = memo(({ 
  festival, 
  onSave, 
  uploadImage, 
  login,
  isExpanded,
  onToggle,
  onImageClick
}: FestivalEditorProps) => {
  const [localFestival, setLocalFestival] = useState(festival);
  
  useEffect(() => {
    setLocalFestival(festival);
  }, [festival]);

  const isDirty = useMemo(() => {
    if (!isExpanded) return false;
    return JSON.stringify(localFestival) !== JSON.stringify(festival);
  }, [localFestival, festival, isExpanded]);

  return (
    <div className={`border border-gray-100 transition-all ${isExpanded ? 'p-8 space-y-4' : 'p-4 hover:bg-gray-50'}`}>
      <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-black uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: festival.title }} />
          <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1">Order: {festival.order}</span>
        </div>
        <div className="flex items-center gap-4">
          {isDirty && (
            <button 
              onClick={async (e) => { 
                e.stopPropagation(); 
                const currentUser = auth.currentUser;
                if (!currentUser) {
                  alert('로그인이 필요합니다. (Authentication required)');
                  return;
                }
                try {
                  await currentUser.getIdToken(true);
                  await onSave(localFestival);
                  alert('저장되었습니다.');
                } catch (err) {
                  alert('저장 실패: ' + (err instanceof Error ? err.message : String(err)));
                }
              }}
              className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          )}
          <span className="text-xs font-bold text-gray-400">{isExpanded ? 'Collapse' : 'Expand to Edit'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Title</label>
              <RichTextEditor 
                value={localFestival.title || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, title: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtitle</label>
              <RichTextEditor 
                value={localFestival.sub || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, sub: val })}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Project Info Display</label>
              <RichTextEditor 
                value={localFestival.projectInfoRich || localFestival.categoryRich || 'FESTIVAL'} 
                onChange={(val) => setLocalFestival({ ...localFestival, projectInfoRich: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Timeline</label>
              <RichTextEditor 
                value={localFestival.periodRich || localFestival.period || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, periodRich: val, period: stripHtml(val) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category Display</label>
              <RichTextEditor 
                value={localFestival.categoryRich || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, categoryRich: val })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags Display</label>
              <RichTextEditor 
                value={localFestival.tagsRich || localFestival.tags?.join(', ') || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, tagsRich: val, tags: stripHtml(val).split(',').map(t => t.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Image URL</label>
            <div className="flex gap-4">
              <input 
                value={localFestival.imageUrl || ''} 
                onChange={(e) => setLocalFestival({ ...localFestival, imageUrl: convertGoogleDriveLink(e.target.value) })}
                className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm"
                placeholder="Festival image URL"
              />
              <ImageUpload 
                label="Upload Image" 
                onUpload={(url) => setLocalFestival(prev => ({ ...prev, imageUrl: url }))} 
                uploadImage={uploadImage}
                login={login}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</label>
              <input 
                value={localFestival.location || ''} 
                onChange={(e) => setLocalFestival({ ...localFestival, location: e.target.value })}
                className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
                placeholder="e.g. Seoul, Korea"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Order</label>
              <input 
                type="number"
                value={localFestival.order} 
                onChange={(e) => setLocalFestival({ ...localFestival, order: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
            <div className="max-w-[795px] border border-gray-100">
              <RichTextEditor 
                value={localFestival.description || ''} 
                onChange={(val) => setLocalFestival({ ...localFestival, description: val })}
              />
            </div>
            <p className="text-[8px] text-gray-400 mt-1 italic">* Guide: The width above matches the detail page body width. Use Enter for manual line breaks.</p>
          </div>
          <div className="space-y-1 mt-6">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detailed Paragraphs (one per line)</label>
            <div className="max-w-[795px] border border-gray-100">
              <RichTextEditor 
                value={(localFestival.details || []).join('<br>')} 
                onChange={(val) => setLocalFestival({ ...localFestival, details: val.split('<br>').map(v => v.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tags (comma separated)</label>
            <input 
              value={localFestival.tags?.join(', ') || ''} 
              onChange={(e) => setLocalFestival({ ...localFestival, tags: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
              placeholder="Branding, Festival, 2023"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ImageManager 
                label="Main Image (메인 이미지)" 
                images={localFestival.imageUrl ? [localFestival.imageUrl] : []} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, imageUrl: imgs[imgs.length - 1] || '' })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Completed Photos (완공사진)" 
                images={localFestival.completedImages} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, completedImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="2D Designs (2D 시안)" 
                images={localFestival.design2DImages} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, design2DImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
            </div>
            <div className="space-y-6">
              <ImageManager 
                label="3D Designs (3D 시안)" 
                images={localFestival.design3DImages} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, design3DImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Legacy Design Images (기존 시안)" 
                images={localFestival.designImages} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, designImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
              <ImageManager 
                label="Detail Images (상세 이미지)" 
                images={localFestival.detailImages} 
                onImagesChange={(imgs) => setLocalFestival({ ...localFestival, detailImages: imgs })}
                uploadImage={uploadImage}
                login={login}
                onImageClick={onImageClick}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
