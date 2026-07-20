import { Helmet } from "react-helmet-async";

/**
 * SEO — reusable React Helmet wrapper.
 *
 * Fixes:
 * - og:description was hardcoded and ignored the `description` prop (bug)
 * - Added og:locale, og:site_name, twitter:creator
 * - Added `schema` prop for injecting page-specific JSON-LD structured data
 * - Added `noIndex` prop for pages that should not be crawled (e.g. admin)
 */
export default function SEO({
    title,
    description,
    keywords,
    image = "https://utkalbehera.com/og-image.png",
    url = "https://utkalbehera.com/",
    type = "website",
    schema = null,
    noIndex = false,
}) {
    return (
        <Helmet>
            <title>{title}</title>

            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta
                    name="robots"
                    content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
                />
            )}

            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Utkal Behera Portfolio" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:title" content={title} />
            {/* FIX: was hardcoded — now uses the description prop */}
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:url" content={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@utkalbehera" />
            <meta name="twitter:creator" content="@utkalbehera" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />


            {/* Inject page-specific JSON-LD structured data.
                schema can be a single object or an array of schema objects. */}
            {schema && (
                Array.isArray(schema) ? schema.map((s, i) => (
                    <script key={i} type="application/ld+json">
                        {JSON.stringify(s)}
                    </script>
                )) : (
                    <script type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                )
            )}
        </Helmet>
    );
}
