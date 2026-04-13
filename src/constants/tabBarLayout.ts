/** Altura fixa da barra de abas (floating pill). */
export const TAB_BAR_HEIGHT = 62;

/** Margens laterais do pill em relação à tela (menor = mais largura para os rótulos). */
export const TAB_BAR_HORIZONTAL_INSET = 10;

/** Margem vertical de cada slot (entre o highlight e a borda da barra). */
export const TAB_ITEM_VERTICAL_MARGIN = 2;

/** Altura útil de cada faixa de tab (para cápsula horizontal no highlight). */
export const TAB_ITEM_TRACK_HEIGHT = TAB_BAR_HEIGHT - 2 * TAB_ITEM_VERTICAL_MARGIN;

/** Raio do highlight ativo: metade da altura útil (mesma lógica da barra branca). */
export const TAB_ITEM_HIGHLIGHT_RADIUS = TAB_ITEM_TRACK_HEIGHT / 2;

/** Espaço extra abaixo do conteúdo rolável para não ficar sob a barra. */
export const TAB_BAR_SCROLL_GAP = 12;

export function tabBarBottomOffset(safeAreaBottom: number): number {
  return Math.max(safeAreaBottom, 12);
}

/** `paddingBottom` do `ScrollView` para o último conteúdo ficar acima da tab bar. */
export function tabBarScrollContentPaddingBottom(safeAreaBottom: number): number {
  return tabBarBottomOffset(safeAreaBottom) + TAB_BAR_HEIGHT + TAB_BAR_SCROLL_GAP;
}
