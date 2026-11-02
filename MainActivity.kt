package com.cinepulse.app

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL

class MainActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var movieAdapter: MovieAdapter
    private val movieList = mutableListOf<MovieModel>()
    private val apiKey = "cd193c4897ae4e519cca3734ef116a7e"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        recyclerView = findViewById(R.id.moviesRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)
        
        movieAdapter = MovieAdapter(movieList)
        recyclerView.adapter = movieAdapter

        NavigationHelper.setupBottomNav(this)

        val btnSearch = findViewById<ImageView>(R.id.btnSearch)
        btnSearch.setOnClickListener {
            val intent = Intent(this, SearchActivity::class.java)
            startActivity(intent)
        }

        fetchTrendingMovies()
    }

    private fun fetchTrendingMovies() {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val url = URL("https://api.themoviedb.org/3/trending/movie/day?api_key=$apiKey")
                val response = url.readText()
                val jsonObject = JSONObject(response)
                val results = jsonObject.getJSONArray("results")

                movieList.clear()
                for (i in 0 until results.length()) {
                    val item = results.getJSONObject(i)
                    val id = item.getInt("id")
                    val title = item.getString("title")
                    val posterPath = item.getString("poster_path")
                    val rating = item.getDouble("vote_average")
                    val overview = item.getString("overview")

                    movieList.add(MovieModel(id, title, posterPath, rating, overview))
                }

                withContext(Dispatchers.Main) {
                    movieAdapter.notifyDataSetChanged()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}