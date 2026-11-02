package com.cinepulse.app

import android.app.Activity
import android.content.Intent
import android.widget.LinearLayout

object NavigationHelper {

    fun setupBottomNav(activity: Activity) {
        val navHome = activity.findViewById<LinearLayout>(R.id.navHome)
        val navSearch = activity.findViewById<LinearLayout>(R.id.navSearch)
        val navSaved = activity.findViewById<LinearLayout>(R.id.navSaved)
        val navSettings = activity.findViewById<LinearLayout>(R.id.navSettings)

        navHome?.setOnClickListener {
            if (activity !is MainActivity) {
                val intent = Intent(activity, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                activity.startActivity(intent)
                activity.overridePendingTransition(0, 0)
            }
        }

        navSearch?.setOnClickListener {
            if (activity !is SearchActivity) {
                val intent = Intent(activity, SearchActivity::class.java)
                activity.startActivity(intent)
                activity.overridePendingTransition(0, 0)
            }
        }

        navSaved?.setOnClickListener {
            if (activity !is SavedMoviesActivity) {
                val intent = Intent(activity, SavedMoviesActivity::class.java)
                activity.startActivity(intent)
                activity.overridePendingTransition(0, 0)
            }
        }

        navSettings?.setOnClickListener {
            if (activity !is SettingsActivity) {
                val intent = Intent(activity, SettingsActivity::class.java)
                activity.startActivity(intent)
                activity.overridePendingTransition(0, 0)
            }
        }
    }
}