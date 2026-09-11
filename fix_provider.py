file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_splash = """  if (showSplash) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        <CustomSplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaView>
    );
  }"""

new_splash = """  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
          <CustomSplashScreen onFinish={() => setShowSplash(false)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }"""

content = content.replace(old_splash, new_splash)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed SafeAreaProvider around SplashScreen")
