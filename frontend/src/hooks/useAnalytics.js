/**
 * useAnalytics — thin GA4 event tracking hook
 *
 * Usage:
 *   const { trackEvent } = useAnalytics();
 *   trackEvent("project_click", { project_title: "My App", project_slug: "my-app" });
 *
 * Pre-built helpers:
 *   trackProjectClick(project)
 *   trackBlogRead(post)
 *   trackResumeDownload()
 *   trackContactFormSubmit()
 *   trackSearch(query, resultsCount)
 *   trackExternalLink(url, label)
 */
import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const isEnabled = () => !!GA_ID;

function trackEvent(eventName, params = {}) {
    if (!isEnabled()) return;
    ReactGA.event(eventName, params);
}

export function useAnalytics() {
    return {
        trackEvent,

        trackProjectClick(project) {
            trackEvent("project_click", {
                project_title: project?.title,
                project_slug: project?.slug || project?._id,
                project_category: project?.category,
            });
        },

        trackBlogRead(post) {
            trackEvent("blog_read", {
                post_title: post?.title,
                post_slug: post?.slug,
                post_category: post?.category?.name,
                reading_time: post?.readingTime,
            });
        },

        trackResumeDownload() {
            trackEvent("resume_download");
        },

        trackContactFormSubmit() {
            trackEvent("contact_form_submit");
        },

        trackSearch(query, resultsCount) {
            trackEvent("search", {
                search_term: query,
                results_count: resultsCount,
            });
        },

        trackExternalLink(url, label) {
            trackEvent("external_link_click", {
                link_url: url,
                link_label: label,
            });
        },
    };
}
