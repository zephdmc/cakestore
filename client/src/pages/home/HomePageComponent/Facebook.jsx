export default function FacebookIntegration() {
    useEffect(() => {
        // Load Facebook SDK
        if (window.FB) return;

        const script = document.createElement('script');
        script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="bg-white p-4 rounded-xl">
            <div className="flex items-center justify-center mb-6">
                <svg className="w-8 h-8 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                <h3 className="text-xl font-bold">Join Our Facebook Community</h3>
            </div>

            {/* Facebook Page Plugin - replace with your actual page */}
            <div
                className="fb-page"
                data-href="https://www.facebook.com/yourpage"
                data-tabs="timeline"
                data-width="500"
                data-height="400"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
            >
                <blockquote cite="https://www.facebook.com/yourpage" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/yourpage">Your Page</a>
                </blockquote>
            </div>

            <div className="text-center mt-6">
                <a
                    href="https://facebook.com/yourpage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                >
                    Like us on Facebook
                </a>
            </div>
        </div>
    );
}