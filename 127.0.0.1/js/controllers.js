TasksController = {
    layout : 'application.html',
    
    index : function (p) {  
        
        this.data.tasks = Task.all();    
        this.data.task = new Task();
        this.render();
    },
    
    show : function (data) {
        try {
           this.data.task = Task.get( data.id );
         } catch(e) {
           this.data.task = { id: null, title: null, notes: "no such task" };
         }
        this.render();
    },
    
    create : function(p) {
        var task = new Task(p);
        if (task.save()) {
            this.redirect('index');        
        } else {
            this.data.tasks = Task.all();
            this.data.task = task;
            this.render({template:'index'});
        }
        

    },
    
    destroy : function (p) {
        var task = Task.get( p.id );
        task.remove();
        this.redirect("index")
    }   
}

