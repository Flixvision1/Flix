package com.cinepulse.app

data class MovieModel(
    val id: Int,
    val title: String,
    val posterPath: String,
    val rating: Double,
    val overview: String
)