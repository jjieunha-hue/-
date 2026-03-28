import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // 여기를 지은님의 프로젝트 ID에 맞춰서 강제로 고정했습니다!
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// 줄바꿈 마법 (다른 건 안 건드리고 글자만 예쁘게!)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .rich-text-content, .project-description, p { 
      white-space: pre-wrap !important; 
      word-break: keep-all !important; 
      overflow-wrap: break-word !important; 
    }
  `;
  document.head.appendChild(style);
}

export enum OperationType { CREATE = 'create', UPDATE = 'update', DELETE = 'delete', LIST = 'list', GET = 'get', WRITE = 'write' }
export function handleFirestoreError(error: unknown) { console.error(error); }
