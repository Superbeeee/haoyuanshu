// 繁體中文 — 真實來源（source of truth）。
// 其他語言的結構必須與此對齊；缺漏的 key 會 fallback 至此。
// 注意：字串一律存「乾淨文字」，不含手寫空格；疏朗排版由 T.tracking 字距負責。
export const zh = {
  common: {
    cancel: '取消',
    confirm: '確定',
    save: '儲存',
    done: '完成',
    times: '遍',
    day: '天',
  },
};

export type Translation = typeof zh;
