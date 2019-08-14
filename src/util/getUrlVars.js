export default function(path) {
    var p = path || window.location.href;
    var vars = {};
    var parts = p.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}