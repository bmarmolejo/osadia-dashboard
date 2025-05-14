import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/partials/_globals.scss";
// import "./styles/partials/_fonts.scss";
// import "./styles/partials/_media-queries.scss";
// import "./styles/partials/_colours.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Inventory from "./pages/Inventory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Inventory />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
