var Template = {}
Template = {
    config : {
        defaultPath : (typeof Config == 'object' && Config.viewPath) ? Config.viewPath : '' 
    },
    
    templateFor : function(context, content_type, controller, template) {
        
        var templateLocation = null;
        
        var template = template || context;
        
        if(template) {
            if (typeof(template) == "string") {
                
                // Does the templete end in a format?
                var re = new RegExp("\."+content_type+"$");
                if (!re.test(template)) {
                    template = template + '.' + content_type;
                } 
                
                if (/^\//.test(template)) {
                    templateLocation = template;
                } else {
                    // Is there any segments in the template?
                    var segments = template.split('/');

                    switch (segments.length) {
                        case 1: 
                            templateLocation = Template.config.defaultPath + "/" + controller.toLowerCase() + "/"  + template;
                        break;
                        case 2:
                            templateLocation = Template.config.defaultPath + "/" + segments[0] + "/"  + segments[1];
                        break;
                        case 3:
                            templateLocation = segments[0] + "/"  + segments[1] + "/" +  segments[2];
                        break;
                    }
                
                }  
                
            } else {
                // Object, now lets check the keys...
            }
            
        } 
        
        return templateLocation;
        
    }
}
