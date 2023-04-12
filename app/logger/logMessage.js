export async function logMessage(logger, date, message = '', contentCli = '', contentLog = '', level = 'info', cli = 1, log = 1, color){
    return new Promise((resolve, reject)=>{
        if (cli == 1) {console.log(color("[" + date + "][" + level.toUpperCase() + "] " + message + contentCli));};
        if (log == 1) {logger.log({level:level, time:date,type:"[" + level.toUpperCase() + "]", message:message, data:contentLog});};
        resolve(true);
    });
};
