import { useState } from 'react';
import { makeAdmin, removeAdmin, getAdminUsers } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useAuth();

    const handleMakeAdmin = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const result = await makeAdmin(email);
            setMessage(result.message);
        } catch (error) {
            setMessage(error.message || 'Failed to set admin');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAdmin = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const result = await removeAdmin(email);
            setMessage(result.message);
        } catch (error) {
            setMessage(error.message || 'Failed to remove admin');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return <div>You must be an admin to access this page</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="mb-4">
                <label className="block mb-2">User Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter user email"
                />
            </div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleMakeAdmin}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Make Admin'}
                </button>
                <button
                    onClick={handleRemoveAdmin}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Remove Admin'}
                </button>
            </div>
            {message && <div className="p-2 bg-gray-100 rounded">{message}</div>}
        </div>
    );
};

export default UserManagement;