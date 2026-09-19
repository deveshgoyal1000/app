file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('<StatusBar style="dark" backgroundColor="transparent" />', '<StatusBar style="dark" backgroundColor="#ffffff" />')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
