export type User = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    password: string;
    id: number;
};

export type Action =
    | { type: 'ADD' | 'UPDATE'; data: User }
    | { type: 'REMOVE' };

export const reducer = (state: User | undefined, action: Action): User | undefined => {
    switch (action.type) {
        case 'ADD':
        case 'UPDATE':
            return action.data;
        case 'REMOVE':
            return undefined;
        default:
            return state;
    }
};
