export interface CartItemType {
    id: number;
    quantity: number;
    size: string;
    product: {
        name: string;
        price: number;
        imageUrl: string;
    };
}

export interface CartType{ 
    id: number;
    userId: number;
    items: CartItemType[];
}
