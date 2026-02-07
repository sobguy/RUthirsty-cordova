/**
 * UI Controller - Handles all DOM manipulation and user interactions
 */

const UIController = {
    elements: {
        glassCount: null,
        mlCount: null,
        checkInBtn: null,
        recordsList: null
    },

    /**
     * Initialize UI elements
     */
    init() {
        this.elements.glassCount = document.getElementById('glassCount');
        this.elements.mlCount = document.getElementById('mlCount');
        this.elements.checkInBtn = document.getElementById('checkInBtn');
        this.elements.recordsList = document.getElementById('recordsList');

        this.setupEventListeners();
        this.updateDisplay();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.elements.checkInBtn.addEventListener('click', () => {
            this.handleCheckIn();
        });
    },

    /**
     * Handle check-in button click
     */
    handleCheckIn() {
        // Add visual feedback
        this.elements.checkInBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.checkInBtn.style.transform = 'scale(1)';
        }, 150);

        // Add new record
        const newRecord = DataManager.addRecord();

        // Update display
        this.updateDisplay();

        // Show success feedback
        this.showSuccessFeedback();
    },

    /**
     * Update the entire display (counter and records list)
     */
    updateDisplay() {
        this.updateCounter();
        this.renderRecords();
    },

    /**
     * Update the counter display
     */
    updateCounter() {
        const total = DataManager.getTodayTotal();
        this.elements.glassCount.textContent = total.glasses;
        this.elements.mlCount.textContent = total.ml;
    },

    /**
     * Render the records list
     */
    renderRecords() {
        const records = DataManager.getTodayRecords();

        if (records.length === 0) {
            this.elements.recordsList.innerHTML =
                '<p class="empty-message">No water logged yet today. Tap the button above to start!</p>';
            return;
        }

        // Sort records by timestamp (newest first)
        records.sort((a, b) => b.timestamp - a.timestamp);

        // Build HTML for records
        const recordsHTML = records.map(record => this.createRecordHTML(record)).join('');
        this.elements.recordsList.innerHTML = recordsHTML;
    },

    /**
     * Create HTML for a single record
     * @param {Object} record - The record object
     * @returns {string} HTML string for the record
     */
    createRecordHTML(record) {
        // Format time to HH:MM for display
        const timeDisplay = record.time.substring(0, 5);

        return `
            <div class="record-item">
                <div class="record-time">${timeDisplay}</div>
                <div class="record-amount">${record.amount}ml</div>
            </div>
        `;
    },

    /**
     * Show success feedback animation
     */
    showSuccessFeedback() {
        const originalText = this.elements.checkInBtn.textContent;
        this.elements.checkInBtn.textContent = '✓ Added!';
        this.elements.checkInBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';

        setTimeout(() => {
            this.elements.checkInBtn.textContent = originalText;
            this.elements.checkInBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 1000);
    }
};
