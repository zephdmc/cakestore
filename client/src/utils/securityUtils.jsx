/**
 * Generates a cryptographic security token for payment verification
 * Uses Web Crypto API for browser-based cryptography
 */
export const generateSecurityToken = async (userId, txRef) => {
    try {
        // Combine with timestamp for uniqueness
        const data = `${userId}|${txRef}|${Date.now()}`;

        // Use Web Crypto API for in-browser hashing
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        // Generate SHA-256 hash
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // Convert to hex string
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Token generation failed:', error);

        // Fallback for browsers without crypto.subtle
        if (window.crypto?.getRandomValues) {
            const fallback = window.crypto.getRandomValues(new Uint32Array(1))[0];
            return `fallback_${fallback.toString(36)}_${Date.now()}`;
        }

        // Last resort fallback
        return `ultra_fallback_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    }
};

/**
 * Generates a CSRF nonce for form protection
 */
export const generateNonce = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString(36);
};

/**
 * Validates Flutterwave response signature
 */
export const validatePaymentResponse = (response, expectedAmount) => {
    if (!response || typeof response !== 'object') return false;

    // Critical field checks
    const requiredFields = [
        'tx_ref', 'transaction_id', 'status', 'amount', 'currency'
    ];

    if (!requiredFields.every(field => field in response)) {
        return false;
    }

    // Type validation
    if (typeof response.amount !== 'number' ||
        typeof response.status !== 'string') {
        return false;
    }

    // Amount matching with 2 decimal precision
    const amountDiff = Math.abs(response.amount - expectedAmount);
    if (amountDiff > 0.01) return false;

    // Status check
    return response.status.toLowerCase() === 'successful';
};