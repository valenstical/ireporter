const config=require('../utils/config');
const validator =require('../utils/validator');
const incidents=require('../models/incidents');

const getIncidents=()=>{
  return incidents;  
};

const getIncident=(id)=>{
    const result=incidents.filter((item) =>{
        return item.id.toString()===id;
    });
    return result.length===0?false:result;
};

function createIncident(id,body){
    incidents.push(
      {
        id:id,
        createdOn:new Date(),
        createdBy:body.user,
        type:body.type,
        location:`${body.longitude},${body.latitude}`,
        status:config.INCIDENT_STATUS_DRAFT,
        Images:body.images.split(','),
        Videos:body.videos.split(','),
        comment:body.comment,
        description:body.description
    });   
}

function updateIncident(id,longitude,latitude,comment){
    let index=-1; let key='comment';
    const incident=incidents.find((item,pos) =>{
        index=pos;
        return item.id.toString()===id.toString();
    });
    if (comment===null) {
      incident.longitude=longitude;
      incident.latitude=latitude;
      key='location';
    }
    else{
       incident.comment=comment;
    }
    incident[index]=incident;
    return `Updated ${incident.type}'s record ${key}.`;
}


function incidentExists(id){
    return incidents.find((item) =>{
        return item.id===parseInt(id);
    })!==undefined;
}

const addIncident=(body) =>{
  let id=-1;  
  let errorMessage='';
  let code=config.STATUS_BAD_REQUEST;
  
   if (validator.hasEmpty([body.comment,body.longitude,body.latitude])) {
        errorMessage='You must fill all required fields. Please check your inputs then try again';
    }  
    else if (!validator.isValidLocation(body.longitude,body.latitude)) {
        code=config.STATUS_UNPROCESSED;
        errorMessage='The location you entered is invalid. Please check your longitude and latitude, then try again.';
    }
    else if (body.type===undefined||!validator.isIncident(body.type)) {
        errorMessage='Please choose the type of report you wish to make.';
    }
    
    
   else{
    id=incidents.length+1;
    code=config.STATUS_CREATED;   
    createIncident(id,body);
  }  
    return {id:parseInt(id),errorMessage:errorMessage,code:code};
};

const editLocation=(body,params) =>{
  let id=-1;  
  let message='';
  let code=config.STATUS_OK;
  
   if (validator.hasEmpty([body.longitude,body.latitude])) {
        code=config.STATUS_BAD_REQUEST; 
        message='You must enter both longitude and latitude.';
    }  
    else if (!validator.isValidLocation(body.longitude,body.latitude)) {
        code=config.STATUS_UNPROCESSED;
        message='The location you entered is invalid. Please check your longitude and latitude, then try again.';
    }  
    
    else if (!incidentExists(params.id)) {
        code=config.STATUS_NOT_FOUND;
        message='There is no incident report with that id. Please check the id then try again';
    }
    
   else{  
    id=params.id;   
    message=updateIncident(params.id,body.longitude,body.latitude,null);
  }  
    return {id:parseInt(id),message:message,code:code};
};

const editComment=(body,params) =>{
  let id=-1;  
  let message='';
  let code=config.STATUS_OK;
  
   if (validator.isEmpty(body.comment)) {
        code=config.STATUS_BAD_REQUEST; 
        message='You must enter a the title for the report you want to make.';
    }  
    else if (!incidentExists(params.id)) {
        code=config.STATUS_NOT_FOUND;
        message='There is no incident report with that id. Please check the id then try again';
    }
   else{  
    id=params.id;   
    message=updateIncident(params.id,null,null,body.comment);
  }  
    return {id:parseInt(id),message:message,code:code};
};

const deleteIncident=(params) =>{
  let id=-1;  
  let message='';
  let code=config.STATUS_OK;
  
   if (!incidentExists(params.id)) {
        code=config.STATUS_NOT_FOUND;
        message='There is no incident report with that id. Please check the id then try again';
    }
   else{  
    id=params.id;  let index=-1;
    const incident=incidents.find((item,pos) =>{
        index=pos;
        return item.id.toString()===id.toString();        
    });
    incidents.splice(index,1);
    message=`${incident.type} record has been deleted.`;
  }  
    return {id:parseInt(id),message:message,code:code};
};

module.exports={
    getIncidents,
    getIncident,
    addIncident,
    editLocation,
    editComment,
    deleteIncident
};
