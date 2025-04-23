// export type User = {
//     firstName: string;
//     lastName: string;
//     email: string;
//     address: string;
//     phone: string;
//     password: string;
//     id: number;
// };

// export type Action =
//     | { type: 'ADD' | 'UPDATE'; data: User }
//     | { type: 'REMOVE' };

// export const reducer = (state: User | undefined, action: Action): User | undefined => {
//     switch (action.type) {
//         case 'ADD':
//         case 'UPDATE':
//             return action.data;
//         case 'REMOVE':
//             return undefined;
//         default:
//             return state;
//     }
// };

export type User = {
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    phone: string,
    password: string,
    id: number
}

export type Action = {
    type: 'ADD' | 'REMOVE' | 'UPDATE' | 'GET',
    data: User
}
export const reducer = (state: User | undefined, action: Action): User => {
    switch (action.type) {
        case 'ADD':
            return action.data;
        case 'REMOVE':
            return { firstName: '', lastName: '', email: '', address: '', phone: '', password: '', id: 0 };
        case 'UPDATE':
            return action.data; 
        case 'GET':
            return state || { firstName: '', lastName: '', email: '', address: '', phone: '', password: '', id: 0 };
        default:
            return state || { firstName: '', lastName: '', email: '', address: '', phone: '', password: '', id: 0 };
    }
}