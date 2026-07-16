import { useEffect } from "react";

const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

export default function Clarity() {
    useEffect(() => {
        if (!CLARITY_ID) return;

        (function (c, l, a, r, i, t, y) {
            c[a] =
                c[a] ||
                function () {
                    (c[a].q = c[a].q || []).push(arguments);
                };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", CLARITY_ID);
    }, []);

    return null;
}
