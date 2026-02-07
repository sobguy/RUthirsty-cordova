/**
 * UI Controller - Handles all DOM manipulation and user interactions
 */

const UIController = {
    elements: {
        glassCount: null,
        mlCount: null,
        checkInBtn: null,
        recordsList: null,
        settingsBtn: null,
        settingsPanel: null,
        closeSettingsBtn: null,
        amountInput: null,
        decreaseBtn: null,
        increaseBtn: null,
        saveSettingsBtn: null
    },

    /**
     * Initialize UI elements
     */
    init() {
        this.elements.glassCount = document.getElementById('glassCount');
        this.elements.mlCount = document.getElementById('mlCount');
        this.elements.checkInBtn = document.getElementById('checkInBtn');
        this.elements.recordsList = document.getElementById('recordsList');
        this.elements.settingsBtn = document.getElementById('settingsBtn');
        this.elements.settingsPanel = document.getElementById('settingsPanel');
        this.elements.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.elements.amountInput = document.getElementById('amountInput');
        this.elements.decreaseBtn = document.getElementById('decreaseBtn');
        this.elements.increaseBtn = document.getElementById('increaseBtn');
        this.elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');

        this.setupEventListeners();
        this.updateDisplay();
        this.loadSettings();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.elements.checkInBtn.addEventListener('click', () => {
            this.handleCheckIn();
        });

        // Settings panel event listeners
        this.elements.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });

        this.elements.closeSettingsBtn.addEventListener('click', () => {
            this.closeSettings();
        });

        this.elements.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsPanel) {
                this.closeSettings();
            }
        });

        this.elements.decreaseBtn.addEventListener('click', () => {
            this.changeAmount(-50);
        });

        this.elements.increaseBtn.addEventListener('click', () => {
            this.changeAmount(50);
        });

        this.elements.saveSettingsBtn.addEventListener('click', () => {
            this.saveSettings();
        });

        // Allow Enter key to save settings
        this.elements.amountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveSettings();
            }
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

        // Add updating animation class
        this.elements.glassCount.classList.add('updating');
        this.elements.mlCount.classList.add('updating');

        // Update values
        this.elements.glassCount.textContent = total.glasses;
        this.elements.mlCount.textContent = total.ml;

        // Remove animation class after animation completes
        setTimeout(() => {
            this.elements.glassCount.classList.remove('updating');
            this.elements.mlCount.classList.remove('updating');
        }, 600);
    },

    /**
     * Render the records list
     */
    renderRecords() {
        const records = DataManager.getTodayRecords();

        if (records.length === 0) {
            this.elements.recordsList.innerHTML =
                '<p class="empty-message">今天还没有记录。<br>点击上方按钮开始记录吧！</p>';
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
            <div class="record-item" style="animation-delay: 0s;">
                <div class="record-time">${timeDisplay}</div>
                <div class="record-amount">${record.amount}ml</div>
            </div>
        `;
    },

    /**
     * Show success feedback animation
     */
    showSuccessFeedback() {
        const buttonIcon = this.elements.checkInBtn.querySelector('.button-icon');
        const buttonText = this.elements.checkInBtn.querySelector('.button-text');
        const originalText = buttonText.textContent;
        const originalIcon = buttonIcon.textContent;

        // Update button content
        buttonIcon.textContent = '✓';
        buttonText.textContent = '已记录！';
        this.elements.checkInBtn.classList.add('success');

        setTimeout(() => {
            buttonIcon.textContent = originalIcon;
            buttonText.textContent = originalText;
            this.elements.checkInBtn.classList.remove('success');
        }, 1200);
    },

    /**
     * Open settings panel
     */
    openSettings() {
        this.loadSettings();
        this.elements.settingsPanel.classList.add('active');
    },

    /**
     * Close settings panel
     */
    closeSettings() {
        this.elements.settingsPanel.classList.remove('active');
    },

    /**
     * Load settings from DataManager
     */
    loadSettings() {
        const amount = DataManager.getAmountPerGlass();
        this.elements.amountInput.value = amount;
    },

    /**
     * Change amount by delta
     * @param {number} delta - Amount to change (positive or negative)
     */
    changeAmount(delta) {
        let currentAmount = parseInt(this.elements.amountInput.value) || 250;
        let newAmount = currentAmount + delta;

        // Clamp between 50 and 1000
        newAmount = Math.max(50, Math.min(1000, newAmount));

        this.elements.amountInput.value = newAmount;

        // Add animation feedback
        this.elements.amountInput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.elements.amountInput.style.transform = 'scale(1)';
        }, 200);
    },

    /**
     * Save settings
     */
    saveSettings() {
        let amount = parseInt(this.elements.amountInput.value);

        // Validate amount
        if (isNaN(amount) || amount < 50 || amount > 1000) {
            alert('请输入有效的饮水量（50-1000毫升）');
            this.loadSettings();
            return;
        }

        // Round to nearest 50
        amount = Math.round(amount / 50) * 50;
        this.elements.amountInput.value = amount;

        // Save to DataManager
        DataManager.setAmountPerGlass(amount);

        // Show success feedback
        const saveBtn = this.elements.saveSettingsBtn;
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ 已保存！';
        saveBtn.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(20, 184, 166, 0.4) 100%)';

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
            this.closeSettings();
        }, 1000);
    }
};
