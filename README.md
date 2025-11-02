# HyperHold 📚

A simple and elegant link manager for your favorite websites. Built with React Native and Expo, HyperHold helps you organize and access your bookmarks with a beautiful, iOS-style interface.

## ✨ Features

### 🏠 Home Screen
- **Scrollable Link List**: View all your saved links in a clean, organized list
- **Search Functionality**: Filter links by title, domain, or description
- **Link Cards**: Each link displays favicon, title, domain, and description
- **Quick Actions**: Tap to open links or access edit/delete options
- **Floating Action Button**: Easy access to add new links

### ➕ Add Link Screen
- **Smart URL Input**: Auto-validates URLs and extracts domain information
- **Auto-fill Title**: Automatically suggests titles from domain names
- **Category Selection**: Organize links with predefined categories
- **Optional Description**: Add context to your bookmarks
- **Edit Mode**: Modify existing links with the same interface

### 📁 Categories Screen
- **Predefined Categories**: All, Development, News, Tutorials, Design
- **Link Counts**: See how many links are in each category
- **Quick Filtering**: Tap categories to filter your link collection
- **Visual Indicators**: Color-coded categories for easy identification

### ⚙️ Settings Screen
- **Dark Mode Support**: System, Light, or Dark theme options
- **App Lock**: Optional authentication for app access
- **Biometric Authentication**: Use fingerprint or Face ID (when available)
- **Clean Interface**: iOS-style settings with clear sections

## 🛠 Technical Features

- **Offline-First**: All data stored locally using SQLite
- **Cross-Platform**: Works on iOS and Android
- **Modern UI**: Clean, iOS-inspired design with smooth animations
- **JavaScript**: Built with modern JavaScript and React Hooks
- **Context API**: Efficient state management with React Context
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Built with accessibility best practices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hyperhold.git
   cd hyperhold
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your physical device

### Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Build for production
expo build:ios
expo build:android
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LinkCard.js     # Individual link display component
│   ├── SearchBar.js    # Search input component
│   └── FloatingActionButton.js
├── screens/            # Main app screens
│   ├── HomeScreen.js   # Main links list
│   ├── AddLinkScreen.js # Add/edit links
│   ├── CategoriesScreen.js # Category management
│   └── SettingsScreen.js # App settings
├── navigation/         # Navigation configuration
│   └── AppNavigator.js
├── contexts/           # React Context providers
│   └── AppContext.js   # Main app state management
└── utils/              # Utility functions
    ├── database.js     # SQLite database operations
    ├── helpers.js      # Helper functions
    └── theme.js        # Theme and styling utilities
```

## 🎨 Design System

HyperHold uses a consistent design system with:

- **Colors**: iOS-style color palette with light/dark mode support
- **Typography**: System fonts with consistent sizing and weights
- **Spacing**: 8px grid system for consistent layouts
- **Shadows**: Subtle shadows for depth and hierarchy
- **Border Radius**: Consistent corner radius throughout the app

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configuration:

```env
# Add any environment variables here
```

### Database

The app uses SQLite for local storage. The database is automatically initialized when the app starts and includes:

- **Links Table**: Stores URL, title, description, domain, favicon, category, and timestamps
- **Categories Table**: Stores category information with colors and default status
- **Settings Table**: Stores app preferences and configuration

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
Fork the project to your GitHub account.

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes
- Follow the existing code style and conventions
- Include proper error handling
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git commit -m 'Add amazing feature'
```

### 5. Push to Your Branch
```bash
git push origin feature/amazing-feature
```

### 6. Create a Pull Request
Submit a pull request with a clear description of your changes.

### Development Guidelines

- **Code Style**: Follow the existing JavaScript and React Native patterns
- **Testing**: Test on both iOS and Android before submitting
- **Documentation**: Update README.md for new features
- **Performance**: Ensure smooth performance on older devices
- **Accessibility**: Maintain accessibility standards

## 📱 Supported Platforms

- **iOS**: 13.0 and later
- **Android**: API level 21 (Android 5.0) and later
- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally on your device
- **No Cloud Sync**: Your links remain private and secure
- **Optional Authentication**: App lock and biometric authentication available
- **No Analytics**: No tracking or data collection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo**: For the amazing development platform
- **React Navigation**: For the navigation solution
- **Expo Vector Icons**: For the beautiful icon set
- **React Native Community**: For the excellent ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/hyperhold/issues) page
2. Create a new issue with detailed information
3. Include device information and steps to reproduce

## 🚀 Roadmap

- [ ] Cloud sync support
- [ ] Link sharing functionality
- [ ] Import/export bookmarks
- [ ] Custom categories
- [ ] Link tags and advanced filtering
- [ ] Widget support
- [ ] Siri shortcuts integration
- [ ] Browser extension companion

---

Made with ❤️ by the HyperHold team 