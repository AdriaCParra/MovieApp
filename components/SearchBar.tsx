import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  placeHolder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export const SearchBar = ({
  onPress,
  placeHolder,
  value,
  onChangeText,
  editable = true,
}: Props) => {
  return (
    <View className="flex-row items-center bg-primary rounded-full mb-4 px-5 mt-20 py-4 mx-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      ></Image>
      <TextInput
        onPress={onPress}
        onChangeText={onChangeText}
        placeholder={placeHolder}
        value={value}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
        editable={editable}
      />
    </View>
  );
};
