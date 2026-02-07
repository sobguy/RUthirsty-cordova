#!/bin/bash

# RUthirsty App - Quick Test Script
# This script helps verify the app is working correctly

echo "🧪 RUthirsty App - Testing Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -d "ruthirsty" ]; then
    echo "❌ Error: ruthirsty directory not found"
    echo "Please run this script from /workspaces/RUthirsty-cordova/"
    exit 1
fi

cd ruthirsty

echo "📋 Checking project structure..."
echo ""

# Check for required files
files=(
    "www/index.html"
    "www/css/style.css"
    "www/js/app.js"
    "www/js/dataManager.js"
    "www/js/uiController.js"
    "config.xml"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_files_exist=false
    fi
done

echo ""

if [ "$all_files_exist" = false ]; then
    echo "❌ Some files are missing. Please check the implementation."
    exit 1
fi

echo "✅ All required files present"
echo ""

# Check Cordova installation
echo "📋 Checking Cordova installation..."
if command -v cordova &> /dev/null; then
    cordova_version=$(cordova --version)
    echo "✅ Cordova installed: v$cordova_version"
else
    echo "❌ Cordova not installed"
    echo "   Install with: npm install -g cordova"
    exit 1
fi

echo ""

# Check platforms
echo "📋 Checking platforms..."
if [ -d "platforms/android" ]; then
    echo "✅ Android platform added"
else
    echo "⚠️  Android platform not found"
    echo "   Add with: cordova platform add android"
fi

echo ""

# Check Android SDK
echo "📋 Checking Android SDK..."
if [ -n "$ANDROID_HOME" ]; then
    echo "✅ ANDROID_HOME set: $ANDROID_HOME"
else
    echo "⚠️  ANDROID_HOME not set"
    echo "   Android builds will not work until SDK is configured"
fi

echo ""

# Offer to start browser test server
echo "=================================="
echo "🌐 Browser Testing"
echo "=================================="
echo ""
echo "Would you like to start the test server? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting HTTP server on port 8000..."
    echo "Open http://localhost:8000 in your browser"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd www
    python3 -m http.server 8000
else
    echo ""
    echo "To test manually, run:"
    echo "  cd ruthirsty/www"
    echo "  python3 -m http.server 8000"
    echo "  # Then open http://localhost:8000 in your browser"
fi

echo ""
echo "=================================="
echo "📱 Android Testing"
echo "=================================="
echo ""
echo "To build for Android:"
echo "  1. Set up Android SDK and ANDROID_HOME"
echo "  2. Run: cordova build android"
echo "  3. APK location: platforms/android/app/build/outputs/apk/debug/"
echo ""
echo "To run on device:"
echo "  cordova run android --device"
echo ""
echo "To run on emulator:"
echo "  cordova emulate android"
echo ""
