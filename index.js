import express from 'express'                   //Импорт модуля expressjs
import cors from 'cors'                         //Импорт модуля управления политиками cors
import * as path        from 'path';            //Импорт модуля работы с путями файловой системы
import {fileURLToPath}  from 'url';             //Импорт модуля работы с ссылками
import http             from 'http'                         //Импорт модуля работы с http
import clc              from 'cli-color';                   //Импорт модуля управления цветом консоли
import moment           from 'moment';                      //Импорт модуля работы со временем

import {root
} from './app/webapi/server/api-routes.js'

import {
    loggerInit, 
    logMessage
} from './app/logger/logger.js';          //Импорт модулей логгера
import {localDBInit} from './app/appDatabase/localDBInit.js';//Импорт модуля инициализации локальных баз данных

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //Путь рабочей папки приложения
var DBG = await localDBInit(path.join(__dirname,'./settings/debug.json')); //Подключение файла JSON с параметрами отладки как локальной БД
var WEBset = await localDBInit(path.join(__dirname,'./settings/web.json')); //Подключение файла JSON с параметрами веб сервера

var logger = await loggerInit('YYYY-MM-DD-THH',path.join(__dirname, 'logs', 'Server-%DATE%.log'), '100m', true, '3d');

const app = express();
app.use(cors());
app.options('*', cors());

//Лимиты размера передаваемых данных
app.use(express.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.get    ('/', async function (req, res) { root(req, res, logger, DBG); });

app.use(function notFoundHandler(req, res) {
    res.status(404).send({
        error: "Not Found",
    });
});

app.use(async function (err, req, res, next) {
    res.status(err.status || 500).send({
        error: "Internal Server Error",
    }).end();
});

var port = process.env.PORT || WEBset.httpPort; // Установка порта http сервера
var httpServer = http.createServer(app);
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