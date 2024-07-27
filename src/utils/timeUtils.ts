/**
 * 将时间处理成易读文本
 */
export const getTimeString = (time: string) => {
  const now = new Date();
  const date = new Date(time);
  let res = "";

  if (now.getFullYear() != date.getFullYear())
    // 年份不一样
    res = formatDateTime(date, "YYYY年M月D日");
  else {
    // 年份一样
    if (now.getMonth() != date.getMonth()) {
      // 月份不一样
      res = formatDateTime(date, "M月D日");
    } else {
      // 月份一样
      if (now.getDate() != date.getDate()) {
        // 日不一样
        if (now.getDate() - date.getDate() == 1)
          res = "昨天" + formatDateTime(date, "HH:mm");
        else if (now.getDate() - date.getDate() < 5)
          // 5天内
          res = formatDateTime(
            date,
            now.getDate() - date.getDate() + "天前" + "HH:mm"
          );
        else {
          // 5天外
          res = formatDateTime(date, "M月D日");
        }
      } else {
        // 日一样
        res = formatDateTime(date, "HH:mm");
      }
    }
  }
  return res;
};
const formatDateTime = (
  Time: Date | null | string | number = null,
  M: string
) => {
  let D: Date = Time ? new Date(Time) : new Date();
  let P: RegExp =
    /(Y{2,4}|M{1,2}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|C{1,2}|W{1,2})/g;
  let ToZ: any = (S: string | number) => (Number(S) < 10 ? "0" + S : S);
  let DS: string = M.replace(P, ($0: string) => {
    switch ($0) {
      case "YY":
        return D.getFullYear().toString().slice(-2);
      case "YYYY":
        return D.getFullYear();
      case "M":
        return D.getMonth() + 1;
      case "MM":
        return ToZ(D.getMonth() + 1);
      case "D":
        return D.getDate();
      case "DD":
        return ToZ(D.getDate());
      case "W":
        return D.getDay();
      case "WW":
        return ["日", "一", "二", "三", "四", "五", "六"][D.getDay()];
      case "H":
        return D.getHours();
      case "HH":
        return ToZ(D.getHours());
      case "m":
        return D.getMinutes();
      case "mm":
        return ToZ(D.getMinutes());
      case "s":
        return D.getSeconds();
      case "ss":
        return ToZ(D.getSeconds());
      case "C":
        return Math.trunc(D.getTime() / 1000);
      case "CC":
        return D.getTime();
      default:
        return $0;
    }
  });
  return DS;
};
