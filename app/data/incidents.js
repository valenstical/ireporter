const config=require('../model/config');
const validator =require('../model/validator');

const incidents = [
  {
    id: 1,
    createdOn: new Date('2018-04-12'),
    createdBy: 56789,
    type: 'intervention',
    location: '6.2987309, 3.1096734',
    status: 'draft',
    Images: ['image1.jpg', 'image2.jpg'],
    Videos: ['video1.mp4', 'video2.mp4'],
    comment: 'Power failure for over 3 weeks now',
    description:'An electric pole fell along my street and no PHCN official has come to do anything since, this is getting out of hand and no one is doing anything about it.\nWe even contributed some money to help fix the problem, but nothing till now.'
  },
  {
    id: 2,
    createdOn: new Date('2018-11-14'),
    createdBy: 690345,
    type: 'intervention',
    location: '6.1267890, 3.5678903',
    status: 'resolved',
    Images: ['image1.jpg'],
    Videos: [],
    comment: 'Unconscious woman along ring road',
    description: 'There is an erderly woman along ring road, just before Bob Izua Park. Please call the relevant agency to take her to the hospital. '
  },
  {
    id: 3,
    createdOn: new Date('2018-04-19'),
    createdBy: 690345,
    type: 'red-flag',
    location: '6.6789034, 3.1205679',
    status: 'rejected',
    Images: [],
    Videos: [],
    comment: 'Bags of Ghana must go with money in the next room from mine.',
    description: 'Please inform EFCC that one of my neighbour is hiding bags of dollars in his room. He normally does yahoo yahoo and I believe he his a cultist.'
  },
  {
    id: 4,
    createdOn: new Date('2018-09-21'),
    createdBy: 56789,
    type: 'red-flag',
    location: '6.4567890, 3.1234567',
    status: 'under investigation',
    Images: ['image1.jpg', 'image2.jpg','image3.jpg'],
    Videos: ['video1.mp4'],
    comment: 'Police extortion at Aba Market',
    description: 'Police men stationed at the entry of Aba market normally ask for bribe when driving along that road, they do this everyday especially on Sundays.'
  },
  {
    id: 5,
    createdOn: new Date('2018-11-06'),
    createdBy: 30127,
    type: 'red-flag',
    location: '6.4567890, 3.1256789',
    status: 'under investigation',
    Images: ['image1.jpg'],
    Videos: ['video1.mpg','video2.mp4','video3.mp4','video4.mp4'],
    comment: 'State governor collecting bribe from contractors',
    description: 'We have video evidence that the state governor of Kano state collects bribe from contractors to execute projects. This has been going on for over 3 years now.'
  },
  {
    id: 6,
    createdOn: new Date('2018-03-17'),
    createdBy: 57890,
    type: 'red-flag',
    location: '6.4589045, 3.1256783',
    status: 'resolved',
    Images: [],
    Videos: [],
    comment: 'Students made to pay over 5000 for exam malpractise',
    description: 'My son just complained about his school Ugborikoko secondary school. They are asking them to pay extra 5000 naira for buying drinks for the external examiner so she can coperate.'
  },
  {
    id: 7,
    createdOn: new Date('2018-07-22'),
    createdBy: 30127,
    type: 'red-flag',
    location: '6.6754346, 3.3324569',
    status: 'resolved',
    Images: [],
    Videos: [],
    comment: 'Fuel tanker blocking Anthony street',
    description: 'Oando fuel tanker fell off the road along anthony street. Please get the relevant agency to come help move it off the road and restore normal movement of cars.'
  },
  {
    id: 8,
    createdOn: new Date('2018-07-27'),
    createdBy: 49045,
    type: 'red-flag',
    location: '6.2890934, 3.4109845',
    status: 'under investigation',
    Images: [],
    Videos: [],
    comment: 'Lecturer extorting students for marks',
    description: 'Physics 101 lecturer Mr. Silvernus Mbaka has promised to give my friend an F because she refused all his all his advances.'
  },
  {
    id: 9,
    createdOn: new Date('2018-08-29'),
    createdBy: 49045,
    type: 'intervention',
    location: '6.2890934, 3.4109845',
    status: 'under investigation',
    Images: [],
    Videos: [],
    comment: 'Music piracy at alaba market',
    description: 'Please let the government protect our music and intellectual work. The amount of music piracy going on at Alaba market is alarming.'
  }
];

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
        message='You must enter a the title of the report you want to make.';
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
