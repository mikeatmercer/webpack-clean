import { Component } from "preact";
import style from "./style.scss";
import CAMLsender from "../util/CAMLsender"

function SearchButton(p) {
    function searchClick(e) {
        e.preventDefault(); 
        p.searchClick();
    }

    return <button className={`${style.searchButton} ${style.searchSubmit} ${p.listOpen}`} onClick={searchClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg></button>
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
        
        p.sendQuery(p.queryString)
    }
   

    return <div className={`${style.suggestListItem} ${p.highlighted}`}  onClick={sender}>
        {p.text}
    </div>
}
function AutoList(p) {
    
    let list = p.autoList.map((e,i) => {
        let highlighted = (i == p.highlighted) ? style.highlighted : ""
        return <AutoListItem 
            order={p.highlighted}
            highlighted={highlighted}
            queryString={e.title}
            text={<Bolder query={p.query} string={e.title} />} 
            sendQuery={p.sendQuery}
        />
        
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
           currentOrder: -1,
           typing: false,
           savedText: "",
           animating: false
          
        }
        this.sendNew = this.sendNew.bind(this);
        this.createAuto = this.createAuto.bind(this);
        this.sendAuto;
        this.animatingTimer;
        this.tc = props.titleColumn; 
        this.animating = this.animating.bind(this);
    }
    animating() {
        let initiate = () => {
            this.animatingTimer = setTimeout(() => {
                this.setState({animating: false});
            },250)
        };
        this.setState({animating:true},initiate)
    }
    toggleFocus(value,timing,order) {
        clearTimeout(this.animatingTimer);
       // return;
        let t = timing || 100;
        let v = value || !this.state.focused
        let o = order || -1

      
        setTimeout(() => {
            this.setState({focused: v,currentOrder:o, savedText: this.state.text},this.animating);
        },t)
    }
    handleEnter(e) {

        if(e.keyCode == 13) {
            e.preventDefault();
            this.sendNew();
            
            return false ;
        }
        const protectKeys = [13,38,40];
        if(protectKeys.includes(e.keyCode)) {
            
            e.preventDefault();
        } else {
            this.setState({dontFlip: false});
            return;
        }
        
        let newOrder = this.state.currentOrder;
        switch(e.keyCode) {
            //KEY UP
            case 38:
                newOrder = (newOrder !== -1) ? newOrder - 1 : this.state.autoList.length - 1
                break;
            //KEY DOWN
            case 40: 
                newOrder = (newOrder !== this.state.autoList.length - 1) ? newOrder + 1 : -1;
                break;
        }   
        if(newOrder === this.state.currentOrder) {
            return ; 
        } 

        this.setState({
            dontFlip: true,
            currentOrder: newOrder,
        },() => {
            this.setState({text: (newOrder === -1)? this.state.savedText : this.state.autoList[newOrder].title})
            
        });
        
        /**/

    }
    createAuto(val) {
       
        if(this.state.text.length < 2) {
            this.setState({autoList:[]})
            return; 
        }
        
        const autoReturn = (returnData) => {
           if(this.state.typing) {
               return; 
           }
           let title = this.tc;
           let results = [];
           let usedTerms = [];
           returnData.data.d.results.forEach(e => {
               if(usedTerms.includes(e[title].toLowerCase())) {
                   return; 
               }
               usedTerms.push(e[title].toLowerCase());
               results.push(e);
           });
            this.setState({
                showAuto: true,
                autoList:results.map(e => {
                    return {
                        id: e.id,
                        title: e[title].toLowerCase()
                    }   
                })
            })

        };

        this.sendAuto = setTimeout(() => {
            this.setState({typing: false})
            CAMLsender({
                type: "POST",
                url: this.props.autoUrl,
                callback: autoReturn,
                CAML: `<View><RowLimit>8</RowLimit><Query><Where><BeginsWith><FieldRef Name='${this.tc}' /><Value Type='Text'>${this.state.text}</Value></BeginsWith></Where> </Query></View>`
            })
        },150)
        
    }
    textInput(e) {
      
        clearTimeout(this.sendAuto);
        if(this.state.dontFlip) {
            return; 
        }
       
        this.setState({
            text: e.target.value,
            showAuto: false,
            currentOrder: -1,
            typing: true,
            savedText: e.target.value.toLowerCase(),
            dontFlip: false
        },this.createAuto);
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
        let animatingClass = (s.animating) ? style.animating : "";
        let autoList = s.autoList.filter(e => e.title.toLowerCase().includes(this.state.savedText.toLowerCase()));
        let openClass = (!s.focused || !autoList.length)? "" : style.listOpen; 
     
        
      
        return (
            <div className={style.barWrap}>
            <div className={style.spacer} />
            <div className={`${style.searchInput} ${animatingClass} ${focusClass} ${openClass}`}>
                <div className={`${style.inputDrop} ${openClass} `}>
                    <input  
                        onKeyDown={(e) => {this.handleEnter(e)}} 
                        disabled={p.disabled} 
                        className={style.searchField}
                        placeholder={placeholder} 
                        onFocus={()  => this.toggleFocus(true, 0, -1)} 
                        onBlur={() => this.toggleFocus(false)}
                        type="text" value={s.text}  
                        onInput={(e) => {this.textInput(e)}}
                        ref={currentInput => this.currentInput = currentInput}
                    />
                    <AutoList 
                        autoList={ autoList}
                        highlighted={s.currentOrder}
                        query={this.state.savedText}
                        sendQuery={this.sendNew}
                        focused={s.focused}
                    />
                </div>
                <SearchButton searchClick={this.sendNew} listOpen={openClass} />
            </div>
            </div>
        )
    }
}
