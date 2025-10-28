import { TopMovieCardProps } from "@/interfaces/interfaces";
import {
  formatRating,
  getGenreNames,
  getImageUrl,
  getMovieAccessibilityLabel,
} from "@/utils/movieUtils";
import { Link } from "expo-router";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const TopMovieCard = memo(
  ({
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    backdrop_path,
    index,
    genre_ids,
  }: TopMovieCardProps) => {
    const imageSource = poster_path
      ? getImageUrl(poster_path, "w500")
      : backdrop_path
        ? getImageUrl(backdrop_path, "w780")
        : "https://via.placeholder.com/500x750?text=No+Image";

    const accessibilityLabel = getMovieAccessibilityLabel({
      id,
      title,
      poster_path,
      vote_average,
      release_date,
      backdrop_path,
      adult: false,
      genre_ids: [],
      original_language: "",
      original_title: "",
      overview: "",
      popularity: 0,
      video: false,
      vote_count: 0,
    });

    return (
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity
          className="h-full w-screen"
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityHint={`Tap to view details about ${title}`}
        >
          <View className="relative flex">
            <Image
              source={{ uri: imageSource }}
              className="h-full self-center"
              resizeMode="contain"
              style={{
                aspectRatio: 2 / 3,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgb(175, 153, 248, 0.4)",
              }}
              accessible={true}
              accessibilityLabel={`Movie poster for ${title}`}
            />
            {index !== undefined && (
              <View className="absolute top-2 left-2 bg-purple-600 rounded-full w-12 h-16 items-center justify-center">
                <Text className="text-white font-bold text-4xl">
                  {index + 1}
                </Text>
              </View>
            )}
            <View className="absolute top-2 right-9  bg-gray-800 rounded-full px-2 py-1">
              <Text className="text-white font-bold text-xs">
                {formatRating(vote_average)} ⭐
              </Text>
            </View>
            <View className="absolute bottom-4 self-center bg-gray-800 rounded-full px-2 py-1">
              <Text className="text-white font-bold text-xs">
                {getGenreNames(genre_ids).join(" · ") || "Unknown Genre"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }
);

// Set display name for debugging
TopMovieCard.displayName = "TopMovieCard";

export default TopMovieCard;
