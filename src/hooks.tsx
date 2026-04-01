/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { db, auth, storage, OperationType, handleFirestoreError } from './firebase';
import { Project, FestivalItem, AboutInfo } from './types';
import { INITIAL_ABOUT, INITIAL_PROJECTS, INITIAL_FESTIVALS } from './constants';

type PortfolioContextType = {
  about: AboutInfo;
  projects: Project[];
  festivals: FestivalItem[];
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateAbout: (newData: AboutInfo) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  updateFestival: (festival: FestivalItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  deleteFestival: (id: string) => Promise<void>;
  uploadImage: (file: File, path: string, onProgress?: (p: number) => void) => Promise<string>;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

function usePortfolioDataInternal() {
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
      }
    }, (error) => {
      console.error('About fetch error:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'settings/about');
    });

    // Fetch Projects
    const qProjects = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      if (!snapshot.empty) {
        setProjects(snapshot.docs.map(d => d.data() as Project));
      } else {
        setProjects(INITIAL_PROJECTS);
      }
    }, (error) => {
      console.error('Projects fetch error:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    // Fetch Festivals
    const qFestivals = query(collection(db, 'festivals'), orderBy('order', 'asc'));
    const unsubFestivals = onSnapshot(qFestivals, (snapshot) => {
      if (!snapshot.empty) {
        setFestivals(snapshot.docs.map(d => d.data() as FestivalItem));
        setLoading(false);
      } else {
        setFestivals(INITIAL_FESTIVALS);
        setLoading(false);
      }
    }, (error) => {
      console.error('Festivals fetch error:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'festivals');
    });

    return () => {
      unsubscribeAuth();
      unsubAbout();
      unsubProjects();
      unsubFestivals();
    };
  }, []);

  // Separate Seeding Logic to ensure it only runs when auth is ready and user is admin
  useEffect(() => {
    if (loading || !isAdmin || !user) return;

    const seedData = async () => {
      try {
        // Force token refresh to ensure permissions are recognized
        await user.getIdToken(true);

        // Seed About if it's still the initial placeholder
        if (about.name === INITIAL_ABOUT.name && about.email === INITIAL_ABOUT.email) {
          await setDoc(doc(db, 'settings', 'about'), INITIAL_ABOUT);
          console.log('About seeded');
        }

        // Seed Projects if empty
        if (projects.length === 0) {
          const batch = writeBatch(db);
          INITIAL_PROJECTS.forEach(p => {
            batch.set(doc(db, 'projects', p.id), p);
          });
          await batch.commit();
          console.log('Projects seeded');
        }

        // Seed Festivals if empty
        if (festivals.length === 0) {
          const batch = writeBatch(db);
          INITIAL_FESTIVALS.forEach(f => {
            batch.set(doc(db, 'festivals', f.id), f);
          });
          await batch.commit();
          console.log('Festivals seeded');
        }
      } catch (e) {
        console.error('Seeding failed:', e);
      }
    };

    seedData();
  }, [loading, isAdmin, user]);

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
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다. (Authentication required)');
    }
    try {
      await currentUser.getIdToken(true); // Force token refresh
      await setDoc(doc(db, 'settings', 'about'), newData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/about');
    }
  };

  const updateProject = async (project: Project) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다. (Authentication required)');
    }
    try {
      await currentUser.getIdToken(true); // Force token refresh
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
    }
  };

  const updateFestival = async (festival: FestivalItem) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다. (Authentication required)');
    }
    try {
      await currentUser.getIdToken(true); // Force token refresh
      await setDoc(doc(db, 'festivals', festival.id), festival);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `festivals/${festival.id}`);
    }
  };

  const deleteProject = async (id: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다. (Authentication required)');
    }
    try {
      await currentUser.getIdToken(true);
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const deleteFestival = async (id: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('로그인이 필요합니다. (Authentication required)');
    }
    try {
      await currentUser.getIdToken(true);
      await deleteDoc(doc(db, 'festivals', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `festivals/${id}`);
    }
  };

  const uploadImage = (file: File, path: string, onProgress?: (p: number) => void) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise<string>((resolve, reject) => {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(p);
        },
        (error) => {
          console.error('Upload task error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
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
    updateFestival,
    deleteProject,
    deleteFestival,
    uploadImage
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const data = usePortfolioDataInternal();
  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider');
  }
  return context;
}
