var Stack = {
  phases: {
    early:  new Array(),
    normal: new Array(),
    late:   new Array(),
    error:  new Array()
  },
  request:  {},
  makeerr: function( anError ) {
    return [ 500, ['Content-Type', 'text/plain'], anError ];
  }
};

Stack.Event   = function() {};
Stack.Halt = function() {};
Stack.Halt.prototype = new Stack.Event();
Stack.Pass = function() {};
Stack.Pass.prototype = new Stack.Event();

Stack.Response = function() {
  this.code = 200;
  this.body = "";
  this.mime = 'text/html';
  this.headers = {};
  this.encoding = 'utf-8';
  this.toHTTPResponse = function() {
    var arr_headers = new Array();
    if ( this.mime ) {
      this.headers["Content-Type"] = this.mime;
      if ( this.encoding ) 
        this.headers["Content-Type"] += '; charset=' + this.encoding;
    }
    for ( var header in this.headers ) {
      if ( this.headers[header] instanceof Array ) {
	Array.push.apply( arr_headers, this.headers[header].map( function(a) {
	  return [header, a];
	}).reduce( function(a, b) {
	  return a.concat(b);
	}));
      } else {
	arr_headers.push( header, this.headers[header] );
      }
    }
    return [this.code, arr_headers, this.body];
  };
};
Stack.Response.prototype = new Stack.Event();

Stack.response = new Stack.Response();

Stack.Handler = function( aFunction, shouldRun, aName ) {
  this.name = aName || "unnamed";
  this.test = shouldRun;
  this.run  = aFunction;
};

Stack.add = function( aHandler, phase ) {
  if (!phase) phase = "normal";
  Stack.phases[ phase ].push( aHandler );
};

Stack.runHandle = function( hndl ) {
  /* here is the protocol
   *   first of all the handle's "test" property is executed, with the Stack object
   *     as "this". and with no arguments.
   *   It should return either an Array on success, or null on failure.
   *   If it does return an array the handles 'run' property is executed, again with
   *     the Stack object as "this", and with the Array returned from the test as
   *     its arguments.
   *   If the run property returns anything, it is thrown as an exception.
   */
  var should_run = hndl.test.apply(Stack, []);
  if ( should_run ) {
    var response = hndl.run.apply( Stack, should_run );
    if ( response ) throw response;
  }
};

function main( aRequest ) {
    Stack.request = aRequest;
    try {
        for each ( var phase in ['early','normal','late'] ) {
            for each( handle in Stack.phases[phase] ) {
                try {
                    Stack.runHandle( handle );
                } catch(e) {
                    if ( e instanceof Stack.Event ) {
                        if ( e instanceof Stack.Response ) {
                            throw e;
                        } else if ( e instanceof Stack.Pass ) {
                            /* ignore, but keep running */
                        }
                    } else {
                        throw e;
                    }
                }
            }
        }
    } catch(e) {
        if ( e instanceof Stack.Response )
        return e.toHTTPResponse();
        var t = e.message + " at " + e.fileName + " line " + e.lineNumber;
        return Stack.makeerr( t );
    }
    
    // Let Clayburn handle 404's
    try {
       throw new UserException("NotFound", "File not found");    
    } catch(e) {

    
        var dict = [];
        var args = [];
        dict['params'] = [];
        dict['params']['controller'] = "exception";
        dict['params']['action'] = e.name
        args.push(dict);
        
        var expController = new ControllerMixin(args,this);  
        expController.extend(ExceptionControllerMixin);
    

        if (typeof(ExceptionController) == 'object' ) {
            expController.extend(ExceptionController);
        }
    
        if (typeof(expController[e.name]) == 'function') {
            expController[e.name](e);
        }

        var x = expController.getResponse();
        return x.body;
    }   
}