package com.upstoxapp.clone

import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class WindowInsetsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var hasListener = false

    override fun getName(): String {
        return "NativeWindowInsets"
    }

    @ReactMethod
    fun startListening() {
        if (hasListener) return
        val activity = currentActivity ?: return
        
        activity.runOnUiThread {
            val rootView = activity.window.decorView.rootView
            ViewCompat.setOnApplyWindowInsetsListener(rootView) { _, windowInsets ->
                val density = activity.resources.displayMetrics.density

                val systemBars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars())
                val tappableElement = windowInsets.getInsets(WindowInsetsCompat.Type.tappableElement())
                val systemGestures = windowInsets.getInsets(WindowInsetsCompat.Type.systemGestures())
                val ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime())
                val displayCutout = windowInsets.getInsets(WindowInsetsCompat.Type.displayCutout())

                val map = Arguments.createMap()
                
                val systemBarsMap = Arguments.createMap()
                systemBarsMap.putDouble("top", (systemBars.top / density).toDouble())
                systemBarsMap.putDouble("bottom", (systemBars.bottom / density).toDouble())
                systemBarsMap.putDouble("left", (systemBars.left / density).toDouble())
                systemBarsMap.putDouble("right", (systemBars.right / density).toDouble())
                map.putMap("systemBars", systemBarsMap)

                val tappableMap = Arguments.createMap()
                tappableMap.putDouble("top", (tappableElement.top / density).toDouble())
                tappableMap.putDouble("bottom", (tappableElement.bottom / density).toDouble())
                tappableMap.putDouble("left", (tappableElement.left / density).toDouble())
                tappableMap.putDouble("right", (tappableElement.right / density).toDouble())
                map.putMap("tappableElement", tappableMap)

                val gesturesMap = Arguments.createMap()
                gesturesMap.putDouble("top", (systemGestures.top / density).toDouble())
                gesturesMap.putDouble("bottom", (systemGestures.bottom / density).toDouble())
                gesturesMap.putDouble("left", (systemGestures.left / density).toDouble())
                gesturesMap.putDouble("right", (systemGestures.right / density).toDouble())
                map.putMap("systemGestures", gesturesMap)

                val imeMap = Arguments.createMap()
                imeMap.putDouble("top", (ime.top / density).toDouble())
                imeMap.putDouble("bottom", (ime.bottom / density).toDouble())
                imeMap.putDouble("left", (ime.left / density).toDouble())
                imeMap.putDouble("right", (ime.right / density).toDouble())
                map.putMap("ime", imeMap)

                val cutoutMap = Arguments.createMap()
                cutoutMap.putDouble("top", (displayCutout.top / density).toDouble())
                cutoutMap.putDouble("bottom", (displayCutout.bottom / density).toDouble())
                cutoutMap.putDouble("left", (displayCutout.left / density).toDouble())
                cutoutMap.putDouble("right", (displayCutout.right / density).toDouble())
                map.putMap("displayCutout", cutoutMap)

                reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onWindowInsetsChanged", map)

                windowInsets
            }
            ViewCompat.requestApplyInsets(rootView)
        }
        hasListener = true
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in Event Emitter Calls
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in Event Emitter Calls
    }
}
