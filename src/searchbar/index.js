import { Component } from "preact";
import style from "./style.scss";
import CAMLsender from "../util/CAMLsender"

function SearchButton(p) {
    function searchClick(e) {
        e.preventDefault(); 
        p.searchClick();
    }

    return <button className={`${style.searchButton} ${style.searchSubmit}`} onClick={searchClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg></button>
}

function Bolder(p) {
    var search = p.string.toLowerCase(),
        needle = p.query.toLowerCase(),
        start = search.indexOf(needle),
        sec1 = p.string.substring(0,start),
        sec2 = p.string.substring(start, start+needle.length),
        sec3 = p.string.substring(start+needle.length) ;
        return <span>{sec1}<strong>{sec2}</strong>{sec3}</span>
}

function AutoListItem(p) {
    function sender(e) {
        e.preventDefault();
        console.log(p.queryString);
        p.sendQuery(p.queryString)
    }
    function over(e) {
        console.log("over")
    }

    return <div className={`${style.suggestListItem} ${p.highlighted}`} onMouseOver={over} onClick={sender}>
        {p.text}
    </div>
}
function AutoList(p) {
    
    let list = p.autoList.map(function(e,i){
        let highlighted = (i == p.highlighted) ? style.highlighted : ""
        return <AutoListItem 
            highlighted={highlighted}
            queryString={e.title}
            text={<Bolder query={p.query} string={e.title} />} 
            sendQuery={p.sendQuery}
        />
        /*return <div key={e.id} className={`${style.suggestListItem} ${highlighted}`}>
           <Bolder query={p.query} string={e.title} />
        </div>*/
    });
    let hide = (!p.focused || !p.autoList.length) ? "none" : ""

    return <div className={style.suggestList} style={{display: hide}}>
        {list}
        
    </div>
}

export default class SearchBar extends Component {
    constructor(props) {
        super();
        this.state = {
            focused: false,
            text: props.query || "",
            showAuto: false,
            autoList: [],
           currentOrder: -1
        }
        this.sendNew = this.sendNew.bind(this);
        this.textInput = this.textInput.bind(this);
        this.createAuto = this.createAuto.bind(this)
        this.sendAuto;
    }
    toggleFocus() {
        
        setTimeout(function(){
            this.setState({focused: !this.state.focused,currentOrder: -1})
        }.bind(this),100)
    }
    handleEnter(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            this.sendNew();
            
            return false ;
        }
    }
    createAuto(val) {
       
        if(this.state.text.length < 2) {
            this.setState({autoList:[]})
            return; 
        }
        
        /*let newList = this.state.autoList.filter(e => e.toLowerCase().includes(this.state.text.toLowerCase()))
        console.log(newList);
        this.setState({autoList:newList})
        if(newList.length ) {
            return; 
        } */
        //this.setState({autoList: []});
        //Fetch More
        const autoReturn = function(returnData) {
           
            this.setState({
                showAuto: true,
                autoList: returnData.data.d.results.map(function(e){
                    return {
                        id: e.id,
                        title: e.Title.toLowerCase()
                    }   
                })
            })

        }.bind(this);
        this.sendAuto = setTimeout(function() {
            CAMLsender({
                type: "POST",
                url: this.props.autoUrl,
                callback: autoReturn,
                CAML: `<View><RowLimit>8</RowLimit><Query><Where><BeginsWith><FieldRef Name='Title' /><Value Type='Text'>${this.state.text}</Value></BeginsWith></Where> </Query></View>`
            })
        }.bind(this),250)
        
    }
    textInput(e) {
        clearTimeout(this.sendAuto);
        this.setState({
            text: e.target.value,
            showAuto: false,
            currentOrder: -1
        },this.createAuto);
        /*
        if(e.target.value.length > 1) {
            this.sendAuto = setTimeout(function(){
                this.createAuto(e.target.value);
            }.bind(this),300);
        }
        */
    }
    sendNew(value) {
        let v = value || this.state.text;
     
        if(v.length < 2) {
            return false; 
        }
        let url =( (this.props.searchpage) || window.location.href.split("?")[0] ) + `?q=${v}`;
        window.location.href = url ; 
    }
  

    render(p,s) {
        let placeholder = p.placeholdertext || "Search...";
        placeholder = (s.focused) ? "" : placeholder;
        let focusClass = (s.focused) ? style.focused : ""; 

        
        return (
            <div className={style.barWrap}>
            <div className={style.spacer} />
            <div className={`${style.searchInput} ${focusClass}`}>
                <div className={style.searchBar}>
                <input  onKeyDown={this.handleEnter.bind(this)} 
                        disabled={p.disabled} 
                        className={style.searchField} 
                        placeholder={placeholder} 
                        onFocus={this.toggleFocus.bind(this)} 
                        onBlur={this.toggleFocus.bind(this)}
                        type="text" value={s.text}  
                        onInput={this.textInput}/>
                <SearchButton searchClick={this.sendNew} />
                </div>
                <AutoList 
        autoList={ s.autoList.filter(e => e.title.toLowerCase().includes(this.state.text.toLowerCase()))}
        highlighted={s.currentOrder}
        query={this.state.text}
        sendQuery={this.sendNew}
        focused={s.focused}
    />
            </div>
            
            
           
                
            </div>
        )
    }
}
