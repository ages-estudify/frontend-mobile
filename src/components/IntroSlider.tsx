import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Treine\nSempre",
    description: (
      <Text className="text-[18px] font-normal leading-[28px] tracking-[-0.43px] text-black">
        <Text className="font-bold">Pratique</Text> com questões,{" "}
        <Text className="font-bold">revise</Text>
        {"\n"}
        conteúdos e dê um passo de cada{"\n"}
        vez na sua preparação.
      </Text>
    ),
    bgColor: "bg-[#B49ED6]",
    image: require("../../assets/intro-1.png"),
  },
  {
    id: "2",
    title: "Estude\nDirecionado",
    description: (
      <Text className="text-[18px] font-normal leading-[28px] tracking-[-0.43px] text-black">
        Receba um cronograma gerado pelo{"\n"}
        app e <Text className="font-bold">organize sua rotina</Text> com mais
        {"\n"}
        foco e menos dúvida.
      </Text>
    ),
    bgColor: "bg-[#B7D7A9]",
    image: require("../../assets/intro-2.png"),
  },
  {
    id: "3",
    title: "Acompanhe\na Evolução",
    description: (
      <Text className="text-[18px] font-normal leading-[28px] tracking-[-0.43px] text-black">
        Faça simulados, <Text className="font-bold">veja seu</Text>
        {"\n"}
        <Text className="font-bold">desempenho e entenda como você</Text>
        {"\n"}
        <Text className="font-bold">está evoluindo</Text> ao longo dos{"\n"}
        estudos.
      </Text>
    ),
    bgColor: "bg-[#D2EFFD]",
    image: require("../../assets/intro-3.png"),
  },
];

interface IntroSliderProps {
  onFinish: () => void;
}

export default function IntroSlider({ onFinish }: IntroSliderProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    []
  );

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 50,
    }),
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const nextSlide = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex === 2) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
    } else if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  }, [currentIndex]);

  const renderItem: ListRenderItem<(typeof SLIDES)[0]> = useCallback(
    ({ item }) => (
      <View className={`flex-1 px-8 pt-24 ${item.bgColor}`} style={{ width }}>
        <View className="mb-10 flex-row justify-center">
          {SLIDES.map((_, dotIndex) => (
            <View
              key={dotIndex}
              className={`mx-[5px] h-[3px] w-[85px] rounded-full ${
                currentIndex === dotIndex ? "bg-black" : "bg-black/15"
              }`}
            />
          ))}
        </View>

        <Text
          className="mb-2 text-[50px] font-bold leading-[58px] text-black"
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.9}
        >
          {item.title}
        </Text>

        <View className="mb-4 flex-1 items-center justify-center">
          <Image source={item.image} className="h-full w-full" resizeMode="contain" />
        </View>

        <View className="mb-[130px]">{item.description}</View>
      </View>
    ),
    [currentIndex]
  );

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View className="absolute bottom-16 left-0 right-0 flex-row items-center justify-between px-8">
        <TouchableOpacity onPress={currentIndex === 2 ? prevSlide : onFinish}>
          <Text className="text-[18px] font-medium text-black">
            {currentIndex === 2 ? "← Voltar" : "→ Pular"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={currentIndex === 2 ? onFinish : nextSlide}
          className="rounded-full bg-black px-8 py-4"
        >
          <Text className="text-[18px] font-bold text-white">
            {currentIndex === 2 ? "Log in" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
