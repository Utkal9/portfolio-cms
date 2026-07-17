import { Helmet } from "react-helmet-async";

export default function SEO({
    title,
    description,
    keywords,
    image = "https://utkalbehera.com/og-image.png",
    url = "https://utkalbehera.com/",
    type = "website",
    jsonLd,
}) {
    const resolvedTitle = title || "Utkal Behera | Full Stack Developer";
    const resolvedDescription =
        description ||
        "Full Stack MERN Developer building scalable web apps with React, Next.js, Node.js, MongoDB, AI, and AWS.";

    return (
        <Helmet>
            <title>{resolvedTitle}</title>
            <meta name="description" content={resolvedDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={url} />

            <meta property="og:type" content={type} />
            <meta property="og:title" content={resolvedTitle} />
            <meta property="og:description" content={resolvedDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={resolvedTitle} />
            <meta name="twitter:description" content={resolvedDescription} />
            <meta name="twitter:image" content={image} />

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
