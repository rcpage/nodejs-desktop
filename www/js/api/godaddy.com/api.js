const PORT = 8080;
const HOST = 'http://localhost:' + PORT;
const SERVICE_NAME = '/api/godaddy';

/* resourcePath: /v1/cloud/images */
function V1CloudImages() {

    /* /v1/cloud/images/{imageId} */
    //Find image by image imageId
    function getImageById(imageId) {
        return "https://api.godaddy.com/v1/cloud/images/{imageId}?imageId=" + imageId + "";
    }

    /* /v1/cloud/images/{imageId}/destroy */
    //Destroy an image
    function destroyImage(imageId) {
        return "https://api.godaddy.com/v1/cloud/images/{imageId}/destroy?imageId=" + imageId + "";
    }

    /* /v1/cloud/images */
    //Get a list of images. By default, only LIVE images are returned
    function getImageList(name, version, status, type, sourceServerId, sizeMb, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/images?name=" + name + "&version=" + version + "&status=" + status + "&type=" + type + "&sourceServerId=" + sourceServerId + "&sizeMb=" + sizeMb + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/images */
    //Create a new image
    function addImage(body) {
        return "https://api.godaddy.com/v1/cloud/images?body=" + body + "";
    }

    /* /v1/cloud/images/{imageId}/actions/{imageActionId} */
    //Get ImageAction by id
    function getImageActionById(imageId, imageActionId) {
        return "https://api.godaddy.com/v1/cloud/images/{imageId}/actions/{imageActionId}?imageId=" + imageId + "&imageActionId=" + imageActionId + "";
    }

    /* /v1/cloud/images/{imageId}/actions */
    //List of actions performed on images
    function getImageActionList(imageId, type, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/images/{imageId}/actions?imageId=" + imageId + "&type=" + type + "&limit=" + limit + "&offset=" + offset + "";
    }
}
/* resourcePath: /v1/cloud/specs */
function V1CloudSpecs() {

    /* /v1/cloud/specs/{specId} */
    //Find spec by spec specId
    function getSpecById(specId) {
        return "https://api.godaddy.com/v1/cloud/specs/{specId}?specId=" + specId + "";
    }

    /* /v1/cloud/specs */
    //Get a list of specs
    function getSpecList(name, status, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/specs?name=" + name + "&status=" + status + "&limit=" + limit + "&offset=" + offset + "";
    }
}
/* resourcePath: /v1/cloud/usage */
function V1CloudUsage() {

    /* /v1/cloud/usage */
    //Retrieve server usage data for a specified date range.
    function getUsage() {
        return "https://api.godaddy.com/v1/cloud/usage?";
    }
}
/* resourcePath: /v1/cloud/addresses */
function V1CloudAddresses() {

    /* /v1/cloud/addresses */
    //List addresses
    function getAddressList(address, serverId, status, type, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/addresses?address=" + address + "&serverId=" + serverId + "&status=" + status + "&type=" + type + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/addresses */
    //Create a new dynamic IPv4 address
    function addAddress() {
        return "https://api.godaddy.com/v1/cloud/addresses?";
    }

    /* /v1/cloud/addresses/{addressId} */
    //Find address by id
    function getAddressById(addressId) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}?addressId=" + addressId + "";
    }

    /* /v1/cloud/addresses/{addressId}/attach */
    //Attach an address to a server
    function attachAddress(addressId, body) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}/attach?addressId=" + addressId + "&body=" + body + "";
    }

    /* /v1/cloud/addresses/{addressId}/detach */
    //Detach an address from a server
    function detachAddress(addressId) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}/detach?addressId=" + addressId + "";
    }

    /* /v1/cloud/addresses/{addressId}/destroy */
    //Destroy an address
    function destroyAddress(addressId) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}/destroy?addressId=" + addressId + "";
    }

    /* /v1/cloud/addresses/{addressId}/actions */
    //List actions performed on an Address
    function getAddressActionList(addressId, type, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}/actions?addressId=" + addressId + "&type=" + type + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/addresses/{addressId}/actions/{addressActionId} */
    //Find AddressAction by id
    function getAddressActionById(addressId, addressActionId) {
        return "https://api.godaddy.com/v1/cloud/addresses/{addressId}/actions/{addressActionId}?addressId=" + addressId + "&addressActionId=" + addressActionId + "";
    }
}
/* resourcePath: /v1/cloud/sshKeys */
function V1CloudSshKeys() {

    /* /v1/cloud/sshKeys/{sshKeyId} */
    //Find SSH key by sshKeyId
    function getSSHKeyById(sshKeyId) {
        return "https://api.godaddy.com/v1/cloud/sshKeys/{sshKeyId}?sshKeyId=" + sshKeyId + "";
    }

    /* /v1/cloud/sshKeys/{sshKeyId} */
    //Delete a SSH key resource
    function deleteSSHKey(sshKeyId) {
        return "https://api.godaddy.com/v1/cloud/sshKeys/{sshKeyId}?sshKeyId=" + sshKeyId + "";
    }

    /* /v1/cloud/sshKeys */
    //Get a list of SSH keys.
    function getSSHKeyList(name, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/sshKeys?name=" + name + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/sshKeys */
    //Create a new SSH key
    function addSSHKey(body) {
        return "https://api.godaddy.com/v1/cloud/sshKeys?body=" + body + "";
    }
}
/* resourcePath: /v1/shoppers */
function V1Shoppers() {

    /* /v1/shoppers/{shopperId} */
    //Update details for the specified Shopper
    function update(shopperId, shopper) {
        return "https://api.ote-godaddy.com/v1/shoppers/{shopperId}?shopperId=" + shopperId + "&shopper=" + shopper + "";
    }

    /* /v1/shoppers/{shopperId} */
    //Get details for the specified Shopper
    function get(shopperId) {
        return "https://api.ote-godaddy.com/v1/shoppers/{shopperId}?shopperId=" + shopperId + "";
    }

    /* /v1/shoppers */
    //Create a Shopper
    function create() {
        return "https://api.ote-godaddy.com/v1/shoppers?";
    }

    /* /v1/shoppers/subaccount */
    //Create a Subaccount owned by the authenticated Reseller
    function createSubaccount(subaccount) {
        return "https://api.ote-godaddy.com/v1/shoppers/subaccount?subaccount=" + subaccount + "";
    }
}
/* resourcePath: /v1/cloud/servers */
function V1CloudServers() {

    /* /v1/cloud/servers/{serverId} */
    //Find server by serverId
    function getServerById(serverId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}?serverId=" + serverId + "";
    }

    /* /v1/cloud/servers */
    //Create a new server
    function addServer(body) {
        return "https://api.godaddy.com/v1/cloud/servers?body=" + body + "";
    }

    /* /v1/cloud/servers */
    //Get a list of servers. By default, all destroyed servers are filtered out.
    function getServerList(status, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/servers?status=" + status + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/servers/{serverId}/destroy */
    //Destroy an existing server
    function destroyServer(serverId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/destroy?serverId=" + serverId + "";
    }

    /* /v1/cloud/servers/{serverId}/start */
    //Start a server
    function startServer(serverId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/start?serverId=" + serverId + "";
    }

    /* /v1/cloud/servers/{serverId}/stop */
    //Stop a server
    function stopServer(serverId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/stop?serverId=" + serverId + "";
    }

    /* /v1/cloud/servers/{serverId}/console */
    //Get a console URL to this server
    function console(serverId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/console?serverId=" + serverId + "";
    }

    /* /v1/cloud/servers/{serverId}/addresses/{addressId} */
    //Find Addresses by serverId and addressId
    function getServerAddressById(serverId, addressId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/addresses/{addressId}?serverId=" + serverId + "&addressId=" + addressId + "";
    }

    /* /v1/cloud/servers/{serverId}/addresses */
    //List of Addresses of the specified server
    function getServerAddressList(serverId, address, status, type, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/addresses?serverId=" + serverId + "&address=" + address + "&status=" + status + "&type=" + type + "&limit=" + limit + "&offset=" + offset + "";
    }

    /* /v1/cloud/servers/{serverId}/actions/{serverActionId} */
    //Get ServerAction by id
    function getServerActionById(serverId, serverActionId) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/actions/{serverActionId}?serverId=" + serverId + "&serverActionId=" + serverActionId + "";
    }

    /* /v1/cloud/servers/{serverId}/actions */
    //List of actions performed on the specified server
    function getServerActionList(serverId, type, limit, offset) {
        return "https://api.godaddy.com/v1/cloud/servers/{serverId}/actions?serverId=" + serverId + "&type=" + type + "&limit=" + limit + "&offset=" + offset + "";
    }
}
/* resourcePath: /v1/domains */
function V1Domains(serviceName) {

    /* /v1/domains/{domain} */
    //Update details for the specified Domain
    function update(domain, XShopperId, body) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}?domain=" + domain + "&X-Shopper-Id=" + XShopperId + "&body=" + body + "";
    }

    /* /v1/domains/{domain} */
    //Cancel a purchased domain
    function cancel(domain) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}?domain=" + domain + "";
    }

    /* /v1/domains/{domain} */
    //Retrieve details for the specified Domain
    function get(XShopperId, domain) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "";
    }

    /* /v1/domains/available */
    //Determine whether or not the specified domain is available for purchase
    function available(domain, checkType, forTransfer, waitMs) {
        return "https://api.ote-godaddy.com/v1/domains/available?domain=" + domain + "&checkType=" + checkType + "&forTransfer=" + forTransfer + "&waitMs=" + waitMs + "";
    }

    /* /v1/domains */
    //Retrieve a list of Domains for the specified Shopper
    function list(XShopperId, limit, marker, includes) {
        return "https://api.ote-godaddy.com/v1/domains?X-Shopper-Id=" + XShopperId + "&limit=" + limit + "&marker=" + marker + "&includes=" + includes + "";
    }

    /* /v1/domains/{domain}/privacy */
    //Submit a privacy cancellation request for the given domain
    function cancelPrivacy(XShopperId, domain) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/privacy?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "";
    }

    /* /v1/domains/{domain}/contacts */
    //Update domain
    function updateContacts(XShopperId, domain, contacts) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/contacts?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&contacts=" + contacts + "";
    }

    /* /v1/domains/{domain}/verifyRegistrantEmail */
    //Re-send Contact E-mail Verification for specified Domain
    function verifyEmail(XShopperId, domain) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/verifyRegistrantEmail?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "";
    }

    /* /v1/domains/tlds */
    //Retrieves a list of TLDs supported and enabled for sale
    function tlds() {
        return "https://api.ote-godaddy.com/v1/domains/tlds?";
    }

    /* /v1/domains/purchase */
    //Purchase and register the specified Domain
    function purchase(XShopperId, body) {
        return "https://api.ote-godaddy.com/v1/domains/purchase?X-Shopper-Id=" + XShopperId + "&body=" + body + "";
    }

    /* /v1/domains/purchase/schema/{tld} */
    //Retrieve the schema to be submitted when registering a Domain for the specified TLD
    function schema(tld) {
        return "https://api.ote-godaddy.com/v1/domains/purchase/schema/{tld}?tld=" + tld + "";
    }

    /* /v1/domains/purchase/validate */
    //Validate the request body using the Domain Purchase Schema for the specified TLD
    function validate(body) {
        return "https://api.ote-godaddy.com/v1/domains/purchase/validate?body=" + body + "";
    }

    /* /v1/domains/agreements */
    //Retrieve the legal agreement(s) required to purchase the specified TLD and add-ons
    function getAgreement(tlds, privacy) {
        return "https://api.ote-godaddy.com/v1/domains/agreements?tlds=" + tlds + "&privacy=" + privacy + "";
    }

    /* /v1/domains/{domain}/records/{type?}/{name?} */
    //Retrieve DNS Records for the specified Domain, optionally with the specified Type and/or Name
    function recordGet(XShopperId, domain, type, name, offset, limit) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/records/{type?}/{name?}?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&type=" + type + "&name=" + name + "&offset=" + offset + "&limit=" + limit + "";
    }

    /* /v1/domains/{domain}/records */
    //Replace all DNS Records for the specified Domain
    function recordReplace(XShopperId, domain, records) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/records?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&records=" + records + "";
    }

    /* /v1/domains/{domain}/records */
    //Add the specified DNS Records to the specified Domain
    function recordAdd(XShopperId, domain, records) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/records?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&records=" + records + "";
    }

    /* /v1/domains/{domain}/records/{type} */
    //Replace all DNS Records for the specified Domain with the specified Type
    function recordReplaceType(XShopperId, domain, type, records) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/records/{type}?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&type=" + type + "&records=" + records + "";
    }

    /* /v1/domains/{domain}/records/{type}/{name} */
    //Replace all DNS Records for the specified Domain with the specified Type and Name
    function recordReplaceTypeName(XShopperId, domain, type, name, records) {
        return "https://api.ote-godaddy.com/v1/domains/{domain}/records/{type}/{name}?X-Shopper-Id=" + XShopperId + "&domain=" + domain + "&type=" + type + "&name=" + name + "&records=" + records + "";
    }

    /* /v1/domains/suggest */
    //Suggest alternate Domain names based on a seed Domain or set of keywords
    function suggest(XShopperId, query, country, city, sources, tlds, lengthMax, lengthMin, limit, waitMs) {
        return "https://api.ote-godaddy.com/v1/domains/suggest?X-Shopper-Id=" + XShopperId + "&query=" + query + "&country=" + country + "&city=" + city + "&sources=" + sources + "&tlds=" + tlds + "&lengthMax=" + lengthMax + "&lengthMin=" + lengthMin + "&limit=" + limit + "&waitMs=" + waitMs + "";
    }

    function suggest(query) {
        return "https://api.ote-godaddy.com/v1/domains/suggest?query=" + query;
    }

    function fetchURL(serviceURL, cb) {
        $.get(HOST + SERVICE_NAME + '?url=' + serviceURL, function (data) {
            if (cb != null) cb(data);
        });
    }

    this.suggest = function (domain, cb) {
        var serviceURL = encodeURIComponent(suggest(domain));
        fetchURL(serviceURL, cb);
    }

    this.available = function (domain, cb) {
        var serviceURL = encodeURIComponent(available(domain, "FAST", false, 1000));
        fetchURL(serviceURL, cb);
    }
}
/* resourcePath: /v1/cloud/limits */
function V1CloudLimits() {

    /* /v1/cloud/limits */
    //Get resource limits for your Cloud account
    function getLimits() {
        return "https://api.godaddy.com/v1/cloud/limits?";
    }
}