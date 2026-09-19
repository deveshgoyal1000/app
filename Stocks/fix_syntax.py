file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the dangling </View> inside MainApp that should be </SafeAreaView>
content = content.replace(
    "</NavigationContainer>\n    </View>",
    "</NavigationContainer>\n    </SafeAreaView>"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed local App.tsx syntax error")
