import { Component } from "preact";
import linkState from "linkstate";
import style from "./style.scss";

function SearchButton(p) {
    function searchClick(e) {
        e.preventDefault(); 
        p.searchClick();
    }

    return <button className={style.searchSubmit} onClick={searchClick}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg></button>
}

export default class SearchBar extends Component {
    constructor(props) {
        super();
        this.state = {
            focused: false,
            text: props.query || ""
        }
        this.sendNew = this.sendNew.bind(this);
    }
    toggleFocus() {
        this.setState({focused: !this.state.focused})
    }
    handleEnter(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            this.sendNew();
            
            return false ;
        }
    }
    sendNew() {
        
     
        if(this.state.text.length < 2) {
            return false; 
        }
        let url =( (this.props.searchpage) || window.location.href.split("?")[0] ) + `?q=${this.state.text}`;
        window.location.href = url ; 
    }
  

    render(p,s) {
        let placeholder = p.placeholdertext || "Search...";
        placeholder = (s.focused) ? "" : placeholder;
        let focusClass = (s.focused) ? style.focused : ""; 


        return (
            <div className={`${style.searchInput} ${focusClass}`}>
                <input  onKeyDown={this.handleEnter.bind(this)} 
                        disabled={p.disabled} 
                        className={style.searchField} 
                        placeholder={placeholder} 
                        onFocus={this.toggleFocus.bind(this)} 
                        onBlur={this.toggleFocus.bind(this)}  
                        type="text" value={s.text}  
                        onInput={linkState(this,"text")}/>
                <SearchButton searchClick={this.sendNew} />
             
            </div>
        )
    }
}