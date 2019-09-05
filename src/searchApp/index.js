import queryBuilder from "./queryBuilder";
import ranker from "./ranker";
import CAMLsender from "../util/CAMLsender";


export default function(searchSchema, callback) {
    const {
        titleColumn,
        otherColumns,
        query,
        url
    } = searchSchema

  
    
    let searchColumns = (otherColumns ) ? otherColumns.map(e => e.trim()) : [];
        if(!searchColumns.includes(titleColumn)) {
            searchColumns.push(titleColumn);
        }
    searchColumns = searchColumns.filter((item,index,self) => self.indexOf(item) === index);
    var queryArray = query.trim().split(" ").filter(e  => e.length > 2 );

    let CAMLQuery = queryBuilder(queryArray, searchColumns);

    const returnFunction = function(returnPackage) {
        if(returnPackage.error) {
            callback({error:true});
            return; 
        }
        let results = returnPackage.data.d.results; 
      
        callback({
        items: ranker(query, queryArray, results, searchColumns.filter(e => e !== titleColumn),titleColumn),
        error: false
        })
    }
    CAMLsender({
        type: "POST",
        url: url,
        callback: returnFunction,
        CAML: `<View><Query><Where>${CAMLQuery}</Where> </Query></View>`
    })
    
    
}