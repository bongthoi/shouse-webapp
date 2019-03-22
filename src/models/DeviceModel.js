import namespace from '../../config/namespace_config.json';

/**
 * declare AreaModel Class
 */
class Device{
    constructor(id,name,description,pin,image,created_date,priority,status,user_id,area_id){
        this.$class=namespace.namespace+".Device",
        this.id=id,
        this.name=name,
        this.description=description,
        this.pin=pin,
        this.image=image,
        this.created_date=created_date,        
        this.priority=priority,
        this.status=status,
        this.user_id=user_id,
        this.area_id=area_id
    }
}
/**
 * export module
 */
module.exports=Device;