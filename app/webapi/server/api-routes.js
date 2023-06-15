import { logMessage } from '../../logger/logger.js';         //Импорт модулей логгера
import moment from 'moment';                         //Импорт модуля работы со временем
import clc from 'cli-color';                      //Импорт модуля управления цветом консоли
import express from 'express';
import http from 'http'                         //Импорт модуля работы с http

export async function postTaskExecute(request = express.request, response = express.response, logger, DBG = {}, code, n) {

    let dateStart = new Date();
    logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ЗАПРОС] Запрос подключения " + request.socket.remoteAddress + ":" + request.socket.remotePort, '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
    response.setHeader("Content-Type", "application/json"); //Заголовок
    response.setHeader("Date", moment(new Date()).format("ddd, D MMM YYYY HH:mm:ss ZZ")); //Заголовок
    response.status(code)
    let dateEnd = new Date();
    logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Времени затрачено " + moment.utc(dateEnd - dateStart).format("HH:mm:ss.SSS"), '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
    if (code === 200) {
        try {
            /*const options = {
                host: '127.0.0.1',
                port: 9589,
                path: '/data/set/task/in',
                method: 'POST',
                timeout:5000,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(JSON.stringify(await postTaskOut()))
                }
            };*/
            let dateStart1 = new Date();
            let request;
            //let z = 0;
            for (let i = 1; i <= 100; i++) {
                const dataToSend = await postTaskOut();
                const options = {
                    host: '127.0.0.1',
                    port: 9589,
                    path: '/data/set/task/in',
                    method: 'POST',
                    timeout:5000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(JSON.stringify(dataToSend))
                    }
                };
                request = http.request(options, async (res) => {
                    if (res.statusCode != 200) {
                        ; //В случае ошибки

                        let dateEnd2 = new Date();
                        logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Времени затрачено на неисполненный запрос " + moment.utc(dateEnd2 - dateStart1).format("HH:mm:ss.SSS"), '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.red);
                        console.log(i + " Запрос не выполнен");
                        console.error(`Did not get an OK from the server. Code: ${res.statusCode} ${JSON.stringify(res.headers)}`);
                        //Неправильное решение повторного отправления, так как с другой стороны данные не были добавлены в СУБД
                        // if (res.statusCode === 408) {
                        //     request.write(JSON.stringify(await postTaskOut())); //Отправка параметров
                        //     console.log((i + " Запрос отправлен повторно"))
                        //     request.end(); //Завершение запроса
                        //     logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Времени затрачено: " + moment.utc(dateEnd1 - dateStart1).format("HH:mm:ss.SSS"), '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
                        //     console.log(i + " Запрос выполнен");
                        // }
                    }
                });
                request.write(JSON.stringify(dataToSend)); //Отправка параметров

                request.end(); //Завершение запроса

                let dateEnd1 = new Date();

                request.on('response', () => { //При получении ответа на запрос
                    logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Времени затрачено: " + moment.utc(dateEnd1 - dateStart1).format("HH:mm:ss.SSS"), '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
                    console.log(i + " Запрос выполнен");
                });
                request.on('error', err => { //При ошибке
                    logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ERROR] ПОТЕРЯ СОЕДИНЕНИЯ " + err.code + " " + err.message + " ", "", "", 'error', DBG.cli_trace_msg, DBG.log_msg, clc.red);
                });
            };
        } catch (err) {
            console.log(err)
        }
    }
}


export async function postTaskOut() {
    function Rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //internalid

    //orderId
    //"2023-0004-0012-00090"
    var rnum = (Rand(0, 10000)).toString().padStart(5, "0")
    var d = moment(new Date()).format("YYYY-00MM-00DD")
    var ord = d + "-" + rnum
    //console.log(ord)

    //destination
    //"01"-"08"
    var dest = (Rand(1, 8)).toString().padStart(2, "0")
    //console.log(dest);

    //time
    //"2021-11-17T12:25:36"
    var t = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
    //console.log(t)

    //printData
    //"задание №"
    var prd = "Задание " + Rand(0, 10000)
    //console.log(prd)

    //source
    //"01"-"08"
    var src = (Rand(1, 8)).toString().padStart(2, "0")
    //console.log(src);


    // var obj = {
    //     orderId: ord,
    //     destination: dest,
    //     time: t,
    //     printData: prd,
    //     source: src
    // }
    // console.log(obj)
    return {
        orderId: ord,
        destination: dest,
        time: t,
        printData: prd,
        source: src
    }
}