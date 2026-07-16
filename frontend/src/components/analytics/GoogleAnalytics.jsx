import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-2K62JL06X3";

export default function GoogleAnalytics() {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize(MEASUREMENT_ID);
    }, []);

    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location]);

    return null;
}
