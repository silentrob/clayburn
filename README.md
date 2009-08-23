# Clayburn #

Clayburn is a light weight MVC Framework built on the [Joyent Smart Platform](http://becoming.smart.joyent.com/index.html ) Unlock the power of unlimited scaling with a full featured MVC.
If you are familiar with Ruby on Rails, Merb or Code Igniter, Clayburn should be easy to jump into.

## Getting Started ##

Included is a remake of the Task Example provided by Joyent, this should give you a general idea how everything works.

    $cd /clayburn
    $./run-smart.sh

### Router ###

    match('/index.html').to({ controller: 'Home', action: 'index' });

    // This will match anything that has 3 segments.
    // /a/b/c or /foo/bar/3 etc.
    match('/:controller/:action/:id').to();

    // This will match : /tasks/show/3
    // Redirect to Tasks Controller calling the show index and passinf in '3'
    match('/tasks/:action/:id').to({ controller: 'Tasks' });

    // This will match : /baz/fee/fi/foo/bar
    // Redirect to the Tasks Controller calling the fee action and passing in [ id:'fi', fish:'foo', sticks:'bar' ]
    match('/baz/:action/:id/:fish/:sticks').to({ controller: 'Tasks' });
    
    -- or --
    
    // This will generate an entire Restull route.    
    resources('tasks');


    
### Router API ###
**match(pattern = String)**
pattern:String - Pattern can be an path or url where you want the request to go, or a tokenized string. You can add anything you like.
    
**to(options = {})** 
options:Object - Optional, valid keys: controller, action

**resources(name = String)**
name:String - The name of the resource you want to create.

This generates routes for

- /name and /name/index  -- GET | POST
- /name/:id/show -- GET
- /name/new -- GET
- /name/:id/edit -- GET
- /name/:id/delete -- GET
- /name/:id -- GET | PUT | DELETE


To is chained together with match, it kicks off the request and makes everything work.
I successful request will need to have at the very least a controller and action either explicitly set in the to method, or from the pattern in the match method.
One other important note, all routes matched will handle any type of request: GET, POST, PUT and DELETE.
    
### Controller ###
  
    // Controller Mixin
  
    HomeController = {
      before : function() {
        // Run this code before any action
      },
      after : function() {
        // Run this code after any action
      },
      
      layout : "some_html_file.html", // Optional Controller wide Layout
      
      index : function (data) {  
        this.render();
      },

      home : function (data) {    
        this.render();
      }    
    }
    
### Controller API ###

All controllers are mixed into the Clayburn Controller and add these methods.

To pass data back to the views populate this.data with an object BEFORE you call render.
All Form data is passed into the controller.

**render(thing,options)**

- this.render("This is how I work :)");                     // Test 1 - Display this text
- this.render();                                            // Test 2 - Display this template, or Error
- this.render({layout:"application.html"});                 // Test 2.b default action with 
- this.render({template:'/baz.html'});                      // Test 3 - Custom Template 
- this.render({template:'/baz.html', layout:'blah.html'});  // Test 4 - Custom Layout

**display(thing,options)**

- More info coming soon.

**redirect(location)**

- this.redirect("/task/index");
  
### Exception Controller ###
Clayburn also supports raised exceptions, you can set, throw and override any exception.

To handle exceptions your own way, create a Exceptions Controller and name the method the name you want to catch.
Here is an example.

    ExceptionController = {
        JustBecause : function(e) {
            this.render("I want to handle this exception here... " + e.message);
            // Will render "I want to handle this exception here... because I can."
        }
    }
    
    . . . 
    // Some controller method...
    index : function (data) {  
      throw new UserException("JustBecause", "because I can.");      
      this.render();
    },

The Exception controller has all the same mixin methods provided by the main controller with some small exceptions. There is no before or after methods called.
  
### Views ###

All the views use EJS - [Embedded Javascript](http://embeddedjs.com/).

    <ul>
      <% for(var i = 0 ; i < tasks.length; i++ ) { %>
        <li><%= tasks[i].title %> <%= tasks[i].notes %></li>
      <% } %>
    </ul>
  

## Questions, Comments, Bugs ##

**Twitter**: rob_ellis    
**Email**: rob.ellis at nitobi.com

Feel free to email me any questions or comments. An Issue tracker will be setup soon, feel free to fork the code try it out or fix it :).


##The MIT License ##

Copyright (c) 2009 Rob Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.The MIT License
