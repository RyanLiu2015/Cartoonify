import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import List from "./pages/List";
import Helmet from "react-helmet";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Helmet>
        <style>
          {
            "body, html{ background-color: #F5F5F5; max-width: 100%; overflow-x: hidden}"
          }
        </style>
      </Helmet>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="list" element={<List />} />
      </Routes>
    </div>
  );
}

export default App;
