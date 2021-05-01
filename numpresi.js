var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
	console.log(camino);
	switch (camino) {
		case 'public/recuperardatos': {
			recuperar(pedido,respuesta);
			break;
		}	
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function recuperar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
        var num1 = formulario['num1'];
        var num2 = formulario['num2'];
        var resultado=EsPrimo(num1, num2);
		var pagina='<!doctype html><html><head></head><body>'+
					'Resultado:'+'<br>'+
					mostrarResults(resultado)+'<br>'+
					'<a href="index.html">Volver</a>'+
					'</body></html>';
		respuesta.end(pagina);
    });	
}

function primiador(num) {
    if (num<=1 || num%1) {
        return false;
    }
    let m=Math.sqrt(num);
    for (let i=2; i<=m; i++) {
        if (num%i==0) {
            return false;
        }
    }
    return true;
}

function EsPrimo(num1, num2){
    let final = num2;
    resultados = new Array();

    for (let i = num1; i <= final; i++) {
        let sumadigitos = 0;
        if (primiador(i)) {
            sumadigitos = i.toString().split('').reduce(function(r, n) { return r + parseInt(n) }, 0);
            if (primiador(sumadigitos)) {
                resultados.push(i);
            } 
        }
    }

    
    return resultados;
}

function mostrarResults(resultado) {
    resultado.forEach(element =>document.write( "Números primos: " + element + "<br />" ));

    return; 
}
console.log('Servidor web iniciado');