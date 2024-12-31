import Intro from './components/Intro';
import AboutMe from './components/AboutMe';
import CareerJourney from './components/CareerJourney';
import Skills from './components/Skills';
import RecentProjects from './components/RecentProjects';
import LetsTalk from './components/LetsTalk';
import Footer from './components/Footer';

const Root: React.FC = () => {
    return (
        <div style={{width:"100%", overflow:"hidden"}}>
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
