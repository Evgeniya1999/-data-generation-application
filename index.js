import express from 'express'                   //Импорт модуля expressjs
import cors from 'cors'                         //Импорт модуля управления политиками cors
import * as path from 'path';            //Импорт модуля работы с путями файловой системы
import { fileURLToPath } from 'url';             //Импорт модуля работы с ссылками
import http from 'http'                         //Импорт модуля работы с http
import clc from 'cli-color';                   //Импорт модуля управления цветом консоли
import moment from 'moment';                      //Импорт модуля работы со временем


import {
  postTaskExecute,
  postTaskOut
} from './app/webapi/server/api-routes.js'

import {
  loggerInit,
  logMessage
} from './app/logger/logger.js';          //Импорт модулей логгера
import { localDBInit } from './app/appDatabase/localDBInit.js';//Импорт модуля инициализации локальных баз данных

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //Путь рабочей папки приложения
var DBG = await localDBInit(path.join(__dirname, './settings/debug.json')); //Подключение файла JSON с параметрами отладки как локальной БД
var WEBset = await localDBInit(path.join(__dirname, './settings/web.json')); //Подключение файла JSON с параметрами веб сервера

var logger = await loggerInit('YYYY-MM-DD-THH', path.join(__dirname, 'logs', 'Server-%DATE%.log'), '100m', true, '3d');

var n = { value: 0 };

const appNew = express();
appNew.use(cors());
appNew.options('*', cors());

//Лимиты размера передаваемых данных
appNew.use(express.json({ limit: '10mb', extended: true }));
appNew.use(express.urlencoded({ limit: '10mb', extended: true }));

var code = 200
appNew.post('/request', async function (req, res) {postTaskExecute(req, res, logger, DBG, code, n)});

appNew.use(function notFoundHandler(req, res) {
  res.status(404).send({
    error: "Not Found",
  });
});

appNew.use(async function (err, req, res, next) {
  res.status(err.status || 500).send({
    error: "Internal Server Error",
  }).end();
});

var port = 9590;
//var port = process.env.PORT || WEBset.httpPort; // Установка порта http сервера
var httpServer = http.createServer(appNew);
httpServer.listen(port, function () {
  logMessage(
    logger,
    moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS"),
    "Сервер http запущен. Порт " + port,
    '',
    '',
    'info', // 'warning', 'error'
    DBG.cli_trace_msg,
    DBG.log_msg,
    clc.greenBright
  );
});
