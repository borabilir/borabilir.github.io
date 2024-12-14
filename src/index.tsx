import ReactDOM from 'react-dom/client';
import 'Core/styles/main.scss';
import Root from './App';
import './Core/utils/i18n';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<Root />);
