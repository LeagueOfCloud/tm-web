type CachedData = {
    [key: string]: {
        data: unknown
        expiresAt: number
    }
}

export class CacheManager {
    private cachedData: CachedData = {}

    constructor() {
        this.cachedData = {};
    }

    public get(cacheKey: string) {
        const cachedDataForKey = this.cachedData[cacheKey];

        if(cachedDataForKey === undefined || new Date(cachedDataForKey.expiresAt).getTime() < new Date().getTime()) {
            return undefined;
        }

        return cachedDataForKey.data;
    }

    public set(cacheKey: string, data: unknown, expiresIn: number = 2000) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiresIn).getTime();

        this.cachedData[cacheKey] = { data, expiresAt }
    }
}

const cache = new CacheManager();

export default cache;