import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import  Login from './pages/Login/Login.jsx';
import Plan from './pages/Plan/Plan.jsx';
import Up from './pages/Up/Up.jsx';
import Try from './pages/Try/Try.jsx';
import TextCreat from './pages/TextCreat/TextCreat.jsx';
import ZipOpen from './pages/ZipOpen/ZipOpen.jsx';
import ZipD from './pages/ZipD/ZipD.jsx';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/up" element={<Up />} />
        <Route path="/try" element={<Try />} />
        <Route path="/text-create" element={<TextCreat />} />
        <Route path="/zip-open" element={<ZipOpen />} />
        <Route path="/zip-d" element={<ZipD />} />
      </Routes>
    </>
  );
}

export default App; 