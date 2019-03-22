import namespace from '../../config/namespace_config.json';

/**
 * declare AreaModel Class
 */
class Area{
    constructor(id,name,description,image,created_date,user_id,enabled,priority){
        this.$class=namespace.namespace+".Area",
        this.id=id,
        this.name=name,
        this.description=description,
        this.image=image,
        this.created_date=created_date,
        this.user_id=user_id,
        this.enabled=enabled,
        this.priority=priority
    }
}
/**
 * export module
 */
module.exports=Area;