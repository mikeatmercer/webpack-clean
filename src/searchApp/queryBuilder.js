export default function(queryArray,columns) {
    if(!queryArray.length || !columns.length) {
        return false; 
    }
    let queries = []
    columns.forEach((column) => {
        queryArray.forEach((query) => {
            queries.push(`<Contains><FieldRef Name='${column}' /><Value Type='Text'>${query}</Value></Contains>`);
        })
    })
    return orAdder(queries);
}

function orAdder(q) {
    var string = [];
        
        if(q.length === 1) {
            return q.join("");
        }
        var steps = q.length - 2; 
        for (var i = 0; i <= steps; i++) {
            string.push('<Or>');
            string.push(q[i]);
            if(i === steps) {
                string.push(q[i+1]);
            }
        }
        for (var i = 0; i < q.length - 1; i++) {
            string.push("</Or>");
        }
       
        return string.join("");
}