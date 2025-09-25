Medi_Query 🩺🔍












MediQuery is a smart medical enquiry app built with React Native, available for Android and iOS.
It helps users explore medicines in detail, compare alternatives, find nearby medical stores, and manage their medicine schedules with timely reminders.

🚀 Features
🏠 Home

Search and discover medicines with ease.

Get detailed information: composition, company name, substitutes, price, and popularity.

When a medicine is searched, similar medicines and their prices also appear — helping users find affordable alternatives or substitutes if a medicine is unavailable.

🗺️ Maps

View nearby medical stores using real-time location.

Integrated with location services to help users navigate and find pharmacies quickly.

⏰ Reminder

Schedule and manage medicine intake reminders.

Set daily/weekly reminders with push notifications.

Never miss a dose with customizable alerts powered by Expo Notifications and Firebase-based notifications.

👤 Profile

Manage personal details and preferences.

Track BMR, BMI, and health metrics to indicate proper doses.

View past reminders and medicine history.

📱 Platforms

Android

iOS

Built using React Native, ensuring a seamless cross-platform experience.

🛠️ Tech Stack

Frontend: React Native (Expo / CLI)

Backend (Optional): Node.js / Express.js + MongoDB

Dataset: Extensive_A_Z_medicines_dataset_of_India 

Notifications: Expo inbuilt notifications & Firebase Cloud Messaging

Maps: Google Maps API / Mapbox

📸 App Structure
/MediQuery
  ├── /src
  │    ├── /screens
  │    │     ├── HomeScreen.js
  │    │     ├── MapsScreen.js
  │    │     ├── ReminderScreen.js
  │    │     └── ProfileScreen.js
  │    ├── /components
  │    ├── /navigation
  │    └── /utils
  ├── App.js
  ├── package.json
  └── README.md

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/MediQuery.git
cd MediQuery


Install dependencies

npm install
# or
yarn install


Run on Android

npx react-native run-android


Run on iOS (Mac + Xcode required)

npx pod-install ios
npx react-native run-ios


Start Metro Bundler

npx react-native start


🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue
 or submit a PR.

📄 License

This project is licensed under the MIT License.

✨ Do you also want me to include demo placeholders (like ![Home Screen]
