import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import BiologiaSvg from "../../../assets/icons/subjects/biologia.svg";
import EspanholSvg from "../../../assets/icons/subjects/espanhol.svg";
import FilosofiaSvg from "../../../assets/icons/subjects/filosofia.svg";
import FisicaSvg from "../../../assets/icons/subjects/fisica.svg";
import GeografiaSvg from "../../../assets/icons/subjects/geografia.svg";
import HistoriaSvg from "../../../assets/icons/subjects/historia.svg";
import InglesSvg from "../../../assets/icons/subjects/ingles.svg";
import LiteraturaSvg from "../../../assets/icons/subjects/literatura.svg";
import MatematicaSvg from "../../../assets/icons/subjects/matematica.svg";
import PortuguesSvg from "../../../assets/icons/subjects/portugues.svg";
import QuimicaSvg from "../../../assets/icons/subjects/quimica.svg";
import SociologiaSvg from "../../../assets/icons/subjects/sociologia.svg";

const subjectIconMap: Record<string, React.FC<{ width: number; height: number }>> = {
  biologia: BiologiaSvg,
  espanhol: EspanholSvg,
  filosofia: FilosofiaSvg,
  fisica: FisicaSvg,
  geografia: GeografiaSvg,
  historia: HistoriaSvg,
  ingles: InglesSvg,
  literatura: LiteraturaSvg,
  matematica: MatematicaSvg,
  portugues: PortuguesSvg,
  quimica: QuimicaSvg,
  sociologia: SociologiaSvg,
};

function normalizeSubjectName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

export interface SubjectBoxProps {
  subject: string;
  icon?: string;
  href: `/subject?${string}`;
}

export default function SubjectBox({ subject, icon, href }: SubjectBoxProps) {
  const router = useRouter();
  const IconComponent = subjectIconMap[normalizeSubjectName(subject)];

  return (
    <Pressable
      className="items-center justify-center rounded-3xl bg-purplePrice p-[10px]"
      style={{ width: "100%", aspectRatio: 1 }}
      onPress={() => router.navigate(href)}
    >
      <View className="items-center justify-center gap-[6px]">
        {icon ? (
          <Image source={{ uri: icon }} style={{ width: 48, height: 48 }} resizeMode="contain" />
        ) : (
          IconComponent && <IconComponent width={48} height={48} />
        )}
        <Text
          className="font-interSemi mt-[8px] text-center text-[14px] text-white"
          numberOfLines={2}
        >
          {subject}
        </Text>
      </View>
    </Pressable>
  );
}
