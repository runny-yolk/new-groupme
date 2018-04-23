window.React = require('react');
window.ReactDOM = require('react-dom');

window.logit = console.log;

// init utility functions + store obj to window
require('./utils.js');
// init dynamic CSS
require('./css.js')

// Getting components
const Header = require('./components/head.js');
const Groups = require('./components/groups.js');
const Messages = require('./components/mess.js');


store.user = {
    id: Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2),
    color: CS$.accent
};
store.messages = {};
store.user.name = require('./bendy.js')();
store.activeScreen = 'groups';


class Page extends React.Component {
    constructor(props){
        super(props);

        window.updatePage = () => {
            this.forceUpdate();
            doCSS();
        };

        var longPollCallback = function(data, xhr){
            if(data[0] === 'newgroup') storeSend(data[1], 'groups');
            else {
                store.messages[data[0]] = data[1].sort((a, b) => {
                    return a.created - b.created;
                });;
                updatePage();
            }
            longPoll('/api/poll', longPollCallback);
        };
        longPoll('/api/poll', longPollCallback);
    }
    
    render(){
        return(
            <div style={{height:'100%'}}>
                <Header/>
                <Groups/><Messages/>
            </div>
        )
    }
}


ReactDOM.render(
    <Page />,
    document.getElementById('root')
);