import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AuthState {
  user: any | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthAction {
  type: 'SET_USER' | 'SET_PROFILE' | 'SET_LOADING' | 'SET_ADMIN' | 'LOGOUT';
  payload?: any;
}

const AuthContext = createContext<{
  state: AuthState;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  adminSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  updateUser: (userData: any) => void;
  fetchUserProfile: (token: string) => Promise<any>;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        isAdmin: action.payload?.role === 'admin',
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ADMIN':
      return {
        ...state,
        isAdmin: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        isAdmin: false,
      };
    default:
      return state;
  }
};

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to check expiration? Ideally verify with backend.
      // For now, assume valid or fail on profile fetch.
      fetchUserProfile(token);
      dispatch({ type: 'SET_USER', payload: { token } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        dispatch({ type: 'SET_PROFILE', payload: data });
        return data;
      } else {
        // Token invalid or other error
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        throw new Error('Failed to fetch user profile');
      }
    } catch (error: any) {
      console.error('Failed to fetch profile', error);
      throw error; // Propagate error so callers know auth is incomplete
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      toast.success('Account created successfully!');
      // No auto-login. User must log in manually.
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_USER', payload: { email } });

      const userProfile = await fetchUserProfile(data.token);
      toast.success(`Welcome ${userProfile.full_name}!`);
      return userProfile;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Admin login failed');
      }
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_USER', payload: { email } });

      const userProfile = await fetchUserProfile(data.token);
      toast.success(`Welcome Admin ${userProfile.full_name}!`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Signed out successfully');
  };

  const signInWithGoogle = async () => {
    toast.error('Google Sign In not implemented yet');
  };

  const signInWithFacebook = async () => {
    toast.error('Facebook Sign In not implemented yet');
  };

  const updateUser = (userData: any) => {
    if (state.user) {
      dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        signUp,
        signIn,
        adminSignIn,

        signOut,
        signInWithGoogle,
        signInWithFacebook,
        updateUser,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
