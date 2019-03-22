import mysqldb_connection from '../utilities/mysqldb_connection';
/**
 * declare AreaRepo Class
 */
class DeviceRepo{
    constructor(){};
    getAll(){
        let method="DeviceRepo/getAll()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("SELECT * FROM tb_device",(err,result)=>{
                if(err){
                    console.log(method+" -->fail");
                    return reject(err+"");
                }else{
                    console.log(method+" -->success");
                    return resolve(result);
                }
            });
        });
    };

    getAllByAreaIDAndUserID(_areaID,_userID){
        let method="DeviceRepo/getAllByAreaIDAndUserID()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("SELECT * FROM tb_device WHERE area_id=? AND user_id=? ORDER BY priority ASC",[_areaID,_userID],(err,result)=>{
                if(err){
                    console.log(method+" -->fail");
                    return reject(new Error(err));
                }else{
                    console.log(method+" -->success");
                    return resolve(result);
                }
            });
        });
    };

    
}
/**
 * export the module
 */
module.exports=DeviceRepo;