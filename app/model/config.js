
const STATUS_OK=200;
const STATUS_CREATED=201;
const STATUS_NO_CONTENT=204;

const STATUS_NOT_FOUND=404;

const echo=(status,data)=>{
    return {status:status,data:data};
};

module.exports={echo,STATUS_OK,STATUS_CREATED,STATUS_NO_CONTENT,STATUS_NOT_FOUND};