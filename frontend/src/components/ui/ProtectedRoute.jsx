/**
 * ProtectedRoute — guards admin routes.
 *
 * FIX: The original version read `isAuthenticated` synchronously on first
 * render. Because Zustand's `persist` middleware rehydrates from localStorage
 * asynchronously, `isAuthenticated` is `false` for ~1 render frame even when
 * the user IS logged in. This caused an immediate redirect to /admin/login.
 *
 * Solution: use Zustand's `onRehydrateStorage` signal via a local state flag.
 * During the brief hydration window we show nothing (null). Once rehydration
 * completes we either render children or redirect.
 */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/index.js";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuthStore();

    // Track whether Zustand has finished replaying persisted state from localStorage.
    // `persist.hasHydrated()` is synchronous on recent Zustand versions.
    const [hydrated, setHydrated] = useState(
        () => useAuthStore.persist?.hasHydrated?.() ?? true,
    );

    useEffect(() => {
        // If not yet hydrated, subscribe to the rehydration event.
        if (!hydrated) {
            const unsub = useAuthStore.persist.onHydrate(() => {
                setHydrated(true);
            });
            // Also set via onFinishHydration for compatibility
            const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
                setHydrated(true);
            });
            return () => {
                unsub?.();
                unsubFinish?.();
            };
        }
    }, [hydrated]);

    // During the hydration window, render nothing.
    // This prevents the brief flash-redirect to /admin/login.
    if (!hydrated) return null;

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
