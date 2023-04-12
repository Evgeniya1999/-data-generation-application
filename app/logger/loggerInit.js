import * as winston from 'winston';                     //Импорт модуля логирования
import 'winston-daily-rotate-file';                     //Импорт модуля дополнительного транспорта логирования

async function loggerInit(datePattern = 'YYYY-MM-DD-THH-mm', filename = 'log', maxSize = '10m', zip = true, maxFiles = '30d'){
    return new Promise((resolve, reject)=>{
        let transports  = [];                           //Новый массив под параметры транспорта логгера
        transports.push(
            new winston.transports.DailyRotateFile({
                datePattern: datePattern,
                filename: filename,
                maxSize: maxSize,
                zippedArchive: zip,
                maxFiles: maxFiles
            })
        );
        var logger = new winston.createLogger({         //Инициализация логгера для сообщений
            format: winston.format.json(),
            transports: transports 
        });
        resolve(logger);
    });
};

export {loggerInit};