import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  auth,
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import type { UserProfile } from '../types/lapas';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  authReady: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setAuthReady(true);
        return;
      }

      const safeUid = currentUser.uid.replace(/[^a-zA-Z0-9_-]/g, '');
      const userPath = `users/${safeUid}`;
      try {
        const snap = await getDoc(doc(db, 'users', safeUid));
        const isOwnerAdmin =
          Boolean(currentUser.emailVerified) &&
          currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

        if (snap.exists()) {
          const data = snap.data() as Omit<UserProfile, 'id'>;
          setProfile({ id: snap.id, ...data });
        } else {
          const initialRole = isOwnerAdmin ? 'admin' : 'reader';
          const newProfile: Omit<UserProfile, 'id'> = {
            uid: safeUid,
            email: (currentUser.email || 'user@example.com').slice(0, 200),
            displayName: (currentUser.displayName || 'Pengguna LapAs').slice(0, 120),
            role: initialRole,
            photoUrl: (currentUser.photoURL || '').slice(0, 1500),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', safeUid), newProfile);
          setProfile({ id: safeUid, ...newProfile });
        }
      } catch (err) {
        console.warn('Sinkronisasi profil pengguna:', err);
        if (currentUser.emailVerified && currentUser.email === BOOTSTRAPPED_ADMIN_EMAIL) {
          setProfile({
            id: safeUid,
            uid: safeUid,
            email: currentUser.email,
            displayName: currentUser.displayName || 'Admin LapAs',
            role: 'admin',
            photoUrl: currentUser.photoURL || '',
          });
        } else {
          try {
            handleFirestoreError(err, OperationType.GET, userPath);
          } catch {
            // Surface gracefully without crashing public browsing
          }
        }
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google.';
      if (msg.includes('popup-closed-by-user')) {
        setAuthError('Jendela masuk Google ditutup sebelum selesai.');
      } else if (msg.includes('auth/unauthorized-domain')) {
        setAuthError(
          `UNAUTHORIZED_DOMAIN:${typeof window !== 'undefined' ? window.location.hostname : ''}`
        );
      } else {
        setAuthError(msg);
      }
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const isAdmin = Boolean(
    user &&
      user.emailVerified &&
      (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() ||
        profile?.role === 'admin')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        authReady,
        authError,
        signInWithGoogle,
        logout,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return ctx;
}
