import { Low } from 'lowdb';                  //Импорт модуля локальной базы данных JSON
import { JSONFile } from 'lowdb/node'; 

export async function localDBInit(filename = 'option.json'){
    return new Promise((resolve, reject)=>{
        const adapter = new JSONFile(filename); //Подключение файла JSON с параметрами отладки как локальной БД
        const DB = new Low(adapter);
        DB.read().then(function(){
            resolve(DB.data);
        });
    });
};