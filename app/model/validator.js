const validator = require('validator');

const hasEmpty=(values) =>{
   return values.find((item) =>{
      return item.toString().trim()==='';
   })!==undefined;
};

const isEmpty= (item) =>{
  return item.toString().trim()==='';
};

const isValidLocation=(longitude,latitude)=>{
    return validator.isLatLong(`${latitude},${longitude}`);
};

const isIncident=(type) =>{
    return type==='red-flag'||type==='intervention';
};

const keysExist=(values)=>{
    
}

module.exports={
    hasEmpty,
    isEmpty,
    isValidLocation,
    isIncident
};
