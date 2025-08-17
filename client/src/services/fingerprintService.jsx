/**
 * Generates a device fingerprint without PII
 */
export const getDeviceFingerprint = async () => {
    try {
        const components = {
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            webglVendor: await getWebGLInfo()
        };

        const str = JSON.stringify(components);
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Fingerprint generation failed:', error);
        return 'error_fallback_' + Math.random().toString(36).slice(2, 10);
    }
};

const getWebGLInfo = () => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'no_webgl';

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        } : 'webgl_no_debug';
    } catch (e) {
        return 'webgl_error';
    }
};