import {Connection, createConnection, getConnectionOptions} from 'typeorm';

// createConnection();

export default async():Promise<Connection>=>{
    const defaultOptions = await getConnectionOptions(); //tenho acesso a todas as informações dentro do ormconfig
    
    return createConnection( //** */
        Object.assign(defaultOptions,{
            database: process.env.NODE_ENV === 'test'
            ? "./src/database/database.teste.sqlite" 
            : defaultOptions.database
        })
    );
};

//**Pega nosso objeto criado e sobrescreve o valor informado no segundo parametro */