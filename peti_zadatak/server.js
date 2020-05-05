const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('query-string');
const PATH = "www/";

http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    if (req.method == "GET"){
        if (urlObj.pathname == "/"){ 
            fs.readFile(PATH + "index.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/sve-osobe"){ 
            res.writeHead(200);
            res.end(sveOsobe());
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/dodaj-osobu"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(dodajOsobu(querystring.parse(body).id,querystring.parse(body).ime,querystring.parse(body).prezime,
                querystring.parse(body).adresa));
            });
        }
        if (urlObj.pathname == "/postavi-adresu"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(postaviAdresu(querystring.parse(body).id, querystring.parse(body).adresa));
            });
        }
        if (urlObj.pathname == "/obrisi-osobu"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(obrisiOsobu(querystring.parse(body).id));
            });
        }
    }
}).listen(5000);

function sveOsobe(){
    const response  = JSON.parse(fs.readFileSync('osobe.json'));
    return JSON.stringify(response);
}

function postaviAdresu(id,adresa){
    let osobe = JSON.parse(sveOsobe());
    if(osobe.find(x => x.id == id) != undefined){
        osobe.find(x => x.id == id).adresa = adresa;
        fs.writeFileSync('osobe.json',JSON.stringify(osobe));
        return 'Uspesno izmenjena adresa osobe!';
    }
    else{
        return 'Ne postoji osoba sa unetim ID-em!';
    }
}
function obrisiOsobu(id){
    let osobe = JSON.parse(sveOsobe());
    if(osobe.find(x => x.id == id) != undefined){
        osobe = osobe.filter(x => x.id != id);
        fs.writeFileSync('osobe.json',JSON.stringify(osobe));
        return "Uspesno obrisana osoba!";
    }
    else{
        return 'Ne postoji osoba sa unetim ID-em!';
    }
}
function dodajOsobu(id,ime,prezime,adresa){
    let osobe = JSON.parse(sveOsobe());
    if(osobe.find(x => x.id == id) == undefined){
        osobe.push({'id':id,'ime':ime,'prezime':prezime,'adresa':adresa});
        fs.writeFileSync('osobe.json',JSON.stringify(osobe));
        return 'Uspesno dodata Osoba!';
    }
    else{
        return 'Osoba sa unetim ID-em vec postoji!';
    }
}