
class appError extends Error
{
    constructor(message,statusCode,code,param)
    {
        super(message);
        this.statusCode=statusCode;
        this.status=`${this.statusCode}`.startsWith('4')?'fail':'error';
        this.code=code;
        this.param=param;
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=appError;