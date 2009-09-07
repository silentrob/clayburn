
/**
 * Checks to see if a file exists
 * @return true/false
 *
 **/
system.filesystem.exists = function(file) {
    try {
        system.filesystem.get(file);
        return true;
    }
    catch (e) {
        if (e.fileName == 'system.filesystem') {
            return false;
        }
    } 
}

