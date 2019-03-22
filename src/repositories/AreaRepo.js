import mysqldb_connection from '../utilities/mysqldb_connection';
/**
 * declare AreaRepo Class
 */
class AreaRepo{
    constructor(){};
    getAll(){
        let method="AreaRepo/getAll()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("SELECT * FROM tb_area",(err,result)=>{
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

    getAllByUserID(_id){
        let method="AreaRepo/getAllByUserID()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("SELECT * FROM tb_area WHERE user_id=? ORDER BY priority ASC",[_id],(err,result)=>{
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

    getByID(_id){
        let method="AreaRepo/getByID()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("SELECT * FROM tb_area WHERE id=?",[_id],(err,result)=>{
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
    insert(_area){
        let method="AreaRepo/insert()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("INSERT INTO tb_area(name,description,image,created_date,user_id,enabled,priority) VALUES(?,?,?,?,?,?,?)",[_area.name,_area.description,_area.image,_area.created_date,_area.user_id,_area.enabled,_area.priority],(err,result)=>{
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
    update(_area){
        const method="AreaRepo/update()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("UPDATE tb_area SET name=?,description=?,image=?,created_date=?,user_id=?,enabled=?,priority=? WHERE id=?",[_area.name,_area.description,_area.image,_area.created_date,_area.user_id,_area.enabled,_area.priority,_area.id],(error,result)=>{
                if(error){
                    console.log(method+" -->fail");
                    return reject(new Error(error));
                }else{
                    console.log(method+" -->success");
                    return resolve(result);
                }
            });
        });
    };

    delete(_id){
        let method="AreaRepo/delete()";
        console.log(method+" -->start");

        return new Promise((resolve,reject)=>{
            mysqldb_connection.query("DELETE FROM tb_area WHERE id=?",[_id],(err,result)=>{
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
module.exports=AreaRepo;