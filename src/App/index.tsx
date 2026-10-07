import Header from './components/Header';
import Intro from './components/Intro';
import AboutMe from './components/AboutMe';
import CareerJourney from './components/CareerJourney';
import Skills from './components/Skills';
import RecentProjects from './components/RecentProjects';
import LetsTalk from './components/LetsTalk';
import Footer from './components/Footer';
import LoveQuiz from './pages/LoveQuiz';
import MarioGame from './pages/Mario';

const Root: React.FC = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';

    if (path === '/q7m2x9k4' || path === '/pasaparola') {
        return <LoveQuiz />;
    }

    if (path === '/mario') {
        return <MarioGame />;
    }

    return (
        <div style={{width:"100%", overflow:"hidden"}}>
            <Header />
            <Intro />
            <AboutMe />
            <CareerJourney />
            <Skills />
            <RecentProjects />
            <LetsTalk />
            <Footer />
        </div>
    );
};

export default Root;
