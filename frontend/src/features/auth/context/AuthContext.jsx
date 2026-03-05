import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            setIsLoading(false);
            return;
        }

        try {
            // Enrich stored user with persisted categories before using it
            const parsedUser = JSON.parse(storedUser);
            const savedCategories = localStorage.getItem('store_categories');
            if (savedCategories && parsedUser?.store) {
                parsedUser.store.categories = JSON.parse(savedCategories);
            }

            // First, use the stored user for immediate UI feedback
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Then verify with the backend
            const userData = await authApi.getCurrentUser();
            // Re-enrich with saved categories since backend doesn't return full array
            if (savedCategories && userData?.store) {
                userData.store.categories = JSON.parse(savedCategories);
            }
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Auth verification failed:', error);
            // Only clear if it's a genuine auth error (e.g. 401)
            if (error.message?.includes('401') || error.message?.includes('failed')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                localStorage.removeItem('onboarding_completed');
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const signIn = async (email, password) => {
        try {
            setIsLoading(true);
            const { user: userData } = await authApi.login({ email, password });

            // Enrich with categories from localStorage if they exist
            const savedCategories = localStorage.getItem('store_categories');
            if (savedCategories && userData?.store) {
                userData.store.categories = JSON.parse(savedCategories);
            }

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsAuthenticated(true);
            return { user: userData, error: null };
        } catch (error) {
            return { user: null, error: error.message || 'Credenciales inválidas' };
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (name, email, password) => {
        try {
            setIsLoading(true);
            const { user: userData } = await authApi.register({ name, email, password });
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsAuthenticated(true);
            return { user: userData, error: null };
        } catch (error) {
            return { user: null, error: error.message || 'Error al crear cuenta' };
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore
        }
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('onboarding_completed');
    }, []);

    const refreshUser = async () => {
        try {
            const userData = await authApi.getCurrentUser();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            return null;
        }
    };

    const signUpWithPhone = async (phone, password) => {
        return { data: null, error: { message: 'Registro con teléfono no implementado' } };
    };

    const signInWithFacebook = async () => {
        return { data: null, error: { message: 'Login con Facebook no implementado' } };
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signUpWithPhone,
        signInWithFacebook,
        signOut,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
