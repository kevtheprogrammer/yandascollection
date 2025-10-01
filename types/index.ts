

// user  

type UserListType = {
    id: number;
    phoneNumber: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    role: 'STAFF' | 'CUSTOMER';
};

type UserType = {
    id: number;
    phoneNumber: string;
    email: string | null;
    emailVerified: Date | null;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    role: 'STAFF' | 'CUSTOMER';
    createdAt: Date;
    updatedAt: Date;
    accounts: AccountType[];
    sessions: Session[];
    customerProfile?: CustomerProfileType;
    staffProfile?: StaffProfileType;
    carts: CartType[];
};

type CustomerProfileType = {
    id: number;
    userId: number;
    address: string | null;
    orders: OrderType[];  // Assuming you have an `Order` type already defined elsewhere
    user: UserType;       // The related User model
};

type StaffProfileType = {
    id: number;
    userId: number;
    position: string | null;
    user: UserType;  // The related User model
};

type AccountType = {
    id: number;
    userId: number;
    type: string;             // Account type (e.g., "oauth", "email", etc.)
    provider: string;         // Authentication provider (e.g., "google", "facebook", etc.)
    providerAccountId: string; // Unique ID from the provider
    refresh_token: string | null; // Optional refresh token
    access_token: string | null;  // Optional access token
    expires_at: number | null;    // Optional expiration time
    token_type: string | null;    // Optional token type
    scope: string | null;         // Optional scope
    id_token: string | null;      // Optional ID token
    session_state: string | null; // Optional session state
    user: UserType;                  // The related User model
};

type OrderType = {
    id: number;
    product: string;       // Product name
    quantity: number;      // Quantity of the product
    price: number;         // Price of the product
    customerId: number;    // Customer ID
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED'; // Order status
    returnRequested: boolean; // Whether a return is requested
    createdAt: Date;       // Timestamp when the order was created
};

type CartType = {
    id: number;
    userId: number;
    items: CartItemType[];  // List of items in the cart
    createdAt: Date;    // Timestamp when the cart was created
    updatedAt: Date;    // Timestamp when the cart was last updated
};

type CartItemType = {
    id: number;
    cartId: number;
    productId: number;   // Product ID
    quantity: number;    // Quantity of the product in the cart
};

type Session = {
    id: number;
    sessionToken: string;  // Unique session token
    userId: number;       // User ID associated with the session
    expires: Date;        // Expiration date for the session
    user: UserType;           // The related User model
};

