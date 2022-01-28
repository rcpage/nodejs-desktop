using('System.Network.PublicFileService');
using('System.Network.HTTP.HTTPStatusCode');
using('System.Network.HTTP.Microservice');
class payment extends Microservice {

  static get model() {
    return System.getModule(global.rootDirectory + '/models/payment.js');
  }

  static get path() {
    return ['localhost:8090/v1/payment', 'localhost:8090/v1/payment/{context}', 'localhost:8090/v1/payment/{context}/{action}'];
  }

  static getFunctionParams(func) {
    return (func + '')
      .replace(/[/][/].*$/mg, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
      .replace(/=[^,]+/g, '') // strip any ES6 defaults  
      .split(',').filter(Boolean); // split & filter [""]
  }

  GET() {
    this.executeAction();
  }
  POST() {
    this.executeAction();
  }

  executeAction() {
    this.res.setHeader('Access-Control-Allow-Origin', '*');
    //
    var context = this.req.pathParam.context,
      action = this.req.pathParam.action,
      fn = null,
      defaultHandle = (err, result) => this.res.json([err, result]);
    switch (context) {
      case "list":
        fn = payment.model.list;
        fn.apply(fn, [this.getParamObject(['startIndex', 'count']), defaultHandle]);
        break;
      case "creditCard":
        fn = payment.model.creditCard[action];
        switch (action) {
          case "list":
            fn.apply(fn, [defaultHandle]);
            break;
          case "payment":
          case "get":
          case "delete":
            fn.apply(fn, [this.getRequestParameter('id'), defaultHandle]);
            break;
          case "save":
            fn.apply(fn, [this.getParamObject([
              'type',
              'number',
              'expMonth',
              'expYear',
              'code',
              'firstName',
              'lastName']), defaultHandle]);
            break;
          case "sale":
            fn.apply(fn, [this.getParamObject([
              'cardType',
              'cardNumber',
              'cardExpMonth',
              'cardExpYear',
              'cardCode',
              'firstName',
              'lastName',
              'billingAddress',
              'billingCity',
              'billingState',
              'billingZip',
              'countryCode',
              'dueNow',
              'description'
            ]), defaultHandle]);
            break;
          case "refund":
            fn.apply(fn, [this.getRequestParameter('id'), this.getRequestParameter('amount'), defaultHandle]);
            break;
        }
        break;
      case 'invoice':
        fn = payment.model.invoice[action];
        //fn((err, result)=>this.res.json([err, result]));
        //return;
        var method = fn;
        if (method) {
          var cmd_args = payment.getFunctionParams(method);
          console.log(method.name, cmd_args);
          var args = [], params = [];
          if (method.name == "createInvoice") {
            args.push(this.getParamObject([
              'firstName',
              'lastName',
              'email',
              'businessName',
              'phone',
              'address',
              'city',
              'state',
              'zip',
              'countryCode',
              'items',
              'note',
              'dueNow'
            ]));
          }
          else if (method.name == "recordPayment") {
            args.push(this.getRequestParameter('id'));
            args.push(this.getParamObject([
              'method',
              'date',
              'note'
            ]));
          }
          else {
            for (var i = 0; i < cmd_args.length - 1; i++) {
              var arg = cmd_args[i],
                val = this.getRequestParameter(arg);
              console.log('parameter...' + arg + "=" + val);
              args.push(val);
            }
          }
          //add default callback handler
          args.push(defaultHandle);
          //invoke method with parameters
          method.apply(fn, args);
        }
        else {
          console.log(`${action} not supported. Please type help command for more information.`);
          this.res.end();
        }
        break;
      default:
        this.res.json(this.printKeyNames("payment", payment.model));
    }
  }

  getParamObject(params) {
    var obj = {};
    for (var i in params) {
      var arg = params[i],
        val = this.getRequestParameter(arg);
      obj[arg] = val;
    }
    return obj;
  }

  printKeyNames(name, obj, list) {
    var result = list || [],
      keys = Object.keys(obj);
    for (var i in keys) {
      var keyName = keys[i],
        parentName = name + "." + keyName,
        parentObj = obj[keyName];
      if (!this.isFunction(parentObj)) {
        result = this.printKeyNames(parentName, parentObj, result);
      } else {
        result.push([parentName, payment.getFunctionParams(parentObj)]);
      }
    }
    return result;
  }

  isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }



}
