import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const { data: session } = useSession();
    const userInfo = session?.user
    // const accessToken = session?.user?.accessToken;
    // const refreshToken = session?.user?.refreshToken;

    return { userInfo };
}