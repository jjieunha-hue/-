/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { Project, FestivalItem, AboutInfo } from './types';
import { INITIAL_ABOUT, INITIAL_PROJECTS, INITIAL_FESTIVALS } from './constants';

export function usePortfolioData() {
  const [about, setAbout] = useState<AboutInfo>(INITIAL_ABOUT);
  const [projects, setProjects] = useState<Project[]>([]);
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === 'jjieunha@gmail.com');
    });

    // Fetch About
    const unsubAbout = onSnapshot(doc(db, 'settings', 'about'), (snapshot) => {
      if (snapshot.exists()) {
        setAbout(snapshot.data() as AboutInfo);
      } else {
        setDoc(doc(db, 'settings', 'about'), INITIAL_ABOUT).catch(e => handleFirestoreError(e, OperationType.WRITE, 'settings/about'));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/about'));

    // Fetch Projects
    const qProjects = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      if (!snapshot.empty) {
        setProjects(snapshot.docs.map(d => d.data() as Project));
      } else {
        const batch = writeBatch(db);
        INITIAL_PROJECTS.forEach(p => {
          batch.set(doc(db, 'projects', p.id), p);
        });
        batch.commit().catch(e => handleFirestoreError(e, OperationType.WRITE, 'projects_batch'));
        // Keep initial data in state until batch syncs
        setProjects(INITIAL_PROJECTS);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    // Fetch Festivals
    const qFestivals = query(collection(db, 'festivals'), orderBy('order', 'asc'));
    const unsubFestivals = onSnapshot(qFestivals, (snapshot) => {
      if (!snapshot.empty) {
        setFestivals(snapshot.docs.map(d => d.data() as FestivalItem));
        setLoading(false);
      } else {
        const batch = writeBatch(db);
        INITIAL_FESTIVALS.forEach(f => {
          batch.set(doc(db, 'festivals', f.id), f);
        });
        batch.commit().then(() => {
          // No need to set loading false here, the next snapshot will handle it
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, 'festivals_batch'));
        
        setFestivals(INITIAL_FESTIVALS);
        setLoading(false);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'festivals'));

    return () => {
      unsubscribeAuth();
      unsubAbout();
      unsubProjects();
      unsubFestivals();
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateAbout = async (newData: AboutInfo) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), newData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/about');
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
    }
  };

  const updateFestival = async (festival: FestivalItem) => {
    try {
      await setDoc(doc(db, 'festivals', festival.id), festival);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `festivals/${festival.id}`);
    }
  };

  return {
    about,
    projects,
    festivals,
    loading,
    user,
    isAdmin,
    login,
    logout,
    updateAbout,
    updateProject,
    updateFestival
  };
}
