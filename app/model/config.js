
//HTTP STATUS
const STATUS_OK=200;
const STATUS_CREATED=201;
const STATUS_NO_CONTENT=204;
const STATUS_NOT_FOUND=404; //ENTRY OK BUT RECORD NOT FOUND
const STATUS_UNPROCESSED=422; //INVALID ENTRY
const STATUS_BAD_REQUEST=400; // EMPTY FIELD

//INCIDENT STATUS
const INCIDENT_STATUS_DRAFT='draft';
const INCIDENT_STATUS_UNDER_INVESTIGATION='under investigation';
const INCIDENT_STATUS_RESOLVED='resolved';
const INCIDENT_STATUS_REJECT='rejected';

const echo=(res,code,data)=>{
    res.status(code).json({status:code,data:data});
};

const error=(res,code,message) =>{
    res.status(code).json({status:code,error:message});
};


module.exports={
    echo,
    error,
    STATUS_OK,
    STATUS_CREATED,
    STATUS_NO_CONTENT,
    STATUS_NOT_FOUND,
    STATUS_BAD_REQUEST,
    STATUS_UNPROCESSED,
    INCIDENT_STATUS_DRAFT,
    INCIDENT_STATUS_REJECT,
    INCIDENT_STATUS_RESOLVED,
    INCIDENT_STATUS_UNDER_INVESTIGATION
};