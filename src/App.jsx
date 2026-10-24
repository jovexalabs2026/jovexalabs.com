import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import DashRush from './pages/DashRush.jsx';
import Roadmap from './pages/Roadmap.jsx';
import OpenSource from './pages/OpenSource.jsx';
import LearnLayout from './components/learn/LearnLayout.jsx';
import Learn from './pages/Learn.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import CourseQuiz from './pages/CourseQuiz.jsx';
import Playground from './pages/Playground.jsx';
import Practice from './pages/Practice.jsx';
import Paths from './pages/Paths.jsx';
import Projects from './pages/Projects.jsx';
import Reference from './pages/Reference.jsx';
import MyLearning from './pages/MyLearning.jsx';
import LearnCommunity from './pages/LearnCommunity.jsx';
import Developers from './pages/Developers.jsx';
import DeveloperDocs, { DeveloperProjects } from './pages/DeveloperDocs.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';
import { DigitalLayout, DigitalHome, DigitalAI, DigitalEducation, DigitalServices,
  DigitalSafety, DigitalBusiness, DigitalActivity } from './pages/Digital2030.jsx';

const CommunityPrototype = lazy(() => import('./pages/CommunityPrototype.jsx'));
const CivicExplorer = lazy(() => import('./pages/CivicExplorer.jsx'));

export default function App() {
  return (
    <Routes>
      <Route path="prototype/explorer" element={
        <Suspense fallback={<p className="section" role="status">Loading civic explorer...</p>}>
          <CivicExplorer />
        </Suspense>
      } />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/dash-rush" element={<DashRush />} />
        <Route path="products/:projectSlug" element={<ProjectDetails />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="learn" element={<LearnLayout />}>
          <Route index element={<Learn />} />
          <Route path="playground" element={<Playground />} />
          <Route path="practice" element={<Practice />} />
          <Route path="paths" element={<Paths />} />
          <Route path="projects" element={<Projects />} />
          <Route path="reference" element={<Reference />} />
          <Route path="my" element={<MyLearning />} />
          <Route path="community" element={<LearnCommunity />} />
          <Route path=":courseSlug" element={<Course />} />
          <Route path=":courseSlug/quiz" element={<CourseQuiz />} />
          <Route path=":courseSlug/:lessonSlug" element={<Lesson />} />
        </Route>
        <Route path="open-source" element={<OpenSource />} />
        <Route path="developers" element={<Developers />} />
        <Route path="developers/docs" element={<DeveloperDocs />} />
        <Route path="developers/projects" element={<DeveloperProjects />} />
        <Route path="prototype/community" element={
          <Suspense fallback={<p className="section" role="status">Loading community prototype...</p>}>
            <CommunityPrototype />
          </Suspense>
        } />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="digital2030" element={<DigitalLayout />}>
          <Route index element={<DigitalHome />} />
          <Route path="ai" element={<DigitalAI />} />
          <Route path="education" element={<DigitalEducation />} />
          <Route path="services" element={<DigitalServices />} />
          <Route path="cybersecurity" element={<DigitalSafety />} />
          <Route path="business" element={<DigitalBusiness />} />
          <Route path="impact" element={<DigitalActivity />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
