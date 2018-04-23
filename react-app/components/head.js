var cumber = require('../bendy.js');

module.exports = class Header extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var renderedHTML;

        if(store.activeGroup !== undefined){
            renderedHTML = [
                <img id="backBtn" style={{height:'36px', margin: '7px'}} onClick={e => {e.stopPropagation();storeSend(undefined, 'activeGroup');}} src="/img/back.png"/>,
                <span id="groupName">{store.groups[ store.activeGroup ].name}</span>
            ];
        }
        else renderedHTML = [
            <button onClick={e => {e.stopPropagation(); store.user.name = cumber(); this.forceUpdate();}}>re-Cumberify</button>,
            <input placeholder="Username" value={store.user.name} id="usernameInput" onChange={e => {store.user.name = e.target.value; this.forceUpdate();}}/>,
            <input placeholder="Your Image" value={store.user.img} id="imgInput" onChange={e => {store.user.img = e.target.value; this.forceUpdate();}}/>,
            <input placeholder="Your Colour" value={CS$.accent} id="colorInput" onChange={e => {CS$.accent = e.target.value; store.user.color = CS$.accent; this.forceUpdate(); doCSS();}}/>
        ]

        return (
            <div id="header" onClick={()=>{if(store.activeGroup)return; CS$.headerH = 123; doCSS();}}>
                {renderedHTML}
            </div>
        )
    }
}