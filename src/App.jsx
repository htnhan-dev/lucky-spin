import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminPage } from "./pages/AdminPage";
import { LuckySpinPage } from "./pages/LuckySpinPage";
import { PrizeProvider } from "./contexts/PrizeContext";

function App() {
  return (
    <PrizeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LuckySpinPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PrizeProvider>
  );
}

export default App;
