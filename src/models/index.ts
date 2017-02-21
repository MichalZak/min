

export class Doc {
    public _id?:string;
    public _rev?:string;
    public _deleted?:boolean;
    public type?:string; //this is to distinguish different doc types

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

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
    sticky?: boolean; //use bonfire to stick on top
    callType?: string;
    visits?: Visit[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }
    
}

export class Placement extends Doc {
    name:string;
    type:string;
    shortName?:string;
    pubType?: string;
    category?:string;
    fav?:boolean;
    image?:string;
    language?:string;
    priority?:number;

    getImage(){
        if(!this.image)
            return "assets/img/publications/default_E_md.jpg"
        return "assets/img/publications/"+this.image;
    }
    getPriority():number{
        if(this.priority)
            return this.priority;
        return 0;
    }

    
}

export class Visit {
    public id?:string;
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

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }
}
