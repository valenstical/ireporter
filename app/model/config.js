
const STATUS_OK=200;
const STATUS_CREATED=201;
const STATUS_NO_CONTENT=204;

const STATUS_NOT_FOUND=404;

const echo=(code,data)=>{
    return {status:code,data:data};
};

const error=(code,message) =>{
    return {status:code,error:message};
};

module.exports={echo,error,STATUS_OK,STATUS_CREATED,STATUS_NO_CONTENT,STATUS_NOT_FOUND};