
const STATUS_OK=200;
const STATUS_CREATED=201;
const STATUS_NO_CONTENT=204;

const STATUS_NOT_FOUND=404;

const echo=(res,code,data)=>{
    res.status(code).json({status:code,data:data});
};

const error=(res,code,message) =>{
    res.status(code).json({status:code,error:message});
};

module.exports={echo,error,STATUS_OK,STATUS_CREATED,STATUS_NO_CONTENT,STATUS_NOT_FOUND};