using('System.Network.HTTP.Microservice');

class pipe extends Microservice {

  static get path() {
    return ["localhost:8090/v1/pipe",
      //HTTP
      "localhost:8090/v1/pipe/http/{host}",
      //"localhost:8090/v1/pipe/http/{host}/{cookie}",
      //HTTPS
      "localhost:8090/v1/pipe/https/{host}",
      //"localhost:8090/v1/pipe/https/{host}/{cookie}"
    ];
  }


  static GET() {
    pipe.request(this.req, this.res);
  }

  static request(req, res, options) {
    let httpProxy = System.getModule('http-proxy');
    //
    // Create a proxy server with custom application logic
    //
    this.proxy = httpProxy.createProxyServer(options || { xfwd: true, ws: true });

    //
    // Listen for the `error` event on `proxy`.
    //
    this.proxy.on('error', (err, req, res) => {
      console.log('error', err);
      res.status(HTTPStatusCode.InternalServerError).end();
    });

    //
    //proxy request
    //
    var hostPathParam = (req.pathParam && req.pathParam.host);
    let host = hostPathParam || req.post.host || req.query.host;
    if (host) {

      if (host.startsWith("http") == false) {
        host = "http://" + host;
      }
      let target = host + '/' + (req.query.path || "") + (req.URL.search || "");
      console.log(req.url, 'piping target...', target);

      this.proxy.web(req, res, {
        //auth: true,
        target: target,
        headers: {
          'x-forwarded-timestamp': Date.now(),
          'Cookie': req.query.cookie
        }
      });
    }
    else res.end('Please provide host information.');
  }
}
