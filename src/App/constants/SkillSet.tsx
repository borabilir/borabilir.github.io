import { Skill } from 'App/types/Skill';
import {
    AntdIcon,
    BootstrapIcon,
    ChartjsIcon,
    CssIcon,
    EmotionIcon,
    HtmlIcon,
    JavascriptIcon,
    JQueryIcon,
    NextIcon,
    ReactIcon,
    ReduxIcon,
    ScssIcon,
    StyledComponentsIcon,
    TypescriptIcon,
    I18NextIcon,
    MotionIcon,
    CSharpIcon,
    TSQLIcon,
    DotNetIcon,
    MongoDbIcon,
    RedisIcon,
    BitbucketIcon,
    GithubIcon,
    JiraIcon,
    FigmaIcon,
    PhotoshopIcon,
    SlackIcon,
    TeamsIcon,
    PostmanIcon,
    VisualStudioIcon,
    VisualStudioCodeIcon,
} from 'Core/components/Icons';
import RechartsIcon from 'Core/components/Icons/recharts';
import { SkillType } from 'App/types/SkillType';

export const SkillSet: Record<SkillType, Skill> = {
    typescript: {
        name: 'Typescript',
        area: 'frontend',
        category: 'language',
        color: '#3178c6',
        icon: <TypescriptIcon />,
    },
    javascript: {
        name: 'Javascript',
        area: 'frontend',
        category: 'language',
        color: '#ebd100',
        icon: <JavascriptIcon />,
    },
    html: {
        name: 'HTML',
        area: 'frontend',
        category: 'language',
        color: '#e34e25',
        icon: <HtmlIcon />,
    },
    css: {
        name: 'CSS',
        area: 'frontend',
        category: 'language',
        color: '#264de4',
        icon: <CssIcon />,
    },
    scss: {
        name: 'SCSS',
        area: 'frontend',
        category: 'library',
        color: '#cd5392',
        icon: <ScssIcon />,
    },
    react: {
        name: 'React',
        area: 'frontend',
        category: 'framework',
        color: '#61dafb',
        icon: <ReactIcon />,
    },
    nextjs: {
        name: 'Next.js',
        area: 'frontend',
        category: 'framework',
        color: '#000000',
        icon: <NextIcon />,
    },
    antd: {
        name: 'Ant Design',
        area: 'frontend',
        category: 'library',
        color: '#0e70fe',
        icon: <AntdIcon />,
    },
    bootstrap: {
        name: 'Bootstrap',
        area: 'frontend',
        category: 'library',
        color: '#7c12f8',
        icon: <BootstrapIcon />,
    },
    emotion: {
        name: 'Emotion',
        area: 'frontend',
        category: 'library',
        color: '#a45b9c',
        icon: <EmotionIcon />,
    },
    styled: {
        name: 'Styled Components',
        area: 'frontend',
        category: 'library',
        color: '#9a6ac2',
        icon: <StyledComponentsIcon />,
    },
    jquery: {
        name: 'jQuery',
        area: 'frontend',
        category: 'library',
        color: '#0868ac',
        icon: <JQueryIcon />,
    },
    redux: {
        name: 'Redux',
        area: 'frontend',
        category: 'library',
        color: '#7649bb',
        icon: <ReduxIcon />,
    },
    chartjs: {
        name: 'Chart.js',
        area: 'frontend',
        category: 'library',
        color: '#fe777b',
        icon: <ChartjsIcon />,
    },
    recharts: {
        name: 'Recharts',
        area: 'frontend',
        category: 'library',
        color: '#000000',
        icon: <RechartsIcon />,
    },
    i18n: {
        name: 'i18n',
        area: 'frontend',
        category: 'library',
        color: '#009788',
        icon: <I18NextIcon />,
    },
    motion: {
        name: 'Motion',
        area: 'frontend',
        category: 'library',
        color: '#f0e511',
        icon: <MotionIcon />,
    },
    csharp: {
        name: 'C#',
        area: 'backend',
        category: 'language',
        color: '#9a4e95',
        icon: <CSharpIcon />,
    },
    tsql: {
        name: 'T-SQL',
        area: 'backend',
        category: 'language',
        color: '#d9425d',
        icon: <TSQLIcon />,
    },
    dotnetcore: {
        name: '.NET Core',
        area: 'backend',
        category: 'framework',
        color: '#621ee5',
        icon: <DotNetIcon />,
    },
    aspdotnetcore: {
        name: 'ASP.NET Core',
        area: 'backend',
        category: 'framework',
        color: '#621ee5',
        icon: <DotNetIcon />,
    },
    efcore: {
        name: 'Entity Framework Core',
        area: 'backend',
        category: 'orm',
        color: '#671f78',
    },
    dapper: {
        name: 'Dapper',
        area: 'backend',
        category: 'orm',
        color: '#671f78',
    },
    linq: {
        name: 'LINQ',
        area: 'backend',
        category: 'orm',
        color: '#671f78',
    },
    mssql: {
        name: 'Microsoft SQL Server',
        area: 'backend',
        category: 'database',
        color: '#d9425d',
        icon: <TSQLIcon />,
    },
    mongodb: {
        name: 'MongoDB',
        area: 'backend',
        category: 'database',
        color: '#17823f',
        icon: <MongoDbIcon />,
    },
    redis: {
        name: 'Redis',
        area: 'backend',
        category: 'database',
        color: '#cb291c',
        icon: <RedisIcon />,
    },
    bitbucket: {
        name: 'Bitbucket',
        area: 'tools',
        color: '#0659d3',
        icon: <BitbucketIcon />,
    },
    github: {
        name: 'Github',
        area: 'tools',
        color: '#000000',
        icon: <GithubIcon />,
    },
    jira: {
        name: 'Jira',
        area: 'tools',
        color: '#2684ff',
        icon: <JiraIcon />,
    },
    figma: {
        name: 'Figma',
        area: 'tools',
        color: '#a259ff',
        icon: <FigmaIcon />,
    },
    photoshop: {
        name: 'Photoshop',
        area: 'tools',
        color: '#32adff',
        icon: <PhotoshopIcon />,
    },
    slack: {
        name: 'Slack',
        area: 'tools',
        color: '#e01e5a',
        icon: <SlackIcon />,
    },
    teams: {
        name: 'Teams',
        area: 'tools',
        color: '#424ab4',
        icon: <TeamsIcon />,
    },
    vs: {
        name: 'Visual Studio',
        area: 'tools',
        color: '#7252aa',
        icon: <VisualStudioIcon />,
    },
    vscode: {
        name: 'Visual Studio Code',
        area: 'tools',
        color: '#007abf',
        icon: <VisualStudioCodeIcon />,
    },
    postman: {
        name: 'Postman',
        area: 'tools',
        color: '#ff6016',
        icon: <PostmanIcon />,
    },
};
