import re, pathlib

file_path = "App.tsx"
content = pathlib.Path(file_path).read_text(encoding='utf-8')

# Replace import from expo-status-bar with react-native
content = re.sub(r"import \{ StatusBar \} from 'expo-status-bar';", "import { StatusBar } from 'react-native';", content)

# Replace all StatusBar JSX that uses style prop (expo) with barStyle and backgroundColor, translucent false
content = re.sub(r"<StatusBar style=\"dark\" backgroundColor=\\\"#ffffff\\\" />(?=\s*)", "<StatusBar barStyle=\"dark-content\" backgroundColor=\"#ffffff\" translucent={false} />", content)

# Remove any @ts-ignore comments directly above StatusBar lines (optional)
content = re.sub(r"\{\/\* @ts-ignore \*\/\}\s*", "", content)

pathlib.Path(file_path).write_text(content, encoding='utf-8')
print('Replaced expo-status-bar with native StatusBar and set explicit white background')
