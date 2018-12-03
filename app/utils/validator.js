const validator = require('validator');

const hasEmpty=(values) =>{
   return values.some((item) =>{
      return item.toString().trim()==='';
   });
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


module.exports={
    hasEmpty,
    isEmpty,
    isValidLocation,
    isIncident
};
