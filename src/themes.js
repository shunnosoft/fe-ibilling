import { createGlobalStyle } from "styled-components";
const lightTheme = {
  body: "#f1f0f0",
  furGround: "#fff",
  titleColor: "#fff",
  fontColor: "#686e6b",
};
const darkTheme = {
  body: "#121317",
  furGround: "#1A1C23",
  titleColor: "#000",
  fontColor: "#96bb96",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const GlobalStyles = createGlobalStyle`

body{
    background-color: ${(props) => props.theme.body}
}

`;
