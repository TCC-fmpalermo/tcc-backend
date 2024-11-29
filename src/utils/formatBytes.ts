
type Unit = 'B' | 'MB' | 'GB';
export const chooseMBorGB = (value: number, unit: Unit, toFixed = 2) => {
    let sizeInMB: number;
    let sizeInGB: number;
    if(unit === 'MB') {
        sizeInGB = value / 1024;
        return sizeInGB > 1 ? `${sizeInGB.toFixed(toFixed)} GB` : `${value} MB`;
    }
    if (unit === 'B') {
        sizeInMB = value / 1024 / 1024;
        sizeInGB = sizeInMB / 1024;
        return sizeInGB > 1 ? `${sizeInGB.toFixed(toFixed)} GB` : `${sizeInMB.toFixed(2)} MB`;
    }

    return value;
}

