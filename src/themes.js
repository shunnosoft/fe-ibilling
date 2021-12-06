import { createGlobalStyle } from "styled-components";
const lightTheme = {
  body: "#f1f0f0",
  furGround: "#fff",
  titleColor: "#fff",
  fontColor: "rgb(58, 63, 59)",
};
const darkTheme = {
  body: "#323032",
  furGround: "#3a3a3a",
  titleColor: "#000",
  fontColor: "#cdcdcd",
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
