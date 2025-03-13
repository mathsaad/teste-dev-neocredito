import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ListPage from './pages/ListPage';
import Navbar from './components/NavBar';

function App() {
  return (
<Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/List" element={<ListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;