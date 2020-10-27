export enum OS_NAMES {
  WINDOWS = "Windows",
  MAC = "MacOS",
  UNIX = "UNIX",
  LINUX = "Linux"
}


export function detectOSName(): OS_NAMES | undefined {
  const { appVersion } = navigator;

  if (appVersion.indexOf("Win") !== -1) return OS_NAMES.WINDOWS;
  if (appVersion.indexOf("Mac") !== -1) return OS_NAMES.MAC;
  if (appVersion.indexOf("X11") !== -1) return OS_NAMES.UNIX;
  if (appVersion.indexOf("Linux") !== -1) return OS_NAMES.LINUX;
}
