import { useAuth } from "./useAuth"

const useHasPermission = () => {
    const { user } = useAuth()
    const permissionList = user!.role.permissions!.map(rp => rp.name);

    return (permission: string) => permissionList?.includes(permission)
}

export default useHasPermission