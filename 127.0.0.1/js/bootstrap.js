system.use("com.joyent.Resource");

system.use("config");
system.use("lib.clayburn");
system.use("controllers");

var Task = new Resource('task');

/*
 Generates 
    /tasks/index        GET
    /tasks/:id/show     GET
    /tasks/new          GET | POST
    /tasks/update       PUT
    /tasks/:id/edit     GET | PUT
    /tasks/:id/delete   GET | DELETE        
*/


// resources('task');
// resources('task', {member : {woot : 'get'}} );
// resources('post/comments');
// route('task', ['comments','blah']);

// match('/index/:something').to({ controller: 'Home', action: 'index'}); 

//match('/index.html').to({ controller: 'Home', action: 'index' });
match('/').to({ controller: 'Task', action: 'index' });


match('/:controller/:action/:id').to();
match('/:controller/:action').to();








