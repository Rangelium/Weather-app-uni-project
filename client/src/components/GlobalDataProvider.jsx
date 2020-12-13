import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { ThemeProvider } from "styled-components";
import { AlertDialogContext } from "./AlertDialog/AlertDialogContext";

export const GlobalDataContext = React.createContext();

export class GlobalDataProvider extends React.Component {
  static contextType = AlertDialogContext;
  state = {
    currentTheme: "light",
    theme: {
      primary: "#F2F2F2",
      secondary: "",
    },

    success: this.showSuccess,
    error: this.showError,
    alert: this.context.alert,

    changeTheme: this.changeTheme,
  };

  showSuccess(msg) {
    toast.success(msg, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  showError(msg) {
    toast.error(msg, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  changeTheme(themeName) {
    if (!themeName) {
      this.changeTheme(this.state.currentTheme === "light" ? "dark" : "light");
      return;
    }

    if (themeName === "light") {
      this.setState({
        primary: "#F2F2F2",
        secondary: "",
      });

      return;
    }
    if (themeName === "dark") {
      this.setState({
        primary: "#F2F2F2",
        secondary: "",
      });

      return;
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <GlobalDataContext.Provider value={this.state}>
          {this.props.children}
          <StyledToastContainer
            style={{
              zIndex: 100000000000000,
            }}
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </GlobalDataContext.Provider>
      </ThemeProvider>
    );
  }
}

// ===============================================================================================================================
//                                              STYLES
// ===============================================================================================================================

const StyledToastContainer = styled(ToastContainer)`
  width: fit-content;
  min-width: 320px;
  max-width: 400px;

  .Toastify__toast--success {
    background-color: #167a16;
    color: #f3ffe9;
    height: 30px;

    .Toastify__progress-bar {
      background-color: #a8aaa5;
    }
  }
  .Toastify__toast--error {
    background-color: #c41b1b;
    color: #f3ffe9;
    height: 30px;

    .Toastify__progress-bar {
      background-color: #a8aaa5;
    }
  }
`;
