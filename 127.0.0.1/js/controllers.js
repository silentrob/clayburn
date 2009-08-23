CommentsController = {    
    layout : 'application.html',
    
    index : function() {
        this.render("HERE");
    },
    show : function() {
        this.render();
    }
}

HomeController = {
    layout : 'application.html',
    
    index : function (data) { 

        // Test 1 - Display this text
        // this.render("This is how I work :)");
        
        // Test 2 - Display this template, or Error
        // this.render();
        
        // Test 2.b default action with 
        // this.render({layout:"application.html"});
                
        // Test 3 - Custom Template 
        // template can be any of the following ['baz','baz.html','home/baz.html',views/home/baz.html']
        // this.render({template:'/baz.html'});
        
        // Test 4 - Custom Layout
        // We have a controller wide layout, per-action layout, or false for no layout
        // this.render({template:'/baz.html', layout:'blah.html'});
    }
}

TasksController = {
    layout : 'application.html',
    
    index : function (p) {  

        var tasks = Task.search({});
        this.data.tasks = tasks || {};

        this.render();
    },
    
    show : function (data) {
        system.console.log(log(data));
        try {
           this.data.task = Task.get( data.id );
         } catch(e) {
           this.data.task = { id: null, title: null, notes: "no such task" };
         }
        this.render();
    },
    
    create : function(p) {

        var task = new Task();
        task.notes = p['notes'];
        task.title = p['title'];
        task.save();
        this.redirect('/tasks/index');
    },
    
    destroy : function (p) {
        try {
            var task = Task.get( p.id );
            task.remove();
        } catch(e) {

        }
        this.redirect("/tasks/index")
        
    }   
}

