import queryBuilder from "./queryBuilder";
import ranker from "./ranker";
import $ from "jquery";


export default function(searchSchema, callback) {
  
    let searchColumns = (searchSchema.otherColumns ) ? searchSchema.otherColumns.map(e => e.trim()) : [];
        if(!searchColumns.includes("Title")) {
            searchColumns.push("Title");
        }
    searchColumns = searchColumns.filter((item,index,self) => self.indexOf(item) === index);
    var queryArray = searchSchema.query.trim().split(" ").filter(function(e,i){
        return e.length > 0; 
    });

    let CAMLQuery = queryBuilder(queryArray, searchColumns);
    var query = {
        "query": {
            '__metadata': { 'type': 'SP.CamlQuery' },
            'ViewXml' : (
                `<View><Query><Where>${CAMLQuery}</Where> </Query></View>`)
        }   
    }
    $.ajax({
        type: "POST", 
        headers: { 
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }, 
        data: JSON.stringify(query),
        url: "http://sites.mercer.com/sites/glossary/_api/web/lists/getbytitle('All Content')/GetItems", 
        success: function(data){
         
            var results = data.d.results; 
    
            var ranked = ranker(searchSchema.query, queryArray, data.d.results, searchColumns.filter(e => e !== "Title"));
             //parseResults(data.d.results, term,queryString)
             callback({
                items: ranked,
                error: false
             })
        },
        failure: function(d) {
            callback({error: true, })
        }
    });
/*
    .map(function(query){
        let searchColumns = (searchSchema.otherColumns ) ? searchSchema.otherColumns.map(e => e.trim()) : [];
        searchColums.push("Title");
        return searchColumns.map(function(column){

        })
    });
    let searchColumns = (searchSchema.otherColumns ) ? searchSchema.otherColumns.map(e => e.trim()) : [];

    let queries = searchColumns.map(function(e){
        return queryArray.
    });*/
    
}