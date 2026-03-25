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
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { Project, FestivalItem, AboutInfo } from './types';
import { INITIAL_ABOUT, INITIAL_PROJECTS, INITIAL_FESTIVALS } from './constants';

export function usePortfolioData() {
  const [about, setAbout] = useState<AboutInfo>(INITIAL_ABOUT);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [festivals, setFestivals] = useState<FestivalItem[]>(INITIAL_FESTIVALS);
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
        // Initialize if not exists
        setDoc(doc(db, 'settings', 'about'), INITIAL_ABOUT).catch(e => handleFirestoreError(e, OperationType.WRITE, 'settings/about'));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/about'));

    // Fetch Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      if (!snapshot.empty) {
        setProjects(snapshot.docs.map(d => d.data() as Project));
      } else {
        // Seed initial projects
        INITIAL_PROJECTS.forEach(p => {
          setDoc(doc(db, 'projects', p.id), p).catch(e => handleFirestoreError(e, OperationType.WRITE, `projects/${p.id}`));
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    // Fetch Festivals
    const qFestivals = query(collection(db, 'festivals'), orderBy('order', 'asc'));
    const unsubFestivals = onSnapshot(qFestivals, (snapshot) => {
      if (!snapshot.empty) {
        setFestivals(snapshot.docs.map(d => d.data() as FestivalItem));
      } else {
        // Seed initial festivals
        INITIAL_FESTIVALS.forEach(f => {
          setDoc(doc(db, 'festivals', f.id), f).catch(e => handleFirestoreError(e, OperationType.WRITE, `festivals/${f.id}`));
        });
      }
      setLoading(false);
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
