function GodaddyAPI(){
	var domainService = new V1Domains();
	
	
	function UnitTest(domain){
		domainService.available(domain,function(data){
		   console.log(JSON.parse(data));
		});
		domainService.suggest(domain,function(data){
		   console.log(JSON.parse(data));
		});
	}
	
	UnitTest('vrtx.io');
}