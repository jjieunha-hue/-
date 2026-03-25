/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, FestivalItem, AboutInfo } from '../types';
import { usePortfolioData } from '../hooks';
import { auth } from '../firebase';
import { X, Save, Plus, Trash2, LogOut, Settings, Upload, Loader2 } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { about, projects, festivals, updateAbout, updateProject, updateFestival, logout, uploadImage } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'festivals'>('about');

  const handleSyncProjects = async () => {
    if (confirm('모든 프로젝트 데이터를 초기 데이터(constants.ts)로 덮어쓰시겠습니까?')) {
      const { INITIAL_PROJECTS } = await import('../constants');
      for (const p of INITIAL_PROJECTS) {
        await updateProject(p);
      }
      alert('동기화되었습니다.');
    }
  };

  const handleUpdateAbout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedAbout: AboutInfo = {
      ...about,
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      highlight: formData.get('highlight') as string,
      description: formData.get('description') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      social: {
        instagram: formData.get('instagram') as string,
        behance: formData.get('behance') as string,
        notion: formData.get('notion') as string,
      }
    };
    updateAbout(updatedAbout);
    alert('저장되었습니다.');
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

        <div className="flex gap-8 mb-12 border-b border-gray-100 items-center justify-between">
          <div className="flex gap-8">
            {(['about', 'projects', 'festivals'] as const).map((tab) => (
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
          {activeTab === 'projects' && (
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
                <input name="name" defaultValue={about.name} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Title</label>
                <input name="title" defaultValue={about.title} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Highlight</label>
              <textarea name="highlight" defaultValue={about.highlight} rows={2} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
              <textarea name="description" defaultValue={about.description} rows={5} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-light leading-relaxed" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone</label>
                <input name="phone" defaultValue={about.phone} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</label>
                <input name="email" defaultValue={about.email} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Instagram</label>
                <input name="instagram" defaultValue={about.social?.instagram} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Behance</label>
                <input name="behance" defaultValue={about.social?.behance} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Notion</label>
                <input name="notion" defaultValue={about.social?.notion} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-12">
            {projects.map((project) => (
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
  const { uploadImage } = usePortfolioData();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Title</label>
          <input 
            value={localProject.title} 
            onChange={(e) => setLocalProject({ ...localProject, title: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-300 italic">Subtitle</label>
          <input 
            value={localProject.subtitle} 
            onChange={(e) => setLocalProject({ ...localProject, subtitle: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Main Image URL</label>
        <div className="flex gap-4">
          <input 
            value={localProject.imageUrl || ''} 
            onChange={(e) => setLocalProject({ ...localProject, imageUrl: e.target.value })}
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
        <textarea 
          value={localProject.description} 
          onChange={(e) => setLocalProject({ ...localProject, description: e.target.value })}
          className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
          rows={2}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Detailed Paragraphs (one per line)</label>
        <textarea 
          value={localProject.details?.join('\n') || ''} 
          onChange={(e) => setLocalProject({ ...localProject, details: e.target.value.split('\n').filter(l => l.trim()) })}
          className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
          rows={4}
          placeholder="Detailed description paragraphs..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-300 italic">Completed Photos (one per line)</label>
        <div className="flex gap-4">
          <textarea 
            value={localProject.completedImages?.join('\n') || ''} 
            onChange={(e) => setLocalProject({ ...localProject, completedImages: e.target.value.split('\n').filter(l => l.trim()) })}
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
            onChange={(e) => setLocalProject({ ...localProject, design2DImages: e.target.value.split('\n').filter(l => l.trim()) })}
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
            onChange={(e) => setLocalProject({ ...localProject, design3DImages: e.target.value.split('\n').filter(l => l.trim()) })}
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
            onChange={(e) => setLocalProject({ ...localProject, detailImages: e.target.value.split('\n').filter(l => l.trim()) })}
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
          <input 
            value={localFestival.title} 
            onChange={(e) => setLocalFestival({ ...localFestival, title: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtitle</label>
          <input 
            value={localFestival.sub} 
            onChange={(e) => setLocalFestival({ ...localFestival, sub: e.target.value })}
            className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm text-gray-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Image URL</label>
        <div className="flex gap-4">
          <input 
            value={localFestival.imageUrl || ''} 
            onChange={(e) => setLocalFestival({ ...localFestival, imageUrl: e.target.value })}
            className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm"
            placeholder="Festival image URL"
          />
          <ImageUpload 
            label="Upload Image" 
            onUpload={(url) => setLocalFestival(prev => ({ ...prev, imageUrl: url }))} 
          />
        </div>
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
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
        <textarea 
          value={localFestival.description || ''} 
          onChange={(e) => setLocalFestival({ ...localFestival, description: e.target.value })}
          className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
          rows={3}
          placeholder="Festival description..."
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
    </div>
  );
}
