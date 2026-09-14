import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import DashRush from './pages/DashRush.jsx';
import Roadmap from './pages/Roadmap.jsx';
import OpenSource from './pages/OpenSource.jsx';
import Learn from './pages/Learn.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import Playground from './pages/Playground.jsx';
import Developers from './pages/Developers.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/dash-rush" element={<DashRush />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/playground" element={<Playground />} />
        <Route path="learn/:courseSlug" element={<Course />} />
        <Route path="learn/:courseSlug/:lessonSlug" element={<Lesson />} />
        <Route path="open-source" element={<OpenSource />} />
        <Route path="developers" element={<Developers />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
