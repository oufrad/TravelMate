export type enumType = {
    name: string;
    value: number;
}

export const statusOptions: enumType[] = [
    { name: 'Active', value: 0 },
    { name: 'Inactive', value: 1 },
    { name: 'Suspended', value: 2 },
    { name: 'Deleted', value: 3 },
];

export const RoleOptions: enumType[] = [
    {name: 'Regular', value: 0 },
    {name: 'Admin', value: 1 },
    {name: 'Moderator', value: 2 },
]