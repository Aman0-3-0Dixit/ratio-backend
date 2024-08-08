const currentTimeInMillisec = () => {
    const dateNow = Date.now();
    return dateNow / 1.0;
}

const distBetCoordsKM = (lat1, long1, lat2, long2) => {
    const _eQuatorialEarthRadius = 6378.1370;
    const _d2r = (Math.PI / 180);
    const dlong = (long2 - long1) * _d2r;
    const dlat = (lat2 - lat1) * _d2r;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1 * _d2r) * Math.cos(lat2 * _d2r) * Math.sin(dlong / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = _eQuatorialEarthRadius * c;
    return d;
}

export {
    currentTimeInMillisec,
    distBetCoordsKM
};