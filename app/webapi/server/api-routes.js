import {logMessage}     from '../../logger/logger.js';         //Импорт модулей логгера
import moment           from 'moment';                         //Импорт модуля работы со временем
import clc              from 'cli-color';                      //Импорт модуля управления цветом консоли
import express from 'express';

export async function root(request = express.request, response = express.response, logger, DBG = {}){
    let dateStart=new Date();
    await logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ЗАПРОС] Запрос имени сервиса от " +  request.socket.remoteAddress + ":" + request.socket.remotePort, '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Date", moment(new Date()).format("ddd, D MMM YYYY HH:mm:ss ZZ"));
    response.json({
        srvName: 'ИМЯ'
    });
    response.status(200).end();
    let dateEnd=new Date();
    await logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Запрос имени сервиса от " +  request.socket.remoteAddress + ":" + request.socket.remotePort, '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
    await logMessage(logger, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"), "[ОТВЕТ] Времени затрачено " +  moment.utc(dateEnd-dateStart).format("HH:mm:ss.SSS"), '', '', 'info', DBG.cli_trace_msg, DBG.log_msg, clc.yellow);
};