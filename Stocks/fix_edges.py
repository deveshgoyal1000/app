file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("<SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>", "<SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#ffffff' }}>")
content = content.replace("<SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>", "<SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Added safe area edges back")
