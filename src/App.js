import {Component} from "preact";
import getUrlVars from "./util/getUrlVars";
import style from "./app-style.scss";
import InputField from "./searchbar";
import LoaderBar from "./LoaderBar";
import searchApp from "./searchApp";
import HTMLClean from "./util/HTMLclean";

const {
    resultDescription,
    resultItem,
    gSearchApp,
    searchResults,
    resultTitle
} = style

export default class App extends Component {
    constructor(props) {
        super();
        this.state = {
            results: [],
            query : (getUrlVars().q) ? decodeURI(getUrlVars().q) : null ,
            searching: false,
            error: false,
            completedSearch: false,
            okComplete: false,
            queryurl : `${props.site}/_api/web/lists/getbytitle('${props.list}')/GetItems`
        }
       
    }
    componentWillMount() {
        document.title = this.props.pagetitle || "Search";
        const acceptResult = ({items,error}) => {
            this.setState({
                searching: false,
                results: items || [],
                error: error,
                completedSearch: true
            })
        };
        
        if(!this.state.query) {
            return ;
        }
        this.setState({searching: this.state.query})

        document.title = `${this.state.query} - ${(this.props.pagetitle || "Search")}`

        searchApp(
            {
                query: this.state.query,
                url: this.state.queryurl,
                titleColumn: this.props.titlecolumn || "Title", 
                otherColumns: (this.props.othercolumns) ? this.props.othercolumns.split(',') : [],
            }, acceptResult
        )

    }
    render({placeholdertext,searchpage,titlecolumn,site,list},{searching,query,results,completedSearch}) {
      
       

        return <div className={gSearchApp}>
            <InputField autoUrl={this.state.queryurl} disabled={searching} query={query} placeholdertext={placeholdertext} searchpage={searchpage || null } titleColumn={titlecolumn}/>
            {(searching) ? <LoaderBar /> : null}
            {(!results.length && completedSearch) ? <div class={`${resultItem} ${resultDescription}`}>We couldn't find want you were looking for. <br/>Try a different search or <a href="http://sites.mercer.com/sites/glossary/default.aspx">browse the glossary</a>.</div> : null}
            <ResultList
                items={results}
                site={site}
                list={list}
             />
        </div>
    }
}

const ResultList = ({items,list,site}) => {
    
    if(!items.length) {
        return null; 
    }
    

    
    const listItems = items.slice(0,50).map(({ID, OriginalDescription, Title}) => (
         <div key={ID} class={resultItem}>
            <a class={resultTitle} target="_blank" href={`${site}/Lists/${list}/DispForm.aspx?ID=${ID}`}>
                {Title}
            </a>
            <div class={resultDescription}  dangerouslySetInnerHTML={{ __html: HTMLClean(e.Description)  || HTMLClean(OriginalDescription) ||  "" }}>
                
            </div>
           
        </div>
     ) );
    return <div class={searchResults}>{listItems}</div>
}