import { Button } from '@/components/ui/button';
import {
    RegisterLink, 
    LoginLink, 
} from "@kinde-oss/kinde-auth-nextjs/components";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import UserNavbar from './UserNavbar';

export default async function AuthNavbarButtons() {

    const {
        // getAccessToken,
        // getBooleanFlag,
        // getFlag,
        // getIdToken,
        // getIntegerFlag,
        // getOrganization,
        // getPermission,
        // getPermissions,
        // getStringFlag,
        getUser,
        // getUserOrganizations,
        isAuthenticated
    } = getKindeServerSession();

    const user = await getUser();
    return <>
        {await isAuthenticated() ? (
            <div className="flex items-center gap-x-5">
                <UserNavbar 
                    user={user}
                />
            </div>
        ) : (
            <div className="flex items-center gap-x-5">
                <LoginLink>
                    <Button className='w-[120px] h-[40px]' variant="outline" size="icon">Sign In</Button>
                </LoginLink>
                <RegisterLink>
                    <Button className='w-[120px] h-[40px]' variant="secondary" size="icon">Sign Up</Button>
                </RegisterLink>
            </div>
        )}
    </>;
}