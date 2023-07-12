const path = require('path');
const { v4: uuidv4 } = require('uuid');

const extensionesDefault = ['png' , 'jpg' , 'jpeg' , 'gif'];


const subirArchivoUsuario = ( files , extValidas = extensionesDefault, directory = '' ) => {

    return new Promise ( (resolve, reject) => {

        const { avatar } = files;

        const cutName = avatar.name.split('.');
        const ext = cutName[cutName.length-1];

        const permitedExt = extValidas;
        if(!permitedExt.includes(ext)){
            return reject(`La extensión ${ext} no es permitida, solo se permiten ${extValidas}`);
        }

        if(avatar.size > 4000000){
            return reject('El archivo subido no debe exceder los 4MB de peso');
        }

        const temporalName = uuidv4() + "." + ext;

        //Determinamos donde enviaremos el avatar capturado
        const uploadPath = path.join( __dirname, '../uploads/' , directory,  temporalName );

        //Realizamos el mover, moveremos la imagen a donde indicamos anteriormente con mv
        avatar.mv(uploadPath, (err) => {
            
            if (err) {
                return reject(err)
            }

            resolve(temporalName);

        });

    });

}


const subirArchivo = ( files , extValidas = extensionesDefault, directory = '' ) => {

    return new Promise ( (resolve, reject) => {

        const { file } = files;

        const cutName = file.name.split('.');
        const ext = cutName[cutName.length-1];

        const permitedExt = extValidas;
        if(!permitedExt.includes(ext)){
            return reject(`La extensión ${ext} no es permitida, solo se permiten ${extValidas}`);
        }

        if(file.size > 2000000){
            return reject('El archivo subido no debe exceder los 2MB de peso');
        }

        const temporalName = uuidv4() + "." + ext;

        //Determinamos donde enviaremos el file capturado
        const uploadPath = path.join( __dirname, '../uploads/' , directory,  temporalName );

        //Realizamos el mover, moveremos la imagen a donde indicamos anteriormente con mv
        file.mv(uploadPath, (err) => {
            
            if (err) {
                return reject(err)
            }

            resolve(temporalName);

        });

    });

}



module.exports = {
    subirArchivoUsuario,
    subirArchivo
}