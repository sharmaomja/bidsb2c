import { createChatBotMessage } from 'react-chatbot-kit';
import Avatar from './assets/Avatar';
import StartBtn from './assets/StartBtn';
import StartSlow from './assets/StartSlow';
import DipslayImage from './assets/DisplayImage';
import data from './data'; // Import the data file

const config = {
    botName: "Negotiation bot",
    initialMessages: [createChatBotMessage(`Hello, how can I help you today`, {
        widget: "startBtn"
    })],
    customComponents: {
        botAvatar: (props) => <Avatar {...props} />,
    },
    state: {
        checker: null,
        userData: {
            name: "",
            age: 0,
            category: "",
            product: {
                name: "",
                link: "",
                imageUrl: ""
            }
        }
    },
    widgets: [
        {
            widgetName: "startBtn",
            widgetFunc: (props) => <StartBtn {...props} />,
        },
        {
            widgetName: "startSlow",
            widgetFunc: (props) => <StartSlow {...props} />,
        },
        {
            widgetName: "finalImage",
            widgetFunc: (props) => <DipslayImage {...props} />,
        },
    ]
};

export default config;
