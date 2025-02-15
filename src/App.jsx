import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProductGrid from "./components/ProductGrid";
import CartModal from "./components/CartModal";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <main className="container main-content">
          <Sidebar />
          <ProductGrid />
        </main>
        <CartModal />
      </div>
    </Provider>
  );
};

export default App;
