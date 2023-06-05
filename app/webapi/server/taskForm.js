import {logMessage}     from '../../logger/logger.js';         //Импорт модулей логгера
import moment           from 'moment';                         //Импорт модуля работы со временем
import clc              from 'cli-color';                      //Импорт модуля управления цветом консоли
import express from 'express';

export class Task{
    constructor(response = express.response){
        this.response=response
        let obj = {
            internalid: "000000000000017",
            orderId: "2023-0004-0012-00090",
            destination: "08",
            time: "2021-11-17T12:25:36",
            printData: "01"
        }
    };
    
}