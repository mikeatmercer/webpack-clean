import {Component} from "preact";
import getUrlVars from "./util/getUrlVars";
import style from "./app-style.scss";
import InputField from "./searchbar";
import LoaderBar from "./LoaderBar";
import searchApp from "./searchApp";
import HTMLClean from "./util/HTMLclean";

export default class App extends Component {
    constructor() {
        super();
        
        this.state = {
            results: [],
            query : (getUrlVars().q) ? decodeURI(getUrlVars().q) : null ,
            searching: false,
            error: false,
            completedSearch: false
        }
    }
    componentWillMount() {
        const acceptResult = function(results) {
            this.setState({
                searching: false,
                results: results.items || [],
                error: results.error,
                completedSearch: true
            })
        }.bind(this);
        
        if(!this.state.query) {
            return ;
        }
        this.setState({searching: this.state.query})
        console.log(this.state.query);
        searchApp(
            {
                query: this.state.query,
                list: this.props.list,
                site: this.props.site ,
                otherColumns: (this.props.othercolumns) ? this.props.othercolumns.split(',') : []
            }, acceptResult
        )

    }
    render(p,s) {
        let loader = (s.searching) ? <LoaderBar /> : null;
        let noResults = (!s.results.length && s.completedSearch) ? <div class={style.resultItem}>We couldn't find want you were looking for. Try searching for something else</div> : null;

        return <div className={style.gSearchApp}>
            <InputField disabled={s.searching} query={s.query} placeholdertext={p.placeholdertext} searchpage={p.searchpage}/>
            {loader}
            {noResults}
            <ResultList
                items={s.results}
                site={p.site}
                list={p.list}
             />
        </div>
    }
}

function ResultList(p) {
    
    if(!p.items.length) {
        return null; 
    }

    
    const listItems = p.items.slice(0,50).map((e,i) => {
        return <div key={e.ID} class={style.resultItem}>
            <a class={style.resultTitle} target="_blank" href={`${p.site}/Lists/${p.list}/DispForm.aspx?ID=${e.ID}`}>
                {e.Title}
            </a>
            <div class={style.resultDescription}  dangerouslySetInnerHTML={{ __html: HTMLClean(e.Description)  || HTMLClean(e.OriginalDescription) ||  "" }}>
                
            </div>
           
        </div>
    } );
    return <div class={style.searchResults}>{listItems}</div>
}