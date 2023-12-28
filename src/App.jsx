import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./layouts/landing";
import Canvas from "./layouts/canvas";
import SStoCode from "./layouts/sstocode";

function App() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="draw" element={<Canvas />} />
      <Route path="sscode" element={<SStoCode />} />
      {/* <Route path="*" element={<Navigate to={"/landing/"} replace />} /> */}
    </Routes>
  );
}

export default App;
