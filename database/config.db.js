const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CONNECTION );

        console.log('.............................');
        console.log('>>> BASE DE DATOS ONLINE! <<<');
        console.log('>>>>> Conectados a MDB: <<<<<');
        console.log('.............................');
        console.log(">>> mi_log_jsonplaceholder <<");
        console.log('.............................');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD Mongo');
    }

}


module.exports = {
    dbConnection
}