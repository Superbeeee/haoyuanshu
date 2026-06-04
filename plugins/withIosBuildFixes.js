// Expo config plugin — 在 prebuild 生成 iOS 原生專案時自動套用本地建置修正。
// 取代手動編輯 ios/（生成檔，prebuild 會還原），讓設定隨 app.json 持久化。
const { withEntitlementsPlist, withXcodeProject } = require('@expo/config-plugins');

// 移除 aps-environment：本 app 僅用 local 每日提醒，不需遠端推播；
// 且免費 Apple 個人簽署（Personal Team）不支援 Push Notifications capability。
function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults['aps-environment'];
    return cfg;
  });
}

// 關閉 User Script Sandboxing：新版 Xcode 預設開啟，會擋住 React Native / Expo
// 的 build script 寫入 bundle（ip.txt、main.jsbundle），導致建置失敗。
function disableScriptSandboxing(config) {
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const buildConfigs = project.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(buildConfigs)) {
      const entry = buildConfigs[key];
      if (entry && typeof entry === 'object' && entry.buildSettings) {
        entry.buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = 'NO';
      }
    }
    return cfg;
  });
}

module.exports = (config) => {
  config = withoutPushEntitlement(config);
  config = disableScriptSandboxing(config);
  return config;
};
