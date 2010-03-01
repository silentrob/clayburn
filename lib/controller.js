ControllerMixin = function(a,scope) {
    this.args = a;
    this.params = a[0].params;
    this.response = Stack.response;
    this.app = scope;
    this.renderCount = 0;
    this.data = {};
}

ControllerMixin.prototype = {

    _defaultRenderOptions : {},
    
    /* Displays content to the screen, in the format requested.
     * display(object, thing = nil, opts = {}) 
     *
     */
    display: function(thing, options) {
        
        var options = options || {};
        var thing = thing || null;
        
        // todo, handle mime types / content types... 

        var aAccept = this.app.request.headers.Accept.split(',');
    
        for(var i = 0;i < aAccept.length; i++) {
            if (aAccept[i] == "application/json" ) {
                this.response.mime = 'application/json';
                options.format = 'json';                 
                var json = true;
            }
        }
        
        if (typeof(thing) == 'string' ) {

            if (json == true) {
                thing = JSON.stringify( thing );
//                this.response.body = thing;   
                this.render(thing,options);        
            } else {
                this.render();
            }

        } else {
            if (thing) {
                if (thing.code ) {
                    this.response.code = thing.code;
                    this.response.body = '';
                }

                this.render(thing, options);
            } else {
                this.render(options);
            }
        }
    },

    /*
     * Force the response to JSON (first pass)
     */
  	displayJSON : function(thing) {
  		this.response.mime = 'application/json';
  		this.response.code = 200;
      this.response.body = JSON.stringify(thing);
  	},
    
    /*
     * thing : Object that responds to Resource (Model) or String, text to render.
     * options { format : String, template : String, status : int, layout : String }
     *
     */
    render : function(thing, opt) {
                          
        this.renderCount++;
        
        if (this.renderCount > 1) {
            throw new UserException("DoubleRender",null,70);
        }
                
        var opts = opt || {};
        var renderContent = "";

        // If thing is just TEXT, we want to render that.
        if (typeof( thing ) == "string") {
            renderContent = thing;
        }
                
        // How is this method being called?
        if (!(thing instanceof Resource) ) {
            opts = thing || {};
            thing = this.params.action;
        }
                    
        this.content_type = opts['format'] || 'html';
        
        var template = Template.templateFor(thing, this.content_type, this.params.controller, opts['template']);
                
        // Set Status
        this.handleStatus(opts);
        
        var layout = this.layout || opts['layout'];
        
        // TODO - Move this block into the Template object.
        if (system.filesystem.exists(template) && renderContent.length == 0) {
            if (!layout) {
                // renderContent = system.filesystem.get(template).contents;
            } else {
                
                // renderContent is the layout
                renderContent = system.filesystem.get(Config.layoutPath + "/" + layout).contents;
                                        
                var content = system.filesystem.get(template).contents;
                this.data.catch_content = new EJS({text: content }).render(this.data );
            }
        } else {
            if (renderContent.length == 0 && opts.status != 200) {
                throw new UserException("TemplateNotFound", "Trying to render " + template + " but can't find it. Error occrured when called " + this.params.controller + "." + this.params.action + "()");
            }
        }

        var output = new EJS({text: renderContent }).render(this.data);
        this.response.body = output;
    },
    
    redirect : function ( aLocation ) {
        var loc = "";
        if (/\//.test(aLocation)) {
            loc = aLocation;
        } else {
            loc = "/" + this.params.controller.toLowerCase() + "/" + aLocation;
        }
        
        var response = new Stack.Response();
        response.code = 302;
        response.headers.Location = loc;
        this.response = response;
    },

    handleStatus : function(opts) {
        var opts = opts || {};
        this.response.code = opts.status || 200;
        
    },
    
    getResponse: function() {
        // system.console.log(log(this.response));
        return this.response;
    },
    
    extend : function(c) {
        for (o in c) {
            this[o] = c[o];
        }
    }
}

function UserException(name, message, ln) {
    this.name = name || "Unknown";
    this.message = message || "";
    this.lineNumber = ln || "";
}

