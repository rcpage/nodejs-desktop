using('System.Network.HTTP.WebPage');
using('Emerge.Business.Layout.SearchLayout');

class Search extends WebPage {

  ipv4(){
    return this._ipv4 = this._ipv4 || 0;
  }

  static get path(){
    return "/search";
  }

  ctor(req, res){
    let layout = new SearchLayout();
    this.html = layout.html;
    this.init(req, res, this.html);
    this.start();
    this.render();
  }

  start(){
    this.model = {};
    this.module = {};
    this.module.moment = System.getModule('moment');
    this.model.mongo = System.getModule('/stack/models/mongo');
  }

  numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  escapeHTML(html) {                                        
    return(                                                                 
      html.replace(/>/g,'&gt;').
      replace(/</g,'&lt;').
      replace(/"/g,'&quot;')
    );
  }

  onGet(){
    
    
    if(this.req.query.source=="ping"){
      this.async = true;
      this.httpPingService(this.req.query.secure == "true",
                           this.req.query.q, 
                           this.req.query.port || (this.req.query.secure=="true" ? 443:80), 
                           this.req.query.path || "/",
                           Number(this.req.query.timeout) || 1500,
                           endpoint => { 
        let startTime = Date.now(),
            self = this,
            q = this.req.query.q,
            source = this.req.query.source,
            start = Number(this.req.query.start || 0),
            limit = Number(this.req.query.limit || 10),
            next = start + limit,
            prev = start - limit,
            searchResultContainer = self.document.querySelector("#search-results");
        self.document.querySelector('#nav-search-input').setAttribute('value', q);
        self.document.querySelector('#search-results-took').innerHTML = Date.now() - startTime + " ms.";
        self.document.querySelector('#search-results-count').innerHTML = 1;
        self.document.querySelector('#search-results-total').innerHTML = 1;
        self.document.querySelector('#search-results-pages').innerHTML = '\
<a id="search-results-prev" href="?q='+q+'&source='+source+'&start='+prev+'" class="text-danger">Prev</a> \
<a id="search-results-next" href="?q='+q+'&source='+source+'&start='+next+'" class="text-danger">Next</a>';
        searchResultContainer.innerHTML = "";
        let searchResultTemplate = self.document.querySelector('#html-template .search-result').outerHTML.toString();
        searchResultTemplate = searchResultTemplate.replace('{$title}', (self.req.query.secure == "true"?'https':'http') + "://" + q);
        let status = "<b>Status:</b> "+ endpoint.status + "<br />",
            headers = "<b>Headers:</b> <pre>"+ JSON.stringify(endpoint.headers, null, 4) + "</pre>",
            data = '<b>Data:</b> <pre>'+ self.escapeHTML(endpoint.data) + '</pre>',
            took = "<b>Response Time:</b> "+ endpoint.took + "ms<br />";
        searchResultTemplate = searchResultTemplate.replace('{$summary}',  [status, took, headers, data].join(''));
        searchResultContainer.innerHTML = searchResultTemplate;
        self.async = false;
        self.httpResponse = self.dom.serialize();
        self.onComplete();
        //console.log(endpoint); 
      },   
                           error    => { console.log(error); });
    }
    else if(this.req.query.source=="ipv4"){
      this.searchIPv4Ping();
    }
    else if(this.req.query.source=="ipv4_ping"){
      this.searchIPv4Ping();
    }
    else {
      this.searchBusiness();
    }
  }

  customSearch(collection, customQuery, formatSearchResultHandle){
    this.async = true;
    let self = this, 
        q = this.req.query.q,
        source = this.req.query.source,
        start = Number(this.req.query.start || 0),
        limit = Number(this.req.query.limit || 10),
        next = start + limit,
        prev = start - limit,
        pageNo = start / limit,
        query = customQuery || { },
        selectAll = {},
        startTime = Date.now(),
        searchResultContainer = self.document.querySelector("#search-results");
    this.model.mongo.db.collections.count(collection, selectAll, function(err, totalRecords){
      self.model.mongo.db.collections.count(collection, query, function(err, queryCount){
        self.model.mongo.db.collections.search(collection, query, function(err, result){
          if(prev < 0) prev = 0;
          if(next >= totalRecords) next = start;
          self.document.querySelector('#nav-search-input').setAttribute('value', q);
          self.document.querySelector('#search-results-took').innerHTML = Date.now() - startTime + " ms.";
          self.document.querySelector('#search-results-count').innerHTML = queryCount;
          self.document.querySelector('#search-results-total').innerHTML = totalRecords;
          self.document.querySelector('#search-results-pages').innerHTML = '\
<a id="search-results-prev" href="?q='+q+'&source='+source+'&start='+prev+'" class="text-danger">Prev</a> \
<a id="search-results-next" href="?q='+q+'&source='+source+'&start='+next+'" class="text-danger">Next</a>';
          searchResultContainer.innerHTML = "";
          let searchResultTemplate = self.document.querySelector('#html-template .search-result').outerHTML.toString();
          for(let i=0;i<result.length;i++){
            if(formatSearchResultHandle) formatSearchResultHandle(searchResultTemplate, searchResultContainer, result[i]);
          }
          self.async = false;
          self.httpResponse = self.dom.serialize();
          self.onComplete();
        }, { limit: limit, skip: start });
      });
    });
  }


  httpPingService(secure, url, port, path, timeout, success, error){
    var http = System.getModule("http");
    var https = System.getModule("https");
    var Promise = System.getModule("bluebird");

    /**
 * Sends a 'GET /' request to a server and returns a promise that returns the round trip time in milliseconds.
 * @param url The destination url. E.g. www.google.com
 * @param port Optional: The port number of the destination. Defaults to 80
 * @returns Promise<{responseTime: number }> A promise that returns the round trip time in milliseconds. Returns -1 if an error occurred.
 * */
    function ping(secure, url, port, path, timeout) {
      var promise = new Promise(function (resolve, reject) {
        var result;
        var options = { host: url, port: port || (secure ? 443:80), path: path || '/', timeout: timeout || 30000 };
        console.log('ping', options);
        var start = Date.now();
        var pingRequest = (secure ? https:http).request(options, function (response) {
          response.setEncoding('utf8');
          let rawData = '';
          response.on('data', (chunk) => { rawData += chunk; });
          response.on('end', () => {
            try {
              result = {
                headers: response.headers,
                contentType: response.headers['content-type'],
                status: response.statusCode, 
                data: rawData, 
                took: Date.now() - start
              };
              resolve(result);
              pingRequest.abort();
            } catch (e) {
              console.error(e.message);
            }
          });
        });

        pingRequest.setTimeout(options.timeout);

        pingRequest.on('timeout', function() {
          result = url + " timeout. " + (options.timeout / 1000) + " seconds expired.";
          // Source: https://github.com/nodejs/node/blob/master/test/parallel/test-http-client-timeout-option.js#L27
          reject(result);
          pingRequest.destroy();
        });

        pingRequest.on("error", function (e) {
          result = e;
          reject(result);
          pingRequest.abort();
        });

        pingRequest.write("");
        pingRequest.end();
      });
      return promise;
    }
    ping(secure, url, port, path, timeout).then(success).catch(error);
  }

  searchIPv4Ping(){
    this.customSearch("ipv4_ping", { ipv4: { $regex: new RegExp(this.req.query.q, 'i') }}, function(template, container, item){
      let status = "Status: "+ item.response.status + "<br />",
          contentType = "Content Type: "+ item.response.contentType + "<br />",
          took = "Response Time: "+ item.response.took + "ms<br />";
      template = template.replace('{$title}', item.ipv4);
      if(item.response){
        template = template.replace('{$summary}', [status, contentType, took].join(''));
      } else {
        template = template.replace('{$summary}', 'No information has been collected.');
      }
      container.innerHTML += template;
    });
  }


  searchIPv4(){
    this.customSearch("ipv4", { ipv4: { $regex: new RegExp(this.req.query.q, 'i') }}, function(template, container, item){
      template = template.replace('{$title}', item.ipv4);
      template = template.replace('{$summary}', 'No information has been collected.');
      container.innerHTML += template;
    });
  }

  searchBusiness(){
    let self = this;
    this.customSearch("business", { name: { $regex: new RegExp(this.req.query.q, 'i') }}, function(template, container, item){
      let revenue = 'Revenue: $' + self.numberWithCommas(item.revenue) + "<br />",
          year = "Year: " + item.year + "<br />",
          source = "Source: " + item.source + "<br />",
          rank = "Rank: " + item.rank + "<br />",
          lastUpdated = "Last Updated: " + new Date(item.date).toDateString();
      template = template.replace('{$title}', item.name);
      template = template.replace('{$summary}', rank + revenue + year + source);
      container.innerHTML += template;
    });
  }

}


