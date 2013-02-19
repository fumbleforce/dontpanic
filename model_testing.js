var models = require('./server/js/models.js'),
    zone1 = new models.zone("type", 100, "nodes", "adjacent_zones", 10);
    
console.log(zone1.type);
    

