export const PermissionCategories = {
    HOTEL_MANAGEMENT: "Hotel Management",
    SETTING: "Setting",
    OTHERS: "Others",
}


export const HOTEL_VIEW = {
    name: "view hotel",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "HOTEL_VIEW"
};

export const HOTEL_ADD = {
    name: "add hotel",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "HOTEL_ADD"
};export const HOTEL_EDIT = {
    name: "edit hotel",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "HOTEL_EDIT"
};

export const HOTEL_ACTIVATE = {
    name: "activate hotel",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "HOTEL_ACTIVATE"
};

export const HOTEL_DELETE = {
    name: "delete hotel",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "HOTEL_DELETE"
};
            
export const MANAGE_HOTEL_LOCATIONS = {
    name: "manage hotel locations",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "MANAGE_HOTEL_LOCATIONS"
};

export const MANAGE_HOTEL_ADMINS = {
    name: "manage hotel admins",
    category: PermissionCategories.HOTEL_MANAGEMENT,
    code: "MANAGE_HOTEL_ADMINS"
};


export const USER_MANAGEMENT = {
    name: "user management",
    category: PermissionCategories.SETTING,
    code: "USER_MANAGEMENT"
};

export const SUBSCRIPTION_MANAGMENT = {
    name: "subscription management",
    category: PermissionCategories.SETTING,
    code: "SUBSCRIPTION_MANAGMENT",
};

export const ACCESS_CONTROL = {
    name: "access control",
    category: PermissionCategories.SETTING,
    code: "ACCESS_CONTROL",
};


export const PERMISSIONS = {
    HOTEL_VIEW,
    HOTEL_ADD,
    HOTEL_EDIT,
    HOTEL_ACTIVATE,
    HOTEL_DELETE,
    MANAGE_HOTEL_LOCATIONS,
    MANAGE_HOTEL_ADMINS,
    USER_MANAGEMENT,
    SUBSCRIPTION_MANAGMENT,
    ACCESS_CONTROL,
}