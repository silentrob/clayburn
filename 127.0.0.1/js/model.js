TaskModel = {
    properties : {
        id : 'String',
        title: 'String',
        notes: 'String'
    },
    
    // Here is an example how validators work.
    
    // validations : {
    //     id: function(e) {
    //         if (e.title != "BLAH") {
    //             e.errors.push("The Title does not equal 'BLAH'");
    //         } else {
    //             return true;
    //         }
    //     }
    // },
    
    instanceMethods : {
        displayTitle: function() {
            return this.title.toUpperCase();
        }
    }
}

