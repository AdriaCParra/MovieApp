import { RenderEmpty, RenderError, RenderLoading } from "@/components/common";
import MovieCard from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import TopMovieCard from "@/components/TopMovieCard";
import { images } from "@/constants/images";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import { Movie } from "@/interfaces/interfaces";
import {
  getMovieCardDimensions,
  getTopMovieItemLayout,
} from "@/utils/movieUtils";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Image, Text, View } from "react-native";

const TopMoviesList = React.memo(({ movies }: { movies: Movie[] }) => {
  const topMovies = useMemo(() => movies.slice(0, 5), [movies]);
  const { getItemLayout } = getTopMovieItemLayout();

  const renderTopMovie = ({ item, index }: { item: Movie; index: number }) => (
    <TopMovieCard {...item} index={index} />
  );

  return (
    <>
      <Text
        className="text-gray-200 text-lg font-bold mb-4 px-5"
        accessibilityRole="header"
        accessibilityLabel="Top 5 Movies"
      >
        Top 5 trending Movies
      </Text>
      <View className="mb-6 h-[60vh]">
        <FlatList
          data={topMovies}
          renderItem={renderTopMovie}
          keyExtractor={(item) => `top-${item.id}`}
          getItemLayout={getItemLayout}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToAlignment="center"
          pagingEnabled
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={3}
          windowSize={5}
        />
      </View>
    </>
  );
});

TopMoviesList.displayName = "TopMoviesList";

export default function Index() {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetchMovies("", 1, true);

  const gridMovies = useMemo(() => {
    if (!movies) return [];
    return movies.slice(5);
  }, [movies]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard {...item} />
  );

  // List header component
  const renderHeader = () => (
    <View>
      <SearchBar
        placeHolder="Search for a movie!"
        onPress={() => {
          router.push("/search");
        }}
        editable={false}
      />
      {movies && movies.length > 0 && <TopMoviesList movies={movies} />}
      <View className="px-4 mb-4">
        <Text
          className="text-gray-200 text-lg font-bold"
          accessibilityRole="header"
          accessibilityLabel="Top Movies"
        >
          These movies are popular right now
        </Text>
      </View>
    </View>
  );

  const getItemLayout = (data: any, index: number) => {
    const { height } = getMovieCardDimensions();
    return {
      length: height,
      offset: height * Math.floor(index / 3),
      index,
    };
  };

  return (
    <View className="flex-1 bg-gray-950">
      <Image
        source={images.bg}
        className="flex-1 z-0 w-full absolute"
        resizeMode="cover"
      />
      {moviesLoading ? (
        <RenderLoading />
      ) : moviesError ? (
        <RenderError moviesError={moviesError} />
      ) : (
        <FlatList
          data={gridMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => `grid-${item.id}`}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<RenderEmpty />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "flex-start",
            paddingBottom: 100,
          }}
          columnWrapperStyle={{
            gap: 6,
            justifyContent: "flex-start",
            paddingHorizontal: 16,
          }}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={12}
          windowSize={10}
        />
      )}
    </View>
  );
}
