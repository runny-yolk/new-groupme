const Message = function(props){
    var msg = props.message;
    return(
        <div id={msg.id} className={"message "+(msg.sameUser?'sameUser':'')}>
            <div className="userpic" style={{backgroundImage:'url('+msg.img+')'}}/>
            <div className="name">{msg.name}</div>
            <div className="text">{msg.text}</div>
            <div className="color" style={{background:msg.color}}></div>
        </div>
    )
}

module.exports = class Messages extends React.Component {
    constructor(props){
        super(props);

        ereq('/api/mess/all', {
            onload: (data, xhr) => {
                if(xhr.status !== 200){logit(data, xhr); return;}

                forObj(data, (x, key) => {
                    data[key] = x.sort((a, b) => {
                        return a.created - b.created;
                    });
                });

                store.messages = data;

                updatePage();
            }
        });
    }
    

    componentWillUpdate(){
        var group = store.activeGroup;

        if(!group || this.lastActive === group) return;

        ereq('/api/mess/'+group, {
            onload: (data, xhr) => {
                if(xhr.status !== 200){logit(data, xhr); return;}

                store.messages[group] = data.sort((a, b) => {
                    return a.created - b.created;
                });
                updatePage();
            }
        });

        this.lastActive = store.activeGroup;
    }

    sendNewMessage(){
        var input = document.getElementById('msgInput');
        var group = store.activeGroup;
        
        ereq('/api/mess/'+group, {
            method: 'POST',
            body: {
                text: input.value,
                name: store.user.name,
                color: store.user.color,
                img: store.user.img,
                uid: store.user.id
            },
            onload: (data, xhr) => {
                if(xhr.status !== 200){logit(data, xhr); return;}

                store.messages[group] = data[1].sort((a, b) => {
                    return a.created - b.created;
                });
                updatePage();
            }
        });

        input.value = '';
        input.focus();
    }

    
    handleKeyPress(e){
        if(e.key === 'Enter' && e.shiftKey === true);
        else return;
        e.preventDefault();
        this.sendNewMessage();
    }

    render(){
        var messages = null,
        group = store.activeGroup;

        if(group && store.messages[group]) messages = store.messages[group].map((msg, i, arr) => {
            msg.sameUser = false;
            if(arr[i-1] && arr[i-1].uid === msg.uid) msg.sameUser = true;

            return (<Message key={msg.id} message={msg}/>)
        });

        return(
            <div className="mainList" id="messages">
                <div id="messCont">
                    {messages}
                </div>
                <textarea id="msgInput" onKeyPress={this.handleKeyPress.bind(this)}/>
                <div id="msgBtnBox">
                    <img src="/img/submit.png" onClick={this.sendNewMessage}/>
                    <img src="/img/attach.png" onClick={logit}/>
                </div>
            </div>
        )
    }
}