import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Session } from "@/types/session.types";
import { COOKIE_AUTH_NAME } from "@/lib/auth/constants";
import { authService } from "@/lib/auth/authService";

export default function useSession(): Session {
    const [cookies] = useCookies([COOKIE_AUTH_NAME]);
    const [session, setSession] = useState<Session>({
        data: null,
    });

    useEffect(() => {
        const sessionToken = cookies[COOKIE_AUTH_NAME];

        if (!sessionToken) {
            setSession({ data: null });
            return;
        }

        const user = authService(sessionToken);
        if (user) {
            setSession({ data: user });
        } else {
            setSession({ data: null });
        }
    }, [cookies]);

    return {
        ...session,
    };
}
