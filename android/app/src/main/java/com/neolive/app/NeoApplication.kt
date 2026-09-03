package com.neolive.app

import android.app.Application
import android.util.Log

class NeoApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.d("NEOLiveApp", "NEO Live Room Application initialized.")
    }
}
