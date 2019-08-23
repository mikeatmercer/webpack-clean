import {Component} from "preact";
import getUrlVars from "./util/getUrlVars";
import style from "./app-style.scss";
import InputField from "./searchbar";
import LoaderBar from "./LoaderBar";
import searchApp from "./searchApp";
import HTMLClean from "./util/HTMLclean";


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
        const acceptResult = (results) => {
            this.setState({
                searching: false,
                results: results.items || [],
                error: results.error,
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
    render(p,s) {
      
       

        return <div className={style.gSearchApp}>
            <InputField autoUrl={this.state.queryurl} disabled={s.searching} query={s.query} placeholdertext={p.placeholdertext} searchpage={p.searchpage } titleColumn={this.props.titlecolumn}/>
            {(s.searching) ? <LoaderBar /> : null}
            {(!s.results.length && s.completedSearch) ? <div class={style.resultItem}>We couldn't find want you were looking for. Try searching for something else</div> : null}
            <ResultList
                items={s.results}
                site={p.site}
                list={p.list}
             />
        </div>
    }
}

const ResultList = (p) => {
    
    if(!p.items.length) {
        return null; 
    }

    
    const listItems = p.items.slice(0,50).map(e => (
         <div key={e.ID} class={style.resultItem}>
            <a class={style.resultTitle} target="_blank" href={`${p.site}/Lists/${p.list}/DispForm.aspx?ID=${e.ID}`}>
                {e.Title}
            </a>
            <div class={style.resultDescription}  dangerouslySetInnerHTML={{ __html: HTMLClean(e.Description)  || HTMLClean(e.OriginalDescription) ||  "" }}>
                
            </div>
           
        </div>
     ) );
    return <div class={style.searchResults}>{listItems}</div>
}