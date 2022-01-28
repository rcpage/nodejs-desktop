global.System = require('./System.js');
using('System.Network.WebApi');
using('System.Network.HTTP.Microservice');
using('System.Network.HTTP.Session.MongoDBSession');

class Example extends Microservice {
    static get path() {
        return ["/microservice"]
    }

    GET() {
        console.log("GET", this.req.query);
        this.res.json(this.req.query);
    }

    POST() {
        console.log("POST", this.req.post);
        this.res.json(this.req.post);
    }
}

var webAPI = new WebApi([Example]);
webAPI.start(8090);