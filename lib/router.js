system.use("com.joyent.Sammy");

function resources( name , options) {
    
    
    name = name.toLowerCase();
    objName = name.substr(0,1).toUpperCase() + name.substr(1);

    indexUrl    = new RegExp(name+"$|"+name+"\/index");             // -- /task or /task/index
    showUrl     = new RegExp(name+"\/([a-z0-9_-]+)\/show","i");     // -- /task/:id/show
    newUrl      = new RegExp(name+"\/new");                         // -- /task/new
    editGetUrl  = new RegExp(name+"\/([a-z0-9_-]+)\/edit","i");     // -- /task/:id/edit
    delGetUrl   = new RegExp(name+"\/([a-z0-9_-]+)\/delete","i");   // -- /task/:id/delete        
    editUrl     = new RegExp(name+"\/([a-z0-9_-]+)$","i");          // -- /task/:id
    
    // TODO roll this into a DRY Loop
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, indexUrl ]),   { segment_item : [], controller : objName, action : 'index' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, showUrl ]),    { segment_item : ['id'], controller : objName, action : 'show' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, newUrl ]),     { segment_item : [], controller : objName, action : 'new' }));     
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.POST, indexUrl ]),  { segment_item : [], controller : objName, action : 'create' }));


    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.PUT, editUrl ]),    { segment_item : [], controller : objName, action : 'update' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.DELETE, editUrl ]), { segment_item : ['id'], controller : objName, action : 'destroy' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.POST, editUrl ]),   { segment_item : ['id'], controller : objName, action : 'changed' }));

    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, editUrl ]),    { segment_item : ['id'], controller : objName, action : 'show' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, editGetUrl ]), { segment_item : [], controller : objName, action : 'edit' })); 
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET, delGetUrl ]),  { segment_item : [], controller : objName, action : 'delete' }));             

    return this;
     
}

function match(aTest) {

    this.segments = [];
    
    aSegments = aTest.split('/');
    aSegments.shift();
    
    var re = /^:([a-z0-9]+)$/i;
    for (var i=0; i < aSegments.length; i++) {
        if (re.exec(aSegments[i]) != null) {
            var m = re.exec(aSegments[i])[1];
            this.segments.push(m);
        }
    }
    
    var s = ''; 
    // if we have any segments, we need to modify the test
    if (this.segments.length != 0) {
        for(var i=0; i < this.segments.length; i++) {
            s += "\/([a-z0-9-_]+)";
        }
        base = aTest.substring(0,(aTest.indexOf(":") - 1))
        this.aTest = new RegExp(base + s + "$","i");
        
    } else {
        this.aTest = aTest;
    }
    
    return this;       
}

function to(option) {
    var that = this;
    this.data = {};
    this.data['segment_item'] = [];    
    
    
    // Convert segments to data with the same name if they dont exist in the option list
    for (var x = 0; x < this.segments.length; x++) {
        if (option) {
            if (option[this.segments[x]]) {
                this.data[this.segments[x]] = option[this.segments[x]];
                this.data['segment_item'].push(this.segments[x]);                
            } else {
                this.data['segment_item'].push(this.segments[x]);
            }
        } else {
            this.data['segment_item'].push(this.segments[x]);            
        }
            
    }

    if (size(option) != 0) {
        for(var i in option ) {            
            this.data[i] = option[i];
        }
    }
    
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.GET,that.aTest]), this.data ));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.POST,that.aTest]), this.data ));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.PUT,that.aTest]), this.data));
    Stack.add(new Router.Handler(Sammy.generate_test([Sammy.Test.Method.DELETE, that.aTest]), this.data));


   return this;    
}


Router = {}
Router.Handler = function( shouldRun, p ) {
    this.name = "unnamed";
    this.test = shouldRun;

    this.run  = function() {

        args = [];
        var dict = {};
        dict['params'] = {};

        // Asign the arguments to the keys
        for(var a = 0; a < arguments.length; a++ ) {
            system.console.log(arguments[a]);
           dict['params'][p['segment_item'][a]] = arguments[a];
        }
        
        dict['params']['controller'] = (p.controller || dict['params'].controller);
        dict['params']['action'] = (p.action || dict['params'].action );
        
        dict['obj'] = getConctollerName(dict['params'].controller);

        args.push(dict);
        
        // Move the Body Params into local passed in params, POST vars
        // TODO - Sanatize these params
        // TODO - Deal with file upload here as well.
        for(x in this.request.body) {
            dict['params'][x] = this.request.body[x];
        }
            
        // Test for POST DELETE
        if (dict['params']['_method'] == "DELETE") {
            dict['params']['action'] = 'destroy';
        }
        
        // Catch and Override Exceptions
        try {
            var controller = new ControllerMixin(args,this);
            controller.extend(dict['obj']);

            // Maybe add this to the early phase?
            if (controller['before']) {
                controller['before']();
            }

            if (typeof(controller[dict.params.action]) == 'function') {
                controller[dict['params'].action](dict['params']);
            } else {
                throw new UserException("ActionMissing", "Action '" + dict['params'].action + "' is not a function, did you forget to add it to your '" + dict['params'].controller + "' Controller? " + dict['params'].action);
            }

            if (controller['after']) {
                controller['after']();
            }

            return controller.getResponse();

        } catch(e) {
            // We will see if there is a controller setup to handle Exceptions

            var dict = [];
            var args = [];
            dict['params'] = [];
            dict['params']['controller'] = (p.controller || dict['params'].controller);
            dict['params']['action'] = (p.action || dict['params'].action );

            args.push(dict);
                        
            var expController = new ControllerMixin(args,this);  
            expController.extend(ExceptionControllerMixin);
            
            // Does the User extend this controller?
            if (typeof(ExceptionController) == 'object' ) {
                expController.extend(ExceptionController);
            }    

            // Call the Handle, User or Ours... Ours are over ridden by the user exception handle
            if (typeof(expController[e.name]) == 'function') {
                expController[e.name](e);
            } else {
                // If I forgot to create a custom handle, catch it here...
                expController.render("Uncaught Error: '" + e.name + "' " + e.message + " on line " + e.lineNumber);
            }
            
            return expController.getResponse();            
        }
        
    };
};

// TODO Move these either into the router or core-ext
var getConctollerName = function(c) {
    var name = c.toLowerCase();
    var objName = name.substr(0,1).toUpperCase() + name.substr(1);
    return eval(objName + "Controller");
}

size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;   
}

