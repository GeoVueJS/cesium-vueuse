import { toCoord } from './toCoord';

import type { CommonCoord, CoordArray_ALT } from './types';

export type DMSCoord = [longitude: string, latitude: string, height?: number];

/**
 * 将角度转换为DMS（度分秒）格式字符串
 *
 * @param degrees 角度值
 * @param precision 精度，'秒位'保留的小数位数，默认为3
 * @returns DMS格式的字符串，格式为：度°分′秒″
 */
export function dmsEncode(degrees: number, precision = 3): string {
  const str = `${degrees}`;
  let i = str.indexOf('.');
  const d = i < 0 ? str : str.slice(0, Math.max(0, i));
  let m = '0';
  let s = '0';
  if (i > 0) {
    m = `0${str.slice(Math.max(0, i))}`;
    m = `${+m * 60}`;
    i = m.indexOf('.');
    if (i > 0) {
      s = `0${m.slice(Math.max(0, i))}`;
      m = m.slice(0, Math.max(0, i));
      s = `${+s * 60}`;
      i = s.indexOf('.');
      s = s.slice(0, Math.max(0, i + 4));
      s = (+s).toFixed(precision);
    }
  }
  return `${Math.abs(+d)}°${+m}′${+s}″`;
}

/**
 * 将 DMS（度分秒）格式的字符串解码为十进制角度值
 *
 * @param dmsCode DMS 格式的字符串，如 "120°30′45″N"
 * @returns 解码后的十进制角度值，若解码失败则返回 0
 */
export function dmsDecode(dmsCode: string) {
  const [dd, msStr] = dmsCode.split('°') ?? [];
  const [mm, sStr] = msStr?.split('′') ?? [];
  const ss = sStr?.split('″')[0];

  const d = Number(dd) || 0;
  const m = (Number(mm) || 0) / 60;
  const s = (Number(ss) || 0) / 60 / 60;
  const degrees = d + m + s;
  if (degrees === 0) {
    return 0;
  }
  else {
    let res = degrees;
    // 南、西 为负数
    if (['W', 'w', 'S', 's'].includes(dmsCode.at(-1)!)) {
      res = -res;
    }
    return res;
  }
}

/**
 * 将经纬度坐标转换为度分秒格式
 *
 * @param position 经纬度坐标
 * @param precision '秒'保留的小数位数，默认为3
 * @returns 返回度分秒格式的坐标，若转换失败则返回undefined
 */
export function degreesToDms(position: CommonCoord, precision = 3): DMSCoord | undefined {
  const coord = toCoord(position, { alt: true });
  if (!coord) {
    return;
  }
  const [longitude, latitude, height] = coord;
  const x = dmsEncode(longitude, precision);
  const y = dmsEncode(latitude, precision);
  return [`${x}${longitude > 0 ? 'E' : 'W'}`, `${y}${latitude > 0 ? 'N' : 'S'}`, height];
}

/**
 * 将度分秒格式转换为经纬度坐标
 *
 * @param dms 经纬度坐标
 * @returns 返回度分秒格式的坐标，若转换失败则返回undefined
 */
export function dmsToDegrees(dms: DMSCoord): CoordArray_ALT | undefined {
  const [x, y, height] = dms;
  const longitude = dmsDecode(x);
  const latitude = dmsDecode(y);
  return [longitude, latitude, (Number(height)) || 0];
}
