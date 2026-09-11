import re

file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Revert StatusBar to solid white, NOT translucent
content = content.replace('<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />', '<StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />')

# 2. Remove SafeAreaView top edges constraint so it doesn't try to pad twice
content = content.replace("<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#ffffff' }}>", "<SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>")
content = content.replace("<SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>", "<SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Reverted to solid white native Status Bar")
