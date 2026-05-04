import { Asset, resources } from 'cc';

type AssetConstructor<T extends Asset> = { new(...args: any[]): T };

export class ResourceLoader
{

    static load<T extends Asset>(path: string, type: AssetConstructor<T>): Promise<T | null>
    {
        return new Promise((resolve) =>
            resources.load(path, type, (error, asset) => resolve(error || !asset ? null : asset)));
    }

    static loadDir<T extends Asset>(path: string, type: AssetConstructor<T>): Promise<T[] | null>
    {
        return new Promise((resolve) =>
            resources.loadDir(path, type, (error, assets) => resolve(error || !assets?.length ? null : assets)));
    }
}
