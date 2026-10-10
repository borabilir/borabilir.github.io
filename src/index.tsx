import ReactDOM from 'react-dom/client';
import 'Core/styles/main.scss';
import Root from './App';
import './Core/utils/i18n';
import HollowgaleRouter from './Hollowgale';
import './Hollowgale/base.scss';

const isHollowgalePath = (path: string) =>
    path === '/hollowgalegames' || path.startsWith('/hollowgalegames/');

const redirectedPath = new URLSearchParams(window.location.search).get('path');
if (redirectedPath && isHollowgalePath(redirectedPath)) {
    window.history.replaceState(null, '', redirectedPath);
}

const hollowgale = isHollowgalePath(window.location.pathname);
document.documentElement.classList.toggle('hollowgale-page', hollowgale);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <>
        {hollowgale ? <HollowgaleRouter /> : <Root />}
        <div id="modalContainer" />
    </>
);
