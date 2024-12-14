import Intro from './components/Intro';
import AboutMe from './components/AboutMe';
import CareerJourney from './components/CareerJourney';
import Skills from './components/Skills';

const Root: React.FC = () => {
    return (
        <>
            <Intro />
            <AboutMe />
            <CareerJourney />
            <Skills />
        </>
    );
};

export default Root;
