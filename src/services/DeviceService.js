import Device from '../models/DeviceModel';
import DeviceRepo from '../repositories/DeviceRepo';

/**
 * declare Varialbes
 */
var deviceRepo=new DeviceRepo();

class DeviceService{
    constructor(){};
    getAll(){
        let method="DeviceService/getAll()";
        console.log(method+" -->start");
        
        try {
            let result=deviceRepo.getAll();
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return error;
        }        
    };

    getAllByAreaIDAndUserID(_areaID,_userID){
        let method="DeviceService/getAllByAreaIDAndUserID()";
        console.log(method+" -->start");
        
        try {
            let result=deviceRepo.getAllByAreaIDAndUserID(_areaID,_userID);
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return new Error(error);
        }        
    };

    
}

/**
 * export AreaService Module
 */
module.exports=DeviceService;