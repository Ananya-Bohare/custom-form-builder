import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Router here
import { Provider } from "react-redux";  // Redux provider
import store from "./redux/store";  // Redux store import
import App from "./App";  // Import the App component
import "./index.css";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>  {/* Provide Redux store */}
      <BrowserRouter>  {/* Wrap your app with BrowserRouter once */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
