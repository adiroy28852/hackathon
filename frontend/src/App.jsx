import React from "react";
import "./App.css";
import MainLayout from "./components/layout/main.layout";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div className="">
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </div>
  );
}

export default App;
