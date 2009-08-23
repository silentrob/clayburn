system.use("config");
system.use("lib.clayburn");
system.use("controllers");

system.use("com.joyent.Resource");
var Task = new Resource('task');

/*
// Very expieremental Full Resources coming soon.
 Generates 
    -- /task or /task/index 
    -- /task/:id/show           
    -- /task/new                
    -- /task/:id/edit           
    -- /task/:id/delete         
    -- /task/:id                      
*/

resources('tasks');

match('/').to({ controller: 'Tasks', action: 'index' });

// match('/:controller/:action/:id').to();
// match('/:controller/:action').to();








