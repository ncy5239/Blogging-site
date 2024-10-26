import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm.tsx';
import ListPage from './ListPage.tsx';
import RegisterPage from './RegisterPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

