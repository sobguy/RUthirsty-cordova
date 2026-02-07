/**
 * Data Manager - Handles all localStorage operations and data management
 */

const DataManager = {
    STORAGE_KEY: 'waterIntakeRecords',
    SETTINGS_KEY: 'waterIntakeSettings',
    DEFAULT_AMOUNT: 250, // ml

    /**
     * Get settings from localStorage
     * @returns {Object} Settings object
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            return data ? JSON.parse(data) : { amountPerGlass: this.DEFAULT_AMOUNT };
        } catch (error) {
            console.error('Error reading settings from localStorage:', error);
            return { amountPerGlass: this.DEFAULT_AMOUNT };
        }
    },

    /**
     * Save settings to localStorage
     * @param {Object} settings - Settings object to save
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
        }
    },

    /**
     * Get current amount per glass setting
     * @returns {number} Amount in ml
     */
    getAmountPerGlass() {
        const settings = this.getSettings();
        return settings.amountPerGlass || this.DEFAULT_AMOUNT;
    },

    /**
     * Update amount per glass setting
     * @param {number} amount - New amount in ml
     */
    setAmountPerGlass(amount) {
        const settings = this.getSettings();
        settings.amountPerGlass = amount;
        this.saveSettings(settings);
    },

    /**
     * Get all records from localStorage
     * @returns {Array} Array of water intake records
     */
    getAllRecords() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    /**
     * Save records to localStorage
     * @param {Array} records - Array of records to save
     */
    saveRecords(records) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Add a new water intake record
     * @returns {Object} The newly created record
     */
    addRecord() {
        const now = new Date();
        const record = {
            id: `${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: now.getTime(),
            date: this.formatDate(now),
            time: this.formatTime(now),
            amount: this.getAmountPerGlass()
        };

        const records = this.getAllRecords();
        records.push(record);
        this.saveRecords(records);

        return record;
    },

    /**
     * Get records for today
     * @returns {Array} Array of today's records
     */
    getTodayRecords() {
        const today = this.formatDate(new Date());
        const allRecords = this.getAllRecords();
        return allRecords.filter(record => record.date === today);
    },

    /**
     * Get total water intake for today
     * @returns {Object} Object with glasses count and ml amount
     */
    getTodayTotal() {
        const todayRecords = this.getTodayRecords();
        const totalMl = todayRecords.reduce((sum, record) => sum + record.amount, 0);
        const glasses = todayRecords.length;

        return {
            glasses: glasses,
            ml: totalMl
        };
    },

    /**
     * Format date as YYYY-MM-DD
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    /**
     * Format time as HH:MM:SS
     * @param {Date} date - Date object to format
     * @returns {string} Formatted time string
     */
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    /**
     * Delete old records (optional cleanup function)
     * @param {number} daysToKeep - Number of days of records to keep
     */
    cleanupOldRecords(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const cutoffTimestamp = cutoffDate.getTime();

        const allRecords = this.getAllRecords();
        const recentRecords = allRecords.filter(record => record.timestamp >= cutoffTimestamp);

        if (recentRecords.length < allRecords.length) {
            this.saveRecords(recentRecords);
            console.log(`Cleaned up ${allRecords.length - recentRecords.length} old records`);
        }
    }
};
