system.use("config");
system.use("clayburn.init");

system.use("controllers");
system.use("model");

// Generating a Task Model
var Task = new Model('task');

resources('tasks');

match('/').to({ controller: 'Tasks', action: 'index' });









