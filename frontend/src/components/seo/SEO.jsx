import { Helmet } from "react-helmet-async";

export default function SEO({
    title,
    description,
    keywords,
    image = "https://utkalbehera.com/og-image.png",
    url = "https://utkalbehera.com/",
}) {
    return (
        <Helmet>
            <title>{title}</title>

            <meta name="description" content={description} />

            {keywords && <meta name="keywords" content={keywords} />}

            <link rel="canonical" href={url} />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta
                property="og:description"
                content="Full Stack MERN Developer building scalable web apps with React, Next.js, Node.js, MongoDB, AI, and AWS."
            />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
