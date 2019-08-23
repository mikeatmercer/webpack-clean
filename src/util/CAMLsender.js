import $ from "jquery";

export default function(queryPackage) {
    const query = {
        "query": {
            '__metadata': { 'type': 'SP.CamlQuery' },
            'ViewXml' : (
                queryPackage.CAML)
        }   
    }

    $.ajax({
        type: queryPackage.type || "POST", 
        headers: { 
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        }, 
        data: JSON.stringify(query),
        url: queryPackage.url, 
        success: function(data){
            const returnPackage = {
                data: data,
                error: false,
                success: true
            }
            queryPackage.callback(returnPackage);
            return ;
       
        },
        failure: function(d) {
            queryPackage.callback({data:{},error: true, success: false})
        }
    });
}