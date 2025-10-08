// // import { createContext, useContext, useEffect, useState } from 'react';
// // import { auth } from '../firebase/config';
// // import { onAuthStateChanged } from 'firebase/auth';

// // // Initialize with null
// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //     const [state, setState] = useState({
// //         currentUser: null,
// //         loading: true
// //     });

// //     useEffect(() => {
// //         const unsubscribe = onAuthStateChanged(auth, (user) => {
// //             setState({
// //                 currentUser: user,
// //                 loading: false
// //             });
// //         });

// //         return unsubscribe;
// //     }, []);

// //     return (
// //         <AuthContext.Provider value={state}>
// //             {!state.loading && children}
// //         </AuthContext.Provider>
// //     );
// // }

// // export function useAuth() {
// //     const context = useContext(AuthContext);
// //     if (!context) {
// //         throw new Error('useAuth must be used within AuthProvider');
// //     }
// //     return context;
// // }

// import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import {
//     auth,
//     onAuthStateChanged,
//     signOut as firebaseSignOut,
//     getIdTokenResult,
//     onIdTokenChanged
// } from '../firebase/config';
// import { useNavigate } from 'react-router-dom';

// // Persistent broadcast channel for cross-tab communication
// const authChannel = new BroadcastChannel('auth-events');

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [state, setState] = useState({
//         currentUser: null,
//         isAdmin: false, // NEW: Admin status flag
//         authLoading: true,
//         logoutLoading: false,
//         tokenRefreshTime: null,
//         sessionExpiresAt: null,
//         lastActivity: Date.now()
//     });

//     const navigate = useNavigate();

//     // Enhanced token refresh with retry logic
//     const handleTokenUpdate = useCallback(async (user) => {
//         if (!user) {
//             setState(prev => ({
//                 ...prev,
//                 currentUser: null,
//                 isAdmin: false, // Reset admin status on logout
//                 tokenRefreshTime: null,
//                 sessionExpiresAt: null
//             }));
//             return;
//         }

//         const MAX_RETRIES = 3;
//         let retryCount = 0;

//         const attemptRefresh = async () => {
//             try {
//                 const tokenResult = await getIdTokenResult(user);
//                 const expiresIn = new Date(tokenResult.expirationTime).getTime() - Date.now();
//                 const isAdmin = !!tokenResult.claims?.admin; // Define isAdmin here

//                 setState(prev => ({
//                     ...prev,
//                     currentUser: {
//                         ...user,
//                         isAdmin // Include admin status
//                     },
//                     isAdmin, // Set admin status
//                     tokenRefreshTime: Date.now(),
//                     sessionExpiresAt: Date.now() + expiresIn,
//                     lastActivity: Date.now()
//                 }));

//                 // Schedule refresh 5 mins before expiry
//                 if (expiresIn > 300000) {
//                     setTimeout(async () => {
//                         try {
//                             await user.getIdToken(true);
//                         } catch (error) {
//                             console.error("Background token refresh failed:", error);
//                         }
//                     }, expiresIn - 300000);
//                 }
//             } catch (error) {
//                 console.error("Token refresh failed:", error);
//                 if (retryCount < MAX_RETRIES) {
//                     retryCount++;
//                     setTimeout(attemptRefresh, 5000 * retryCount);
//                 }
//             }
//         };

//         await attemptRefresh();
//     }, []);

//     // Robust sign out handler
//     const handleSignOut = useCallback(async (options = {}) => {
//         const {
//             redirectTo = '/login',
//             onSuccess,
//             onError,
//             broadcast = true,
//             silent = false
//         } = options;

//         try {
//             if (!silent) {
//                 setState(prev => ({ ...prev, logoutLoading: true }));
//             }

//             // Clear state first to prevent UI flickering
//             setState(prev => ({
//                 ...prev,
//                 currentUser: null,
//                 tokenRefreshTime: null,
//                 sessionExpiresAt: null,
//                 logoutLoading: false
//             }));

//             // Sign out from Firebase
//             await firebaseSignOut(auth);

//             // Broadcast to other tabs if needed
//             if (broadcast) {
//                 try {
//                     authChannel.postMessage({ type: 'LOGOUT' });
//                 } catch (channelError) {
//                     console.warn('BroadcastChannel message failed:', channelError);
//                 }
//             }

//             if (redirectTo) {
//                 navigate(redirectTo);
//             }

//             if (onSuccess) {
//                 onSuccess();
//             }

//             return true;
//         } catch (error) {
//             console.error("Logout failed:", error);
//             if (!silent) {
//                 setState(prev => ({ ...prev, logoutLoading: false }));
//             }
//             if (onError) {
//                 onError(error);
//             }
//             throw error;
//         }
//     }, [navigate]);

//     // Session management effects
//     useEffect(() => {
//         // Activity tracker to detect idle sessions
//         const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//         const handleActivity = () => {
//             setState(prev => ({ ...prev, lastActivity: Date.now() }));
//         };

//         activityEvents.forEach(event => {
//             window.addEventListener(event, handleActivity);
//         });

//         // Session timeout checker
//         const checkSession = () => {
//             if (state.sessionExpiresAt && Date.now() > state.sessionExpiresAt) {
//                 handleSignOut({
//                     redirectTo: '/login',
//                     broadcast: true,
//                     silent: true
//                 });
//             }
//         };

//         const sessionCheckInterval = setInterval(checkSession, 60000);
//         const activityCheckInterval = setInterval(() => {
//             // Auto-logout after 30 minutes of inactivity
//             if (state.lastActivity && Date.now() - state.lastActivity > 30 * 60 * 1000) {
//                 handleSignOut({
//                     redirectTo: '/login',
//                     broadcast: true,
//                     silent: true
//                 });
//             }
//         }, 60000);

//         return () => {
//             activityEvents.forEach(event => {
//                 window.removeEventListener(event, handleActivity);
//             });
//             clearInterval(sessionCheckInterval);
//             clearInterval(activityCheckInterval);
//         };
//     }, [state.sessionExpiresAt, state.lastActivity, handleSignOut]);

//     // Auth state and token listeners
//     useEffect(() => {
//         let unsubscribeAuth, unsubscribeToken;

//         const handleChannelMessage = (event) => {
//             if (event.data.type === 'LOGOUT' && state.currentUser) {
//                 setState({
//                     currentUser: null,
//                     authLoading: false,
//                     logoutLoading: false,
//                     tokenRefreshTime: null,
//                     sessionExpiresAt: null,
//                     lastActivity: null
//                 });
//                 navigate('/login');
//             }
//         };

//         const initializeAuth = async () => {
//             unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
//                 await handleTokenUpdate(user);
//                 setState(prev => ({ ...prev, authLoading: false }));
//             });

//             unsubscribeToken = onIdTokenChanged(auth, handleTokenUpdate);
//             authChannel.addEventListener('message', handleChannelMessage);
//         };

//         initializeAuth();

//         return () => {
//             if (unsubscribeAuth) unsubscribeAuth();
//             if (unsubscribeToken) unsubscribeToken();
//             authChannel.removeEventListener('message', handleChannelMessage);
//         };
//     }, [handleTokenUpdate, navigate, state.currentUser]);

//     // Network status handler
//     useEffect(() => {
//         const handleOnline = () => {
//             if (state.currentUser) {
//                 state.currentUser.getIdToken(true).catch(error => {
//                     console.error("Token refresh after reconnect failed:", error);
//                 });
//             }
//         };

//         window.addEventListener('online', handleOnline);
//         return () => window.removeEventListener('online', handleOnline);
//     }, [state.currentUser]);

//     // Context value
//     const contextValue = {
//         ...state,
//         setCurrentUser: (user) => setState(prev => ({ ...prev, currentUser: user })),
//         signOut: handleSignOut,
//         refreshToken: async () => {
//             if (auth.currentUser) {
//                 try {
//                     const tokenResult = await auth.currentUser.getIdTokenResult(true);
//                     setState(prev => ({
//                         ...prev,
//                         isAdmin: !!tokenResult.claims?.admin
//                     }));
//                     return true;
//                 } catch (error) {
//                     console.error("Manual token refresh failed:", error);
//                     throw error;
//                 }
//             }
//             return false;
//         },

//         updateUserProfile: async (updates) => {
//             if (auth.currentUser) {
//                 try {
//                     await updateProfile(auth.currentUser, updates);
//                     setState(prev => ({
//                         ...prev,
//                         currentUser: { ...prev.currentUser, ...updates }
//                     }));
//                     return true;
//                 } catch (error) {
//                     console.error("Profile update failed:", error);
//                     throw error;
//                 }
//             }
//             return false;
//         }
//     };

//     return (
//         <AuthContext.Provider value={contextValue}>
//             {!state.authLoading && children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within AuthProvider');
//     }
//     return context;
// }



import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    auth,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    getIdTokenResult
} from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [state, setState] = useState({
        currentUser: null,
        isAdmin: false,
        authLoading: true,
        logoutLoading: false
    });

    const navigate = useNavigate();

    // 1. Simplified Token Handler
    const handleTokenUpdate = useCallback(async (user) => {
        if (!user) {
            return setState({
                currentUser: null,
                isAdmin: false,
                authLoading: false,
                logoutLoading: false
            });
        }

        try {
            const tokenResult = await getIdTokenResult(user);
            const isAdmin = !!tokenResult.claims?.admin;

            const updatedUser = {
                ...user,
                isAdmin // Include admin status directly in user object
            };
            setState({
                currentUser: updatedUser,
                isAdmin: !!tokenResult.claims?.admin,
                authLoading: false,
                logoutLoading: false
            });
            return updatedUser; // Return the complete user object
        } catch (error) {
            console.error("Auth error:", error);
            setState(prev => ({ ...prev, authLoading: false }));
        }
    }, []);

    // 2. Bulletproof Sign Out
    const handleSignOut = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, logoutLoading: true }));
            await firebaseSignOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setState({
                currentUser: null,
                isAdmin: false,
                authLoading: false,
                logoutLoading: false
            });
        }
    }, [navigate]);

    // 3. FIXED: Get Firebase ID Token - Use auth.currentUser directly
    const getIdToken = useCallback(async (forceRefresh = false) => {
        try {
            // Use auth.currentUser directly instead of state.currentUser
            const currentAuthUser = auth.currentUser;
            if (!currentAuthUser) {
                throw new Error('No user is currently logged in');
            }
            
            // Get the ID token from the Firebase auth currentUser
            const token = await currentAuthUser.getIdToken(forceRefresh);
            return token;
        } catch (error) {
            console.error('Error getting ID token:', error);
            throw new Error('Failed to get authentication token');
        }
    }, []); // Remove dependency on state.currentUser

    // 4. Clean Auth Setup
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleTokenUpdate);
        return () => unsubscribe();
    }, [handleTokenUpdate]);

    useEffect(() => {
        console.log('Auth state changed:', {
            user: state.currentUser?.email,
            isAdmin: state.isAdmin,
            loading: state.authLoading
        });
    }, [state]);

    return (
        <AuthContext.Provider value={{
            ...state,
            signOut: handleSignOut,
            refreshToken: () => auth.currentUser?.getIdToken(true),
            getIdToken // ADD THIS to the context value
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
