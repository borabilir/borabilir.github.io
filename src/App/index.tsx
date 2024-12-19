import Intro from './components/Intro';
import AboutMe from './components/AboutMe';
import CareerJourney from './components/CareerJourney';
import Skills from './components/Skills';
import styles from './styles.module.scss';
import Header from './components/Header';

const Root: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* <Header /> */}
            <Intro />
            <AboutMe />
            <CareerJourney />
            <Skills />
        </div>
    );
};

export default Root;
