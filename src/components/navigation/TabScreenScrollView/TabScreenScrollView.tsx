import { tabBarScrollContentPaddingBottom } from "@/constants/tabBarLayout";
import React, { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = Omit<ScrollViewProps, "contentContainerStyle"> & {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function TabScreenScrollView({ children, contentContainerStyle, ...rest }: Props) {
  const insets = useSafeAreaInsets();
  const paddingBottom = tabBarScrollContentPaddingBottom(insets.bottom);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle, { paddingBottom }]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
