import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * GoogleAnalytics — initializes GA4 and tracks page views.
 *
 * Fixes:
 * 1. Guards against missing VITE_GA_MEASUREMENT_ID in dev — silently no-ops
 *    instead of throwing "Require GA_MEASUREMENT_ID".
 * 2. Ensures pageview is only sent AFTER initialization (fixes the race where
 *    the pageview effect ran before initialize completed).
 * 3. Initializes only once (ref guard prevents StrictMode double-init).
 */
export default function GoogleAnalytics() {
    const location = useLocation();
    const initialized = useRef(false);

    useEffect(() => {
        // Skip silently if no measurement ID (e.g. local dev without .env.local)
        if (!GA_ID) {
            if (import.meta.env.DEV) {
                console.info(
                    "[GA4] VITE_GA_MEASUREMENT_ID not set — analytics disabled in dev. " +
                    "Add it to frontend/.env.local to enable.",
                );
            }
            return;
        }

        // Guard against StrictMode double-invocation
        if (initialized.current) return;
        initialized.current = true;

        ReactGA.initialize(GA_ID);

        // Send the initial pageview immediately after init
        ReactGA.send({
            hitType: "pageview",
            page: window.location.pathname + window.location.search,
        });
    }, []);

    // Track subsequent navigations
    useEffect(() => {
        if (!initialized.current) return;
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location]);

    return null;
}
