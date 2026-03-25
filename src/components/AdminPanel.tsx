/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, FestivalItem, AboutInfo } from '../types';
import { usePortfolioData } from '../hooks';
import { X, Save, Plus, Trash2, LogOut, Settings } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const { about, projects, festivals, updateAbout, updateProject, updateFestival, logout } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'festivals'>('about');

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
    };
    updateAbout(updatedAbout);
    alert('저장되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-20">
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

        <div className="flex gap-8 mb-12 border-b border-gray-100">
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
              <input name="highlight" defaultValue={about.highlight} className="w-full p-4 border border-gray-100 focus:border-black outline-none font-bold" />
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
            <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-12">
            {projects.map((project) => (
              <div key={project.id} className="p-8 border border-gray-100 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black uppercase tracking-tighter">{project.title}</h3>
                  <span className="text-[10px] font-black uppercase bg-gray-100 px-2 py-1">{project.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    value={project.title} 
                    onChange={(e) => updateProject({ ...project, title: e.target.value })}
                    className="p-2 border border-gray-50 outline-none focus:border-black text-sm font-bold"
                    placeholder="Title"
                  />
                  <input 
                    value={project.subtitle} 
                    onChange={(e) => updateProject({ ...project, subtitle: e.target.value })}
                    className="p-2 border border-gray-50 outline-none focus:border-black text-sm"
                    placeholder="Subtitle"
                  />
                </div>
                <textarea 
                  value={project.description} 
                  onChange={(e) => updateProject({ ...project, description: e.target.value })}
                  className="w-full p-2 border border-gray-50 outline-none focus:border-black text-sm font-light"
                  rows={3}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div className="space-y-4">
            {festivals.map((f) => (
              <div key={f.id} className="flex gap-4 items-center p-4 border border-gray-100">
                <input 
                  value={f.title} 
                  onChange={(e) => updateFestival({ ...f, title: e.target.value })}
                  className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm font-bold"
                />
                <input 
                  value={f.sub} 
                  onChange={(e) => updateFestival({ ...f, sub: e.target.value })}
                  className="flex-1 p-2 border border-gray-50 outline-none focus:border-black text-sm text-gray-400"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
