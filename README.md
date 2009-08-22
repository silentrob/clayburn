# Clayburn #

Clayburn is a light weight MVC Framework built on the Joyent Smart Platform. Unlock the power of unlimited scaling with a full featured MVC.
If you are familiar with Ruby on Rails, Merb or Code Igniter, Clayburn should be easy to jump into.

## Getting Started ##

    $cd /clayburn
    $./run-smart.sh

### Router ###

    match('/index.html').to({ controller: 'Home', action: 'index' });
    match('/:controller/:action/:id').to();
    
### Controller ###
  
    HomeController = {
      index : function (data) {  
        this.render();
      },

      home : function (data) {    
        this.render();
      }    
    }
  
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
