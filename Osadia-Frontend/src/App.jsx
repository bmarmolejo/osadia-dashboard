import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/partials/_globals.scss";
// import "./styles/partials/_fonts.scss";
// import "./styles/partials/_media-queries.scss";
// import "./styles/partials/_colours.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Inventory from "./pages/Inventory";
import Locations from "./pages/Locations";
import Sold from "./pages/Sold";
import LocationDetail from "./pages/LocationDetail";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Inventory />} />
          <Route path="/location/:binNumber" element={<LocationDetail />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/sold" element={<Sold />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
