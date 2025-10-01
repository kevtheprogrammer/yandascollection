
// start list produc api 
type ProductAPIList = {
    total: number;
    page:  number;
    pageSize:  number;
    totalPages:  number;
    data: ProductAPI;
}

type ProductAPI = {
    id: number,
    name: string;
    price: number,
    categoryId: number,
    images: ProductListImg;
}

type ProductListImg = {
    id: number;
    media: ProductImage[];
    colorCode: string;
    name: string;

}

type ProductImage = {
    id: number;
    url: string;
}

type ProductDetailsAPI = {
    id: number|null;
    name: string;
    price: number;
    categoryId: number|null;
    discount: number;
    stock: number;
    description: string;
    isPub: boolean;
    images: ProductDetailImg[]|null;
    category: ProductCategory|null;
}

type ProductCategory = {
    id: number;
    name: string; 
}

type ProductDetailImg = {
    id: number;
    colorCode: string;
    name: string;
    stock: ProductStock;
  
}
 
type ProductStock = {
    id: number;
    sizeId:number; 
    stock:string; 
}

