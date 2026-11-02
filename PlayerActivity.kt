package com.cinepulse.app

import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide

class PlayerActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_player)

        val posterImage: ImageView = findViewById(R.id.playerPoster)
        val titleText: TextView = findViewById(R.id.playerTitle)
        val ratingText: TextView = findViewById(R.id.playerRating)
        val overviewText: TextView = findViewById(R.id.playerOverview)
        val btnBack: ImageView = findViewById(R.id.btnPlayerBack)

        val title = intent.getStringExtra("MOVIE_TITLE")
        val posterPath = intent.getStringExtra("MOVIE_POSTER")
        val rating = intent.getDoubleExtra("MOVIE_RATING", 0.0)
        val overview = intent.getStringExtra("MOVIE_OVERVIEW")

        titleText.text = title
        ratingText.text = "★ $rating"
        overviewText.text = overview

        val imageUrl = "https://image.tmdb.org/t/p/w500$posterPath"
        Glide.with(this)
            .load(imageUrl)
            .into(posterImage)

        btnBack.setOnClickListener {
            finish()
        }
    }
}