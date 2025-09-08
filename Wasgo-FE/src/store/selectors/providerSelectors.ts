// Selector helpers to get provider base location from existing auth state
// Returns { lat, lng } | null

export const selectProviderBaseLocation = (state: any): { lat: number; lng: number } | null => {
    if (!state) return null;

    const user = state.auth?.user;
    const provider = user?.provider ?? user?.profile ?? null;

    const candidates: Array<any> = [
        provider?.profile?.base_location,
        provider?.base_location,
        user?.base_location,
        state.provider?.profile?.base_location,
        state.provider?.base_location,
    ];

    for (const loc of candidates) {
        if (!loc) continue;
        const lat = loc.lat ?? loc.latitude ?? (Array.isArray(loc.coordinates) ? loc.coordinates[1] : undefined);
        const lng = loc.lng ?? loc.longitude ?? (Array.isArray(loc.coordinates) ? loc.coordinates[0] : undefined);
        if (typeof lat === 'number' && typeof lng === 'number') {
            return { lat, lng };
        }
    }

    return null;
};



