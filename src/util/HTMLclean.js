import $ from "jquery"; 

export default function(s) {
    if(!s) {
        return s; 
    }
    var allowed_tags = [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul','ol','nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'div','table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe','img' ];

    var p = document.createElement("div");
    $(p).html(s);
   

    $(p).find('*').each(function(i,e){

        if($.inArray($(e).prop("tagName").toLowerCase(),allowed_tags) === -1) {

        $(e).contents().unwrap();



        }

        $(this).removeAttr('style').removeAttr('dir');

        if($(this).prop('tagName').toLowerCase() !== "img") {

        $(this).removeAttr('src');

        }

    });

    return $(p).html();
}