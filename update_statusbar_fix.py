import pathlib, re
file_path = "App.tsx"
content = pathlib.Path(file_path).read_text(encoding='utf-8')

# 1. Ensure we have both imports (already present but we'll tidy)
# Already have: import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
# Keep native import: import { StatusBar } from 'react-native';

# 2. Remove SafeAreaInsetsBlock definition and any usage
# Remove function definition
content = re.sub(r"function SafeAreaInsetsBlock\(\) \{[\s\S]*?\}\n", "", content)
# Remove all <SafeAreaInsetsBlock /> occurrences
content = content.replace('<SafeAreaInsetsBlock />', '')

# 3. Replace native StatusBar JSX with proper ExpoStatusBar + native StatusBar (optional)
# Replace occurrences inside MainApp and splash with combined lines
content = re.sub(r"<StatusBar style=\\\"dark\\\" backgroundColor=\\\"#ffffff\\\" \/>",
    "<ExpoStatusBar style='dark' backgroundColor='#ffffff' />\n      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' translucent={false} />",
    content)
# Also replace any other similar lines (there are two occurrences)
# Already handled globally.

# 4. Clean up any leftover blank lines from removing SafeAreaInsetsBlock
content = re.sub(r"\n\s*\n", "\n", content)

pathlib.Path(file_path).write_text(content, encoding='utf-8')
print('Updated App.tsx: removed SafeAreaInsetsBlock, added ExpoStatusBar with dark icons, cleaned up')
