# RUthirsty - Water Tracking App

A Cordova mobile application for tracking daily water intake and building healthy hydration habits.

## Features

- **Simple Check-in**: Tap a button to log a glass of water (250ml)
- **Daily Counter**: View your total water intake in glasses and milliliters
- **Records List**: See all your water intake records for today with timestamps
- **Persistent Storage**: All data is saved locally using HTML5 localStorage
- **Offline-First**: No internet connection required
- **Mobile-Optimized**: Touch-friendly interface with responsive design

## Project Structure

```
ruthirsty/
├── www/
│   ├── index.html              # Main HTML structure
│   ├── css/
│   │   └── style.css           # App styling
│   └── js/
│       ├── app.js              # App initialization
│       ├── dataManager.js      # Data layer (localStorage)
│       └── uiController.js     # UI layer (DOM manipulation)
├── config.xml                  # Cordova configuration
└── platforms/
    └── android/                # Android platform files
```

## Getting Started

### Prerequisites

- Node.js and npm
- Cordova CLI: `npm install -g cordova`
- For Android builds:
  - Android SDK
  - Java JDK
  - Gradle

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd ruthirsty
   ```

### Testing in Browser

The app can be tested in a web browser for development:

```bash
cd www
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

**Note**: The Cordova deviceready event won't fire in browser mode, but the app will still work as it falls back to immediate initialization.

### Building for Android

1. Ensure Android SDK is installed and ANDROID_HOME is set
2. Build the APK:
   ```bash
   cordova build android
   ```
3. Run on emulator:
   ```bash
   cordova emulate android
   ```
4. Run on device:
   ```bash
   cordova run android --device
   ```

## How It Works

### Data Model

Each water intake record contains:
- `id`: Unique identifier (timestamp + random string)
- `timestamp`: Unix timestamp in milliseconds
- `date`: Date string (YYYY-MM-DD)
- `time`: Time string (HH:MM:SS)
- `amount`: Water amount in ml (default: 250ml)

### Storage

All records are stored in localStorage under the key `waterIntakeRecords` as a JSON array. The app automatically:
- Filters records to show only today's entries
- Calculates daily totals
- Cleans up records older than 30 days on startup

### Architecture

The app follows a modular architecture:

1. **DataManager** (`dataManager.js`):
   - Handles all localStorage operations
   - Provides CRUD functions for records
   - Calculates statistics (daily totals)

2. **UIController** (`uiController.js`):
   - Manages DOM manipulation
   - Handles user interactions
   - Updates display elements

3. **App** (`app.js`):
   - Initializes the application
   - Handles Cordova deviceready event
   - Coordinates between modules

## Configuration

### App Settings

Edit `config.xml` to customize:
- App ID: `com.ruthirsty.watertracker`
- App name: `RUthirsty`
- Version number
- Android SDK versions
- Orientation (currently locked to portrait)

### Water Amount

To change the amount per glass, edit `dataManager.js`:
```javascript
AMOUNT_PER_GLASS: 250, // Change this value (in ml)
```

## Testing

### Manual Test Cases

1. **Check-in functionality**:
   - Tap "Drink Water" button
   - Verify new record appears with current time
   - Verify counter increments

2. **Data persistence**:
   - Add several records
   - Close and reopen the app
   - Verify all records are still present

3. **Daily reset**:
   - Add records
   - Change device date to next day
   - Verify counter shows 0 for new day

4. **Multiple rapid taps**:
   - Tap button multiple times quickly
   - Verify each tap creates a separate record

## Browser Compatibility

The app uses standard web technologies:
- HTML5 localStorage
- ES6 JavaScript
- CSS3 with Flexbox
- No external dependencies

Tested in:
- Chrome/Chromium WebView (Android)
- Modern desktop browsers (for development)

## Known Limitations

- Android SDK setup required for building APK
- localStorage has 5-10MB limit (sufficient for thousands of records)
- No cloud sync or backup functionality
- No user accounts or multi-device support

## Future Enhancements

Potential features to add:
- Customizable water amount per check-in
- Daily goal setting and progress tracking
- Weekly/monthly statistics
- Reminders and notifications
- Dark mode support
- Export data functionality

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please refer to the Cordova documentation:
- https://cordova.apache.org/docs/en/latest/