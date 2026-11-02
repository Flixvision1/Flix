package com.cinepulse.app

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URL

class SearchActivity : AppCompatActivity() {

    private lateinit var searchInput: EditText
    private lateinit var searchRecyclerView: RecyclerView
    private lateinit var movieAdapter: MovieAdapter
    private val searchList = mutableListOf<MovieModel>()
    private val apiKey = "cd193c4897ae4e519cca3734ef116a7e"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search)

        searchInput = findViewById(R.id.searchInput)
        searchRecyclerView = findViewById(R.id.searchRecyclerView)
        searchRecyclerView.layoutManager = GridLayoutManager(this, 2)

        movieAdapter = MovieAdapter(searchList)
        searchRecyclerView.adapter = movieAdapter

        NavigationHelper.setupBottomNav(this)

        searchInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val query = s.toString().trim()
                if (query.isNotEmpty()) {
                    searchMovies(query)
                } else {
                    searchList.clear()
                    movieAdapter.notifyDataSetChanged()
                }
            }

            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun searchMovies(query: String) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val url = URL("https://api.themoviedb.org/3/search/movie?api_key=$apiKey&query=$query")
                val response = url.readText()
                val jsonObject = JSONObject(response)
                val results = jsonObject.getJSONArray("results")

                searchList.clear()
                for (i in 0 until results.length()) {
                    val item = results.getJSONObject(i)
                    val id = item.getInt("id")
                    val title = item.getString("title")
                    val posterPath = item.optString("poster_path", "")
                    val rating = item.getDouble("vote_average")
                    val overview = item.getString("overview")

                    searchList.add(MovieModel(id, title, posterPath, rating, overview))
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