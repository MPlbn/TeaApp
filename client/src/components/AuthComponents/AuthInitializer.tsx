
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials, setUser } from '../../store/authSlice';
import {
    useRefreshTokenMutation,
    useLazyGetCurrentUserQuery
} from '../../services/teaApi';

type AuthInitializerProps = {
    children: ReactNode;
};

const AuthInitializer = (props: AuthInitializerProps) => {
    const dispatch = useAppDispatch();

    const [isInitializing, setIsInitializing] = useState(true);
    const hasInitialized = useRef(false);

    const [refreshToken] = useRefreshTokenMutation();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initializeAuth = async () => {
            console.log('Initializing auth...');
            try {
                const storedRefreshToken = await window.authStorage.get();
                console.log('Stored refresh token:', storedRefreshToken);

                if (!storedRefreshToken) return;

                const response = await refreshToken({
                    refreshToken: storedRefreshToken
                }).unwrap();

                await window.authStorage.save(response.refreshToken);

                dispatch(setCredentials({
                    accessToken: response.token,
                    expiresAt: response.expiresAt
                }));

                const user = await getCurrentUser().unwrap();

                dispatch(setUser(user));
            }
            catch (uError) {
                console.error('Auth initialization failed:', uError);
            }
            finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [dispatch, refreshToken, getCurrentUser]);

    if (isInitializing) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    return props.children;
};

export default AuthInitializer;