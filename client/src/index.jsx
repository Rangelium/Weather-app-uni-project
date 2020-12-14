import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { StylesProvider } from "@material-ui/core";
import { GlobalDataProvider } from "./components/GlobalDataProvider";
import { AlertDialogProvider } from "./components/AlertDialog/AlertDialogContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
		padding: 0;
		font-size: 16px;
		text-decoration: none;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
	}

  #root{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  a:visited{
    color: inherit;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
  }

`;

ReactDOM.render(
  <React.StrictMode>
    <AlertDialogProvider>
      <GlobalDataProvider>
        <StylesProvider injectFirst>
          <GlobalStyles />
          <App />
        </StylesProvider>
      </GlobalDataProvider>
    </AlertDialogProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
