

export class Doc {
    public _id?:string;
    public _rev?:string;
    public _deleted?:boolean;
    public type?:string; //this is to distinguish different doc types


}


export class Note extends Doc {

    title?: string;
    note?: string;
    date?: string;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }

}

export class Call extends Doc {
    name?: string;
    address?: string;
    note?: string;
    date?: string;
    priority?: number;
    callType?: string;
    visits?: Visit[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }
    
}

export interface Placement{
    name:string;
    type:string;
    shortName?:string;
}

export class Visit{
    public date?:string;
    public note?:string;
    public placements?: Placement[];
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}



export class Settings extends Doc {

    public meta?:string;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }


}





export class User extends Doc {
    public username?: string;
    public password?: string;
    public token?:string;
    public dbs:Array<string>;
    public email?: string;

    public token_issued?:number;
    public token_expires?:number;

    constructor(private fields: any) {
        super();
        // Quick and dirty extend/assign fields to this model
        for(let f in fields) {
            this[f] = fields[f];
        }

        if(this['fields'] != null)
            delete this['fields'];
    }
}
