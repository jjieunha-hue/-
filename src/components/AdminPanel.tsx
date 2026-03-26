/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, FestivalItem, AboutInfo } from '../types';
import { usePortfolioData } from '../hooks';
import { auth } from '../firebase';
import { X, Save, Plus, Trash2, LogOut, Settings, Upload, Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

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
  const { about, projects, festivals, updateAbout, updateProject, updateFestival, logout, uploadImage } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'about' | 'environmental' | 'interior' | 'others' | 'festivals'>('about');
  const [aboutState, setAboutState] = useState<AboutInfo>(about);

  useEffect(() => {
    setAboutState(about);
  }, [about]);

  const handleSyncProjects = async () => {
    if (confirm('모든 프로젝트 데이터를 초기 데이터(constants.ts)로 덮어쓰시겠습니까?')) {
      const { INITIAL_PROJECTS } = await import('../constants');
      for (const p of INITIAL_PROJECTS) {
        await updateProject(p);
      }
      alert('동기화되었습니다.');
    }
  };

  const handleUpdateAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(aboutState);
    alert('저장되었습니다.');
  };

  const addExperience = () => {
    const newExp = { id: `exp_${Date.now()}`, company: 'New Experience', period: '2024.01 - 2024.12' };
    setAboutState({ ...aboutState, experiences: [...aboutState.experiences, newExp] });
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
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h2>
          <div className="flex items-center gap-4">
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
                {tab}
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
          <form onSubmit={handleUpdateAbout} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</label>
                <RichTextEditor value={aboutState.name} onChange={(val) => setAboutState({...aboutState, name: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Title</label>
                <RichTextEditor value={aboutState.title} onChange={(val) => setAboutState({...aboutState, title: val})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Highlight</label>
              <RichTextEditor value={aboutState.highlight} onChange={(val) => setAboutState({...aboutState, highlight: val})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
              <RichTextEditor value={aboutState.description} onChange={(val) => setAboutState({...aboutState, description: val})} />
            </div>
            
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
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Others Category Title</label>
                <RichTextEditor value={aboutState.othersTitle || 'OTHERS'} onChange={(val) => setAboutState({...aboutState, othersTitle: val})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Festival Category Title</label>
                <RichTextEditor value={aboutState.festivalTitle || 'FESTIVAL'} onChange={(val) => setAboutState({...aboutState, festivalTitle: val})} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Experience Timeline</label>
                <button type="button" onClick={addExperience} className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {aboutState.experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 items-center bg-gray-50 p-2 border border-gray-100">
                    <input 
                      value={exp.company} 
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} 
                      className="flex-1 p-2 bg-white border border-gray-100 outline-none text-sm font-bold"
                      placeholder="Company Name"
                    />
                    <input 
                      value={exp.period} 
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

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</label>
                <input value={aboutState.phone} onChange={(e) => setAboutState({...aboutState, phone: e.target.value})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</label>
                <input value={aboutState.email} onChange={(e) => setAboutState({...aboutState, email: e.target.value})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Instagram</label>
                <input value={aboutState.social?.instagram || ''} onChange={(e) => setAboutState({...aboutState, social: {...aboutState.social, instagram: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Behance</label>
                <input value={aboutState.social?.behance || ''} onChange={(e) => setAboutState({...aboutState, social: {...aboutState.social, behance: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Notion</label>
                <input value={aboutState.social?.notion || ''} onChange={(e) => setAboutState({...aboutState, social: {...aboutState.social, notion: e.target.value}})} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        )}

        {(activeTab === 'environmental' || activeTab === 'interior' || activeTab === 'others') && (
          <div className="space-y-12">
            {projects.filter(p => p.category === activeTab).map((project) => (
              <ProjectEditor key={project.id} project={project} onSave={updateProject} />
            ))}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div className="space-y-12">
            {festivals.map((f) => (
              <FestivalEditor key={f.id} festival={f} onSave={updateFestival} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUpload({ onUpload, label, multiple = false }: { onUpload: (url: string) => void, label: string, multiple?: boolean }) {
  const { uploadImage, login } = usePortfolioData();
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
        
        // Use the progress callback for individual file progress if needed
        // For now we still show overall progress
        const url = await uploadImage(file, path, (p) => {
          // Individual file progress could be used here
          console.log(`File ${i + 1} progress: ${p}%`);
        });
        
        onUpload(url);
        completedFiles++;
        setProgress(Math.round((completedFiles / totalFiles) * 100));
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      if (error?.code === 'storage/unauthorized') {
        errorMessage = "서버 권한이 없습니다. Storage 규칙을 확인해주세요.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      alert(`이미지 업로드에 실패했습니다: ${errorMessage}\n\n상세 정보: ${JSON.stringify(error)}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

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
}

function ProjectEditor({ project, onSave }: { project: Project, onSave: (p: Project) => void }) {
  const [localProject, setLocalProject] = useState(project);
  const isDirty = JSON.stringify(localProject) !== JSON.stringify(project);

  return (
    <div className="p-8 border border-gray-100 space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-black uppercase tracking-tighter">{project.title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1">{project.category}</span>
          {isDirty && (
            <button 
              onClick={() => onSave(localProject)}
              className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Timeline (Period)</label>
          <input 
            value={localProject.period} 
            onChange={(e) => setLocalProject({ ...localProject, period: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
            placeholder="e.g. 2024.10"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Category</label>
          <select 
            value={localProject.category} 
            onChange={(e) => setLocalProject({ ...localProject, category: e.target.value as any })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-bold uppercase"
          >
            <option value="environmental">Environmental</option>
            <option value="interior">Interior</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Tags (comma separated)</label>
          <input 
            value={localProject.tags.join(', ')} 
            onChange={(e) => setLocalProject({ ...localProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
            placeholder="Public Design, Landscape..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Title</label>
          <RichTextEditor 
            value={localProject.title} 
            onChange={(val) => setLocalProject({ ...localProject, title: val })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Subtitle</label>
          <RichTextEditor 
            value={localProject.subtitle} 
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
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Short Description</label>
        <RichTextEditor 
          value={localProject.description} 
          onChange={(val) => setLocalProject({ ...localProject, description: val })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Detailed Paragraphs (one per line)</label>
        <RichTextEditor 
          value={localProject.details?.join('<br>') || ''} 
          onChange={(val) => setLocalProject({ ...localProject, details: [val] })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Completed Photos (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localProject.completedImages?.join('\n') || ''} 
            onChange={(e) => setLocalProject({ ...localProject, completedImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={6}
            placeholder="Completed photo URLs..."
          />
          <ImageUpload 
            label="Add Photo" 
            multiple={true}
            onUpload={(url) => setLocalProject(prev => ({ 
              ...prev, 
              completedImages: [...(prev.completedImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">2D Designs (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localProject.design2DImages?.join('\n') || ''} 
            onChange={(e) => setLocalProject({ ...localProject, design2DImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="2D design URLs..."
          />
          <ImageUpload 
            label="Add 2D" 
            multiple={true}
            onUpload={(url) => setLocalProject(prev => ({ 
              ...prev, 
              design2DImages: [...(prev.design2DImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">3D Designs (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localProject.design3DImages?.join('\n') || ''} 
            onChange={(e) => setLocalProject({ ...localProject, design3DImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="3D design URLs..."
          />
          <ImageUpload 
            label="Add 3D" 
            multiple={true}
            onUpload={(url) => setLocalProject(prev => ({ 
              ...prev, 
              design3DImages: [...(prev.design3DImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Legacy Detail Images (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localProject.detailImages?.join('\n') || ''} 
            onChange={(e) => setLocalProject({ ...localProject, detailImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="Additional image URLs..."
          />
          <ImageUpload 
            label="Add Image" 
            multiple={true}
            onUpload={(url) => setLocalProject(prev => ({ 
              ...prev, 
              detailImages: [...(prev.detailImages || []), url] 
            }))} 
          />
        </div>
      </div>
    </div>
  );
}

function FestivalEditor({ festival, onSave }: { festival: FestivalItem, onSave: (f: FestivalItem) => void }) {
  const [localFestival, setLocalFestival] = useState(festival);
  const isDirty = JSON.stringify(localFestival) !== JSON.stringify(festival);

  return (
    <div className="p-8 border border-gray-100 space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-black uppercase tracking-tighter">{festival.title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1">Order: {festival.order}</span>
          {isDirty && (
            <button 
              onClick={() => onSave(localFestival)}
              className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Title</label>
          <RichTextEditor 
            value={localFestival.title} 
            onChange={(val) => setLocalFestival({ ...localFestival, title: val })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtitle</label>
          <RichTextEditor 
            value={localFestival.sub} 
            onChange={(val) => setLocalFestival({ ...localFestival, sub: val })}
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
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</label>
          <input 
            value={localFestival.location || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, location: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
            placeholder="e.g. Seoul, Korea"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Timeline</label>
          <input 
            value={localFestival.period || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, period: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
            placeholder="e.g. 2023.05"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
        <RichTextEditor 
          value={localFestival.description || ''} 
          onChange={(val) => setLocalFestival({ ...localFestival, description: val })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detailed Paragraphs (one per line)</label>
        <RichTextEditor 
          value={localFestival.details?.join('<br>') || ''} 
          onChange={(val) => setLocalFestival({ ...localFestival, details: [val] })}
        />
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
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Completed Photos (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localFestival.completedImages?.join('\n') || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, completedImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="Completed photo URLs..."
          />
          <ImageUpload 
            label="Add Photo" 
            multiple={true}
            onUpload={(url) => setLocalFestival(prev => ({ 
              ...prev, 
              completedImages: [...(prev.completedImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">2D Designs (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localFestival.design2DImages?.join('\n') || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, design2DImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="2D design URLs..."
          />
          <ImageUpload 
            label="Add 2D" 
            multiple={true}
            onUpload={(url) => setLocalFestival(prev => ({ 
              ...prev, 
              design2DImages: [...(prev.design2DImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">3D Designs (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localFestival.design3DImages?.join('\n') || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, design3DImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="3D design URLs..."
          />
          <ImageUpload 
            label="Add 3D" 
            multiple={true}
            onUpload={(url) => setLocalFestival(prev => ({ 
              ...prev, 
              design3DImages: [...(prev.design3DImages || []), url] 
            }))} 
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Legacy Detail Images (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localFestival.detailImages?.join('\n') || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, detailImages: e.target.value.split('\n').map(l => convertGoogleDriveLink(l.trim())).filter(Boolean) })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
            rows={4}
            placeholder="Additional image URLs..."
          />
          <ImageUpload 
            label="Add Image" 
            multiple={true}
            onUpload={(url) => setLocalFestival(prev => ({ 
              ...prev, 
              detailImages: [...(prev.detailImages || []), url] 
            }))} 
          />
        </div>
      </div>
    </div>
  );
}
