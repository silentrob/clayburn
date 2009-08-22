system.use("config");
system.use("lib.clayburn");
system.use("controllers");

system.use("com.joyent.Resource");
var Task = new Resource('task');

/*
// Very expieremental Full Resources coming soon.
 Generates 
    /tasks/index        GET
    /tasks/:id/show     GET
    /tasks/new          GET | POST
    /tasks/update       PUT
    /tasks/:id/edit     GET | PUT
    /tasks/:id/delete   GET | DELETE        
*/

// Resources are always in plural form.
// resources('comments');

match('/').to({ controller: 'Task', action: 'index' });

match('/:controller/:action/:id').to();
match('/:controller/:action').to();








