import re

file_path = "App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Ultimate brute force deterministic status bar

# Fix MainApp
old_main = """  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />"""
new_main = """  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
      {/* Explicitly draw a solid white block exactly the height of the phone's hardware notch */}
      <View style={{ height: insets.top, backgroundColor: '#ffffff', width: '100%', zIndex: 99999 }} />"""
content = content.replace(old_main, new_main)

content = content.replace("</SafeAreaView>", "</View>")

# Fix Splash
old_splash = """      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
          <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
          <CustomSplashScreen onFinish={() => setShowSplash(false)} />
        </SafeAreaView>
      </SafeAreaProvider>"""
new_splash = """      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
          {/* Explicitly draw a solid white block exactly the height of the phone's hardware notch */}
          <SafeAreaInsetsBlock />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CustomSplashScreen onFinish={() => setShowSplash(false)} />
          </View>
        </View>
      </SafeAreaProvider>"""
content = content.replace(old_splash, new_splash)

# Add SafeAreaInsetsBlock component helper just above CustomSplashScreen
block_code = """
function SafeAreaInsetsBlock() {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.top, backgroundColor: '#ffffff', width: '100%', zIndex: 99999 }} />;
}

function CustomSplashScreen"""
content = content.replace("function CustomSplashScreen", block_code)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Applied deterministic explicit View status bar block")
