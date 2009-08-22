ExceptionControllerMixin = {
    DoubleRender : function(e) {
        this.render("Error DoubleRender - You can only call render once [" + e.lineNumber + "]");
    },
    
    TemplateNotFound : function(e) {
        this.render("Error TemplateNotFound - " + e.message);
    },
    
    ActionMissing : function(e) {
        this.render("Error ActionMissing - " + e.message);        
    }
}
