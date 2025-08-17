const { v4: uuidv4 } = require('uuid');

class Notification {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.userId = data.userId; // Reference to user document ID
        this.text = data.text || '';
        this.read = data.read || false;
        this.link = data.link || '';
        this.type = data.type || 'general';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            userId: this.userId,
            text: this.text,
            read: this.read,
            link: this.link,
            type: this.type,
            createdAt: this.createdAt
        };
    }

    static fromFirestore(id, data) {
        return new Notification({ id, ...data });
    }
}

module.exports = Notification;