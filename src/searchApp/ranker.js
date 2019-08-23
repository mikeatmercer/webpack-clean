export default function(query,queryArray,results,columns,titleColumn) {
    
   
    let rankedResults = results.map(e => {
        
       
        let result = e;
        let rank = 0;
        let q = query.toLowerCase().trim();
        let title = e[titleColumn].toLowerCase().trim()
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
        queryArray.forEach(e => {
            if(title.includes(e)) {
                rank += 20; 
            }
        });

        columns.forEach(e => {
      
            rank+= cheapoTest(result[e],q,queryArray)
        });
        result.rank = rank;
        return result;
    });
    

    return rankedResults.sort((a,b) => b.rank - a.rank )

}

function cheapoTest(textString,query,queryArray) {
    const reMaker = (re) =>  new RegExp(re.toLowerCase().trim(),"g");
    
    let tString =(textString) ? textString.toLowerCase() : '',
        rank = 0,
        fullMatches = tString.match(reMaker(query) );

    if(fullMatches) {
        
        rank+= (fullMatches.length * 10)
    }
    tString.split(" ").map(e => e.toLowerCase()).filter(e => e.length > 2).forEach(te => {
        queryArray.forEach(qe => {
            if(qe.toLowerCase() === te.toLowerCase()) {
                rank += 1;
            }
        })
    })
    
    //string term matches
    queryArray.forEach(q => {
        let re = reMaker(q);
        let termMatch = tString.match(re )
        if(termMatch) {
            rank+= (termMatch.length * .5);
        }
    });
   
    return rank; 
}