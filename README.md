# Clayburn #

Clayburn is a light weight MVC Framework built on the Joyent Smart Platform. Unlock the power of unlimited scaling with a full featured MVC.
If you are familiar with Ruby on Rails, Merb or Code Igniter, Clayburn should be easy to jump into.

## Getting Started ##

Included is a remake of the Task Example provided by Joyent, this should give you a general idea how everything works.

    $cd /clayburn
    $./run-smart.sh

### Router ###

    match('/index.html').to({ controller: 'Home', action: 'index' });
    match('/:controller/:action/:id').to();
    
### Router API ###
- match(pattern)
- to() 
    
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

- render(thing,options)
  - this.render("This is how I work :)");                     // Test 1 - Display this text
  - this.render();                                            // Test 2 - Display this template, or Error
  - this.render({layout:"application.html"});                 // Test 2.b default action with 
  - this.render({template:'/baz.html'});                      // Test 3 - Custom Template 
  - this.render({template:'/baz.html', layout:'blah.html'});  // Test 4 - Custom Layout
- display(thing,options)
  - More info coming soon. 
- redirect(location)
  - this.redirect("/task/index");
  
### Views ###

All the views use EJS - Embedded Javascript.

    <ul>
      <% for(var i = 0 ; i < tasks.length; i++ ) { %>
        <li><%= tasks[i].title %> <%= tasks[i].notes %></li>
      <% } %>
    </ul>
  


##The MIT License ##

Copyright (c) 2009 Rob Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.The MIT License
