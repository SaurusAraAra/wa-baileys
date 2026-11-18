declare const parseCatalogNode: (node: any) => {
    products: any;
    nextPageCursor: any;
};
declare const parseCollectionsNode: (node: any) => {
    collections: any;
};
declare const parseOrderDetailsNode: (node: any) => {
    price: {
        total: number;
        currency: any;
    };
    products: any;
};
declare const toProductNode: (productId: any, product: any) => {
    tag: string;
    attrs: {
        compliance_category: string;
        is_hidden: any;
    };
    content: any[];
};
declare const parseProductNode: (productNode: any) => {
    id: any;
    imageUrls: {
        requested: any;
        original: any;
    };
    reviewStatus: {
        whatsapp: any;
    };
    availability: string;
    name: any;
    retailerId: any;
    url: any;
    description: any;
    price: number;
    currency: any;
    isHidden: boolean;
};
/**
 * Uploads images not already uploaded to WA's servers
 */
declare function uploadingNecessaryImagesOfProduct(product: any, waUploadToServer: any, timeoutMs?: number): Promise<any>;
/**
 * Uploads images not already uploaded to WA's servers
 */
declare const uploadingNecessaryImages: (images: any, waUploadToServer: any, timeoutMs?: number) => Promise<any[]>;
export { uploadingNecessaryImagesOfProduct };
export { parseCatalogNode };
export { parseCollectionsNode };
export { parseOrderDetailsNode };
export { toProductNode };
export { parseProductNode };
export { uploadingNecessaryImages };
