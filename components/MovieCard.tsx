import { icons } from "@/constants/icons";
import { MovieCardProps } from "@/interfaces/interfaces";
import {
  formatRating,
  getImageUrl,
  getMovieAccessibilityLabel,
  getYearFromDate,
} from "@/utils/movieUtils";
import { Link } from "expo-router";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = memo(
  ({ id, title, poster_path, vote_average, release_date }: MovieCardProps) => {
    const imageSource = getImageUrl(poster_path, "w500");
    const year = getYearFromDate(release_date);
    const rating = formatRating(vote_average);

    const accessibilityLabel = getMovieAccessibilityLabel({
      id,
      title,
      poster_path,
      vote_average,
      release_date,
      adult: false,
      backdrop_path: null,
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
          className="w-[30%] m-1 mb-4"
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityHint={`Tap to view details about ${title}`}
        >
          <Image
            source={{ uri: imageSource }}
            className="w-full h-52 rounded-lg mb-1"
            resizeMode="cover"
            accessible={true}
            accessibilityLabel={`Movie poster for ${title}`}
          />

          <Text className="text-white text-sm font-bold" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-gray-400 text-xs">{year}</Text>
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-yellow-400 text-xs font-bold">{rating}</Text>
            <Text className="text-gray-400 text-xs font-bold">/ 5</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }
);

// Set display name for debugging
MovieCard.displayName = "MovieCard";

export default MovieCard;
