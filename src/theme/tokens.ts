import { Platform } from "react-native";

export const colors = {
  background: "#F4F1EA",
  canvas: "#FFFDF8",
  surface: "#FBF7EF",
  card: "#F8F2E7",
  cardAlt: "#EEF4EA",
  border: "#D6CEC1",
  text: "#14211B",
  textMuted: "#536057",
  accent: "#0D6B53",
  accentSoft: "#D9F3EA",
  accentStrong: "#084A39",
  warning: "#A35B17",
  warningSoft: "#F8E7D3",
  success: "#19744F",
  danger: "#A0372A"
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999
};

export const typography = {
  title: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif-condensed",
    default: "system"
  }),
  body: Platform.select({
    ios: "Avenir",
    android: "sans-serif",
    default: "system"
  })
};
