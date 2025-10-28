import { RenderEmpty, RenderError } from "@/components/common";
import { RenderLoading } from "@/components/common/RenderLoading";
import MovieCard from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { images } from "@/constants/images";
import { useFetchMovies } from "@/hooks/useFetchMovies";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset,
  } = useFetchMovies(searchQuery, 1, false);

  useEffect(() => {
    const timeOutID = setTimeout(async () => {
      if (searchQuery.length > 0) {
        await refetch();
      } else reset();
    }, 500);
    return () => clearTimeout(timeOutID);
  }, [searchQuery, refetch, reset]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderHeader = useCallback(() => {
    if (searchQuery.length > 0) {
      return (
        <Text className="text-white text-lg font-bold px-5 mb-2">
          Results for <Text className="text-purple-400"> {searchQuery}</Text>
        </Text>
      );
    }
    return null;
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-gray-950">
      <Image
        source={images.bg}
        className="flex-1 z-0 w-full absolute"
        resizeMode="cover"
      />
      <View className="z-10">
        <SearchBar
          placeHolder="Search for a movie!"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>
      {moviesLoading ? (
        <RenderLoading />
      ) : moviesError ? (
        <RenderError moviesError={moviesError} />
      ) : (
        <>
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => `search-${item.id}`}
            ListHeaderComponent={renderHeader}
            numColumns={3}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={RenderEmpty}
            contentContainerStyle={{ paddingBottom: 16 }}
            columnWrapperStyle={{
              gap: 6,
              justifyContent: "flex-start",
              paddingHorizontal: 16,
            }}
          />
        </>
      )}
    </View>
  );
};

export default search;

const styles = StyleSheet.create({});
