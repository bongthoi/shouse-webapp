import Area from '../models/AreaModel';
import AreaRepo from '../repositories/AreaRepo';

/**
 * declare Varialbes
 */
var areaRepo=new AreaRepo();

class AreaService{
    constructor(){};
    getAll(){
        let method="AreaService/getAll()";
        console.log(method+" -->start");
        
        try {
            let result=areaRepo.getAll();
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return error;
        }        
    };

    getAllByUserID(_id){
        let method="AreaService/getAllByUserID()";
        console.log(method+" -->start");
        
        try {
            let result=areaRepo.getAllByUserID(_id);
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return new Error(error);
        }        
    };

    getByID(_id){
        let method="AreaService/getByID()";
        console.log(method+" -->start");
        
        try {
            let result=areaRepo.getByID(_id);
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return new Error(error);
        }
    };
    insert(_area){
        let method="AreaService/insert()";
        console.log(method+" -->start");
        
        try {
            let result=areaRepo.insert(_area);
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return new Error(error);
        } 
    };
    
    update(_area){
        let method="AreaService/update";
        console.log(method+ " -->start");
        
        try {
            let result= areaRepo.update(_area);
            console.log(method+" -->success");
            return result;
        } catch (error) {
            console.log(method+" -->fail");
            return error;
        }
    };

    delete(_id){
        let method="AreaService/delete()";
        console.log(method+" -->start");
        
        try {
            let result=areaRepo.delete(_id);
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
module.exports=AreaService;