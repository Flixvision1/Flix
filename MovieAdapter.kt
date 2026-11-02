package com.cinepulse.app

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide

class MovieAdapter(private val movieList: List<MovieModel>) :
    RecyclerView.Adapter<MovieAdapter.MovieViewHolder>() {

    class MovieViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val posterImageView: ImageView = itemView.findViewById(R.id.moviePoster)
        val titleTextView: TextView = itemView.findViewById(R.id.movieTitle)
        val ratingTextView: TextView = itemView.findViewById(R.id.movieRating)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MovieViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_movie, parent, false)
        return MovieViewHolder(view)
    }

    override fun onBindViewHolder(holder: MovieViewHolder, position: Int) {
        val movie = movieList[position]
        holder.titleTextView.text = movie.title
        holder.ratingTextView.text = "★ ${movie.rating}"

        val imageUrl = "https://image.tmdb.org/t/p/w500${movie.posterPath}"
        Glide.with(holder.itemView.context)
            .load(imageUrl)
            .into(holder.posterImageView)

        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, PlayerActivity::class.java).apply {
                putExtra("MOVIE_ID", movie.id)
                putExtra("MOVIE_TITLE", movie.title)
                putExtra("MOVIE_POSTER", movie.posterPath)
                putExtra("MOVIE_RATING", movie.rating)
                putExtra("MOVIE_OVERVIEW", movie.overview)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = movieList.size
}