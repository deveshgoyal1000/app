import pathlib, re
file_path = "App.tsx"
content = pathlib.Path(file_path).read_text(encoding='utf-8')
# ensure both imports exist
if "import { StatusBar as ExpoStatusBar }" not in content:
    content = content.replace("import { StatusBar } from 'react-native';", "import { StatusBar as ExpoStatusBar } from 'expo-status-bar';\nimport { StatusBar } from 'react-native';")
# replace StatusBar JSX with both components
content = re.sub(r"<StatusBar style=\\\"dark\\\" backgroundColor=\\\"#ffffff\\\" \/>", "<ExpoStatusBar style='dark' backgroundColor='#ffffff' />\n      <StatusBar barStyle='dark-content' backgroundColor='#ffffff' translucent={false} />", content)
# also replace any other similar line (splash)
content = re.sub(r"<StatusBar style=\\\"dark\\\" backgroundColor=\\\"#ffffff\\\" \/>", "<ExpoStatusBar style='dark' backgroundColor='#ffffff' />\n          <StatusBar barStyle='dark-content' backgroundColor='#ffffff' translucent={false} />", content)
# write back
pathlib.Path(file_path).write_text(content, encoding='utf-8')
print('Added ExpoStatusBar and fixed barStyle')
