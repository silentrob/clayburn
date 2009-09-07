ExceptionControllerMixin = {
    layout : 'application.html',
    
    DoubleRender : function(e) {
        this.render("Error DoubleRender - You can only call render once [" + e.lineNumber + "]");
    },
    
    TemplateNotFound : function(e) {
        this.render("Error TemplateNotFound - " + e.message);
    },
    
    ActionMissing : function(e) {
        this.data.exception = e;
        this.data.exception.title = "ActionMissing";
        this.render({template:"general"});
    },
    
    NotFound : function(e) {
        this.data.exception = e;
        this.data.exception.title = "404 Not Found";
        this.render();
    }
}
