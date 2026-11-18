declare class ObjectRepository {
    entityMap: Map<string, any>;
    constructor(entities?: {});
    findById(id: any): any;
    findAll(): any[];
    upsertById(id: any, entity: any): Map<string, any>;
    deleteById(id: any): boolean;
    count(): number;
    toJSON(): any[];
}
export { ObjectRepository };
