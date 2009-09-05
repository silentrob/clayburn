/**
 *  Smart Models
 *
 *  Models are an extension of Joyent Resources, the code *is* identical with a few additions.
 *  Anything you can do with a Joyent Resource, you can do with a Model.
 */

system.use("com.joyent.Resource");
var Model = function( typename, watches ) {

      
      if (!watches) watches = {};

      var theType = function(attributes) {
    
        this.created = new Date();
        this.id      = system.uuid();
        this._set_watches();

        this.errors = [];
        
        // TODO - This needs to test against the properties.
        if (attributes) {
            for ( var x in attributes) {
                this[x] = attributes[x];
            }
        }

        if (theType.model) {
            this.extend(theType.model.instanceMethods);
        }

        if ( watches['@constructor'] )
          watches['@constructor'].apply(this, arguments);
      };

      theType.errors = [];
      
      theType.transient = false;

      theType.all = function() {
          return theType.search({}) || {};
      };
      
      theType.first = function() {
          return theType.search({})[0];
      };      

      theType.last = function() {
          return theType.search({}).reverse()[0];
      };
            
      theType.search = function( aQuery, someOptions ) {
        if ( theType.transient ) throw new Error("cannot search for transient objects");
        var resultset = system.datastore.search(typename, aQuery, someOptions).map( function( anObject ) {
          anObject.__proto__ = theType.prototype;
          
          if ( watches['@get'] ) watches['@get'].apply(anObject, []);
          anObject.created = new Date(anObject.created);
          anObject.updated = new Date(anObject.updated);
          anObject._set_watches();
          
          if (theType.model) {
              anObject.extend(theType.model.instanceMethods);
          }

          if (theType.join) {              
              for(var i = 0; i < theType.join.length; i++) {
                  var newModel = new Model(theType.join[i]);
                  var joinOn = eval(theType.typename.toLowerCase() + "_id");
                  anObject[theType.join[i].toLowerCase() + "s"] = newModel.search({joinOn: {'=': anObject.id }});
              }
          }
          return anObject;
        });

        // Call some function on every column
        resultset.processCol = function(fn) {
            if (typeof fn != "function") return;
            for (var i = 0; i < this.length; i++) {
                fn(this[i]);
            }
        }
        
        // This just uses the new processCol API to sum all the data from a given column
        resultset.sum = function(column) {        
            var total = 0;
            this.processCol(function(col) { 
                if (typeof col[column] != "undefined")
                    total += parseInt(col[column]);
            });
            return total;            
        }
        return resultset;
      };

      theType.remove = function( anId ) {
        theType.get( anId ).remove();
      };
      
      // gets an object from the datastore.
      theType.get = function( anId ) {
        var theObject = system.datastore.get(typename, anId);
        theObject.__proto__ = theType.prototype;
        if ( watches['@get'] ) watches['@get'].apply(theObject, []);
        theObject.created = new Date( theObject.created );
        theObject.updated = new Date( theObject.updated );
        theObject._set_watches();
        return theObject;
      };


      // updates attributes (Object Litteral) and cross references with the properties table on the model.
      // update only updates with properties from the model decoration, and rejects all others.
      theType.prototype.updateAttributes = function(attributes) {
          if (attributes) {
              for ( var x in attributes) {
                  if (theType.model.properties[x]) {
                      this[x] = attributes[x];
                  }
              }
              this.save();
          }          
      },
            
      // applies the watch funtions.
      theType.prototype._set_watches = function() {
        for ( var prop in watches ) {
          // should probably do this with indexOf instead...
          if ( !prop.match(/^\@/) ) {
    	var watcher = function( id, oldval, newval ) {
    	  return watches[prop].apply( this, [ id, oldval, newval ] );
    	};
    	this.watch( prop, watcher );
          }
        }
      };

      theType.prototype._unset_watches = function() {
        for ( var prop in watches ) {
          this.unwatch( prop );
        }
      };
      
      theType.prototype.extend = function(c) {
          for (o in c) {
              this[o] = c[o];
          }
      };

      theType.prototype.remove = function() {
        system.datastore.remove(typename, this.id );
        if ( watches['@remove'] )
          watches['@remove'].apply(this,[]);
      };

      theType.prototype.save = function() {
          var saveAttributes = true;
          
          if ( this.created instanceof Date ) {
              this.created = this.created.getTime();
          }
          
          this.updated = new Date().getTime();

          var aCache = {};
          if ( watches['@save'] ) {
              watches['@save'].apply(this, [ aCache ]);
          }
          
          var params = {}
          
          if (theType.model.properties) {
              for (var x in theType.model.properties ) {
                  params[x] = this[x];
              }
          }
          

          // Run against validators
          if (theType.model.validations) {
              
              for (var x in theType.model.validations ) {
                  if (params[x] == this[x]) {
                      if (theType.model.validations[x](this) != true) {
                          saveAttributes = false
                      }
                  }
              }
          }
          
          if (saveAttributes) {
              system.datastore.write(typename, params, theType.transient);          
          }
        
          if ( watches['@saved'] ) {
              watches['@saved'].apply(this, [ aCache ]);
          }

          return saveAttributes;
      };

      theType.typename = typename;
      
      if (!Model.types) Model.types = [];
      Model.types.push( typename );

      if (!Model.typemap) Model.typemap = {};
      Model.typemap[typename] = theType;

      theType.extend = function(c) {
          for (o in c) {
              this[o] = c[o];
          }
      };

      var objName = typename.substr(0,1).toUpperCase() + typename.substr(1);

      try {
          theType.model = eval(objName + "Model");
      } catch (e) {
          theType.model = null;
          throw new UserException("NoModelDefined","You have tried to create generate a model " + objName + ", but we cant find the definition for it.");
      }
      
      if (theType.model) {   
          theType.extend(theType.model.classMethods);      
      }
      
      theType.join = [];

      
      for(var i in theType.model ) {
          if (i != "classMethods" && i != "instanceMethods" && i != "properties" ) {
              if (theType.model[i] == "has_n") {
                  theType.join.push(i);
              }
          }
      }
            
      return theType;
    };

