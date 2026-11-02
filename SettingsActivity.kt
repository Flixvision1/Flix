package com.cinepulse.app

import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        val btnBack: ImageView = findViewById(R.id.btnSettingsBack)
        val txtVersion: TextView = findViewById(R.id.txtAppVersion)

        txtVersion.text = "Version 1.0.0 (CinePulse Pro)"

        NavigationHelper.setupBottomNav(this)

        btnBack.setOnClickListener {
            finish()
        }
    }
}