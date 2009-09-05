// Outputs the message in a readaale way
log = function(message) {
    if (typeof(message) != 'object') {
        return message;
    } else {
        function indent(str) {
            return str.replace(/^/mg, " ");
        }
        function makeStructured(obj) {
            var str = "";
            for (var i in obj) {
                try {
                    if (typeof(obj[i]) == 'object') {
                        str += i + ":\n" + indent(makeStructured(obj[i])) + "\n";
                    } else {
                        str += i + " = " + indent(String(obj[i])).replace(/^ /, "") + "\n";
                    }
                } catch(e) {
                    str += i + " = EXCEPTION: " + e.message + "\n";
                }
            }
            return str;mate 
        }
        return "\nObject:\n" + makeStructured(message);
    }
};