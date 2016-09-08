function objectLength(obj) {
    var t = typeof (obj);
    var i = 0;
    if (t != "object" || obj == null)
        return 0;
    for (x in obj)
        i++;
    return i;
}
/*$(selector).exist()*/
jQuery.fn.exists = function () {
    return $(this).length;
};