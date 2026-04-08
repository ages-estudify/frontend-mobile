import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ListRenderItem,
} from "react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Treine\nSempre",
    description: (
      <Text className="text-[18px] leading-[28px] tracking-[-0.43px] text-black font-normal">
        <Text className="font-bold">Pratique</Text> com questões,{" "}
        <Text className="font-bold">revise</Text>
        {"\n"}
        conteúdos e dê um passo de cada{"\n"}
        vez na sua preparação.
      </Text>
    ),
    bgColor: "bg-[#B49ED6]",
    image: require("../../assets/images/intro-1.png"),
  },
  {
    id: "2",
    title: "Estude\nDirecionado",
    description: (
      <Text className="text-[18px] leading-[28px] tracking-[-0.43px] text-black font-normal">
        Receba um cronograma gerado pelo{"\n"}
        app e <Text className="font-bold">organize sua rotina</Text> com mais
        {"\n"}
        foco e menos dúvida.
      </Text>
    ),
    bgColor: "bg-[#B7D7A9]",
    image: require("../../assets/images/intro-2.png"),
  },
  {
    id: "3",
    title: "Acompanhe\na Evolução",
    description: (
      <Text className="text-[18px] leading-[28px] tracking-[-0.43px] text-black font-normal">
        Faça simulados, <Text className="font-bold">veja seu</Text>
        {"\n"}
        <Text className="font-bold">desempenho e entenda como você</Text>
        {"\n"}
        <Text className="font-bold">está evoluindo</Text> ao longo dos{"\n"}
        estudos.
      </Text>
    ),
    bgColor: "bg-[#D2EFFD]",
    image: require("../../assets/images/intro-3.png"),
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
        <View className="flex-row justify-center mb-10">
          {SLIDES.map((_, dotIndex) => (
            <View
              key={dotIndex}
              className={`h-[3px] w-[85px] mx-[5px] rounded-full ${
                currentIndex === dotIndex ? "bg-black" : "bg-black/15"
              }`}
            />
          ))}
        </View>

        <Text
          className="text-[50px] leading-[58px] font-bold text-black mb-2"
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.9}
        >
          {item.title}
        </Text>

        <View className="flex-1 items-center justify-center mb-4">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="contain"
          />
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

      <View className="absolute bottom-16 left-0 right-0 px-8 flex-row justify-between items-center">
        <TouchableOpacity onPress={currentIndex === 2 ? prevSlide : onFinish}>
          <Text className="text-black font-medium text-[18px]">
            {currentIndex === 2 ? "← Voltar" : "→ Pular"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={currentIndex === 2 ? onFinish : nextSlide}
          className="bg-black py-4 px-8 rounded-full"
        >
          <Text className="text-white font-bold text-[18px]">
            {currentIndex === 2 ? "Log in" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
