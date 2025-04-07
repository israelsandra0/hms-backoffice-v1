import { AUTH_DATA_KEY } from "@/constants"
import { getDataObject } from "@/functions"

export function usePermission() {
    const userData = getDataObject(AUTH_DATA_KEY)
    const hasPermission = (permissionToCheck) => {
        if (!!userData.user?.isAdmin) {
            return true;
        }
        return userData.user.role.permissions.find(permission => permission.name == permissionToCheck)
    }

    return {
        userData, 
        hasPermission
    }
}

