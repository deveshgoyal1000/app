import re

file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove StatusBar from react-native import
content = content.replace("import { View, Animated, StyleSheet, StatusBar } from 'react-native';", "import { View, Animated, StyleSheet } from 'react-native';\nimport { StatusBar } from 'expo-status-bar';")

# Change all React Native StatusBar to Expo StatusBar syntax
content = content.replace('<StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />', '<StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />')
content = content.replace('<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />', '<StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Swapped to expo-status-bar")
