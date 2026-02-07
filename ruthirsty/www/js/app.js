/**
 * App - Main application initialization and Cordova integration
 */

const App = {
    /**
     * Initialize the application
     */
    initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        // For browser testing, initialize immediately if Cordova is not available
        if (typeof cordova === 'undefined') {
            console.log('Running in browser mode');
            this.onDeviceReady();
        }
    },

    /**
     * Called when Cordova device is ready
     */
    onDeviceReady() {
        console.log('Device ready - initializing app');

        // Initialize UI Controller
        UIController.init();

        // Optional: Clean up old records on startup (keep last 30 days)
        DataManager.cleanupOldRecords(30);

        console.log('App initialized successfully');
    }
};

// Start the application
App.initialize();
