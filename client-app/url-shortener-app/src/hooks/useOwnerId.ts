import { useEffect, useState } from "react";

export const useOwnerId = (): string => {
    const [ownerId, setOwnerId] = useState<string>("");

    useEffect(() => {
        const storedOwnerId = localStorage.getItem("ownerId");

        if (storedOwnerId) {
            setOwnerId(storedOwnerId);
        } else {
            const newOwnerId = crypto.randomUUID();
            localStorage.setItem("ownerId", newOwnerId);
            setOwnerId(newOwnerId);
        }
    }, []);

    return ownerId;
};
