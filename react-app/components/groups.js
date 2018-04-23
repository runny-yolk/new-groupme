const Group = function(props) {
    var group = props.group,
    lastmsg;

    if(store.messages[group.id]) lastmsg = store.messages[group.id][ store.messages[group.id].length-1 ];

    return(
        <div className="groupCont" onClick={props.click} id={group.id}>
            <div className="groupImage" style={{backgroundImage:'url('+group.img+')'}} />
            <div className="groupName">{group.name}</div>
            {lastmsg?
                <div className="lastMsg"><span>{lastmsg.name}</span>{': '+lastmsg.text.slice(0, 75)}</div>
            :null}
        </div>
    )
};


module.exports = class Groups extends React.Component {
    constructor(props){
        super(props);
        this.state = {};

        this.updateGroupData();
    }

    updateGroupData(){
        ereq('/api/groups', {
            onload: (data, xhr) => {
                if(xhr.status !== 200){logit(data, xhr); return;}
                storeSend(data, 'groups');
            }
        });
    }
    
    componentWillUpdate(){
        var group = store.activeGroup;
        if(this.lastActive !== store.activeGroup) this.updateGroupData()
        this.lastActive = store.activeGroup;
    }


    addGroup(){
        var name = document.getElementById('newgroupname');
        var img = document.getElementById('newgroupimg');

        if(!name.value) return;

        ereq('/api/groups', {
            method: 'POST',
            body: {name: name.value, img: (img.value||null)},
            onload: (data, xhr) => {
                if(xhr.status !== 200){logit(data, xhr); return;}
                storeSend(data[1], 'groups');
            }
        });

        this.toggleGroupForm();

        name.value = '';
        img.value = '';
    }

    toggleGroupForm(){
        if(this.state.showGroupForm) this.setState({showGroupForm:false});
        else this.setState({showGroupForm:true});
    }


    render(){

        var groups = forObj(store.groups, x => {
            return( <Group click={(e)=>storeSend(e.currentTarget.id, 'activeGroup')} key={x.id} group={x}/> );
        }).sort((b, a) => {
            return a.props.group.lastUpdate - b.props.group.lastUpdate;
        });

        return(
            <div className="mainList" id="groups"  onClick={()=>{CS$.headerH = 50; doCSS();}}>
                {groups}
                <div id="groupFormBtn" onClick={this.toggleGroupForm.bind(this)}>
                    <img src="/img/addgroup.png" />
                </div>

                <div id="addGroupOverlay" style={this.state.showGroupForm?{display:'block'}:null}>
                    <div id="addGroupBox">
                        <div onClick={this.toggleGroupForm.bind(this)} className="close">X</div>
                        <input onKeyPress={e => e.key === 'Enter'?this.addGroup():null} placeholder="New Group Name" id="newgroupname"/>
                        <input onKeyPress={e => e.key === 'Enter'?this.addGroup():null} placeholder="New Group Image URL" id="newgroupimg"/>
                        <button onClick={this.addGroup.bind(this)}>Add Group</button>
                    </div>
                </div>
            </div>
        )
    }
}