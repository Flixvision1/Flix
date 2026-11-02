package com.cinepulse.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SavedMoviesActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var movieAdapter: MovieAdapter
    private val savedList = mutableListOf<MovieModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_saved)

        recyclerView = findViewById(R.id.savedRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        movieAdapter = MovieAdapter(savedList)
        recyclerView.adapter = movieAdapter

        NavigationHelper.setupBottomNav(this)
        loadSavedMovies()
    }

    private fun loadSavedMovies() {
        savedList.clear()
        movieAdapter.notifyDataSetChanged()
    }
}