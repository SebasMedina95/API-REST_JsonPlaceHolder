# INFORMACIÓN IMPORTANTE PARA EJECUCIÓN DEL PROYECTO.

# Se hicieron las pruebas usando POSTMAN
# Para los temas del log y la autenticación se uso una ``BD Mongo`` Local
    * Se debe crear una base de datos con el nombre:                      mi_log_jsonplaceholder.
    * Se crea una collection por defecto al crear la BD con el nombre:    users

    * Insertamos el objeto como un campo por defecto para poder logearnos y empezar a usar la API:
        Esta inserción debe realizarse en la collection que creamos llamada users

        {
            "name": "UsuarioPruebaI4Digital",
            "email": "usuarioi4@correo.com",
            "password": "$2a$10$SFPnvt6iwrbuji1bj63Vt.N8mQtne/p2wzQwbYkB/gA.Bw/V..Ydy",
            "avatar": "default.png",
            "status": true
        }
    
        Ahora con ese email y password podríamos logearnos para generar el token.
#       Recordemos que antes de abrir la aplicación, debemos re construir los módulos de Node

# Funcionamiento
#   ``Usuarios para el tema de autenticación y TOKENS``
    * Usando verbo POST - Proporcionamos email y password en el Body usando dorm-data al endpoint:  http://localhost:8081/api/auth/login
    * El login lo usamos con email y con password
    * El login anterior nos generara el campo Token, este es el que proporcionaremos en los headers de todas las aplicaciones. Si todo va bien tendremos una respuesta como la que se muestra a continuación: 

        {
            "status": "OK",
            "method": "Login del sistema desde el controlador",
            "message": "Se estableció la comunicación POST para logearse al sistema",
            "result_desc": "Usuario logeado correctamente",
            "result": {
                "user": {
                    "Nombre": "UsuarioPruebaI4Digital",
                    "Email": "usuarioi4@correo.com",
                    "avatar": "default.png"
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0YWUwNzE3Y2I4MGI5YzY4YjdlOTJiYiIsImVtYWlsIjoidXN1YXJpb2k0QGNvcnJlby5jb20iLCJhdmF0YXIiOiJkZWZhdWx0LnBuZyIsImlhdCI6MTY4OTEyNjY5NywiZXhwIjoxNjg5MjEzMDk3fQ.He6wH5a4jldm3rmQghENo5Oa5nHSyhWU91R1TM3WIJ8"
            }
        }

#   En los header de cada petición, ira el elemento myTokenAuth y como value irá el token que genera el login
#   Si no se proporciona el header con el token, lanzará mensajes de invalidez en la petición
#   Si el token venció, nos dirá que el token está vencido. ``El token dura 4 horas para este ejemplo``

    * Para la gestión de usuario podremos usar los endpoint:
        > (POST): http://localhost:8081/api/users
            Usando en el body form-data, podemos anexar en el campo avatar el tipo File para enviar archivos.
        > (GET): http://localhost:8081/api/users/64adfe47f6a4428639342ff2
            Obtenemos un usuario por el ID de Mongo
        > (PUT): http://localhost:8081/api/users/64adfe47f6a4428639342ff2

#   ``Para el consumo de JsonPlaceHolder: ``
    * Requerimos el logeo
    * Requerimos que los headers de las peticiones tengan el token

        •	(GET) Listar los usuarios (La variable limite es OPCIONAL, si la colocamos y le damos valor limitamos los resultados): 
#            http://localhost:8081/api/jsonplaceholder/logs/getUsers?limite=4
        •	(GET) Listar los posts (La variable limite es OPCIONAL, si la colocamos y le damos valor limitamos los resultados): 
#            http://localhost:8081/api/jsonplaceholder/logs/getPosts?limite=20
        •	(GET) Listar las photos (La variable limite es OPCIONAL, si la colocamos y le damos valor limitamos los resultados) – 
            Se hace una consulta “doble” para obtener primero los álbum por usuario y luego ya realizamos la busqueda de album que corresponde al usuario para las fotos : 
#            http://localhost:8081/api/jsonplaceholder/logs/getPhotos?id=2&limite=20
        •	(GET) Obtener el listado de logs : 
#            http://localhost:8081/api/jsonplaceholder/logs/getLogs
        •	(DELETE) Eliminar log por id: 
#            http://localhost:8081/api/jsonplaceholder/logs/64ae1fc72d1aa46f16bcd00c
        •	(PUT) Actualizar log por id, solo vamos a permitir actualizar el campo method, el cual se ubica en el Body: 
#            http://localhost:8081/api/jsonplaceholder/logs/64ae1f977f19f6e56121ec50 
        •	(GET) Exportar archivo: 
#            http://localhost:8081/api/jsonplaceholder/logs/getExport

