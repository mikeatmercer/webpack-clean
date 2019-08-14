export default function(query,queryArray,results,columns) {
    
   
    let rankedResults = results.map(function(e){
        
       
        let result = e;
        let rank = 0;
        let q = query.toLowerCase().trim();
        let title = e.Title.toLowerCase().trim()
        //Title Match
        if(title === q) {
            rank += 100; 
        }
        //Full Query is in beginning of title
        if(title.indexOf(q) === 0) {
            rank+= 50
        }
        //Full Query is in title
        if(title.includes(q)) {
            rank += 30;
        }
        queryArray.forEach(function(e){
            if(title.includes(e)) {
                rank += 20; 
            }
        });
        

        //Cheapo Test
        //console.log(rank);
        
        columns.forEach(e => {
           // console.log(e);
            rank+= cheapoTest(result[e],q,queryArray)
        });
        result.rank = rank;
        return result;
    });
    

    return rankedResults.sort((a,b) => b.rank - a.rank )

}

function cheapoTest(textString,query,queryArray) {
    let tString =(textString) ? textString.toLowerCase() : '',
        stringArray = tString.split(" ").map(e => e.toLowerCase()),
        rank = 0;
    //Check for Full query in string
    //console.log(query);
    let re = new RegExp(query.toLowerCase().trim(),"g");
    let fullMatches = tString.match(re )
    if(fullMatches) {
        
        rank+= (fullMatches.length * 10)
    }
    stringArray.forEach(function(te){
        queryArray.forEach(function(qe) {
            if(qe.toLowerCase() === te.toLowerCase()) {
                rank += 1;
            }
        })
    })
    
    //string term matches
    queryArray.forEach(function(q){
        let re = new RegExp(q.toLowerCase().trim(),"g");
        let termMatch = tString.match(re )
        if(termMatch) {
            rank+= (termMatch.length * .5);
        }
    });
   
    return rank; 
}