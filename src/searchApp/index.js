import queryBuilder from "./queryBuilder";
import ranker from "./ranker";
import CAMLsender from "../util/CAMLsender";


export default function(searchSchema, callback) {
  
    let searchColumns = (searchSchema.otherColumns ) ? searchSchema.otherColumns.map(e => e.trim()) : [];
        if(!searchColumns.includes("Title")) {
            searchColumns.push("Title");
        }
    searchColumns = searchColumns.filter((item,index,self) => self.indexOf(item) === index);
    var queryArray = searchSchema.query.trim().split(" ").filter(function(e,i){
        return e.length > 2; 
    });

    let CAMLQuery = queryBuilder(queryArray, searchColumns);

    const returnFunction = function(returnPackage) {
        if(returnPackage.error) {
            callback({error:true});
            return; 
        }
        let results = returnPackage.data.d.results; 
        var ranked = ranker(searchSchema.query, queryArray, results, searchColumns.filter(e => e !== "Title"));
             //parseResults(data.d.results, term,queryString)
        callback({
        items: ranked,
        error: false
        })
    }
    CAMLsender({
        type: "POST",
        url: searchSchema.url,
        callback: returnFunction,
        CAML: `<View><Query><Where>${CAMLQuery}</Where> </Query></View>`
    })
    
    
}