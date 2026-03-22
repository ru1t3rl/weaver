export enum DesktopOS {
    Linux = 'linux',
    MacOS = 'mac_os',
    Unix = 'unix',
    Unknown = 'unknown',
    Windows = 'windows'
}

export enum MobileOS {
    Android = 'android',
    iOS = 'ios',
    Unknown = 'unknown',
    WindowsPhone = 'Windows Phone'
}

export type DeviceOS = DesktopOS | MobileOS

export interface DeviceState {
    isDesktop: boolean
    desktopOS: DesktopOS | undefined
    isWindowsDesktop: boolean
    isLinuxOrUnixDesktop: boolean

    isMobile: boolean
    mobileOS: MobileOS | undefined
    isAndroidDevice: boolean
    isAppleDevice: boolean
    isUnknownMobileDevice: boolean
    
    isTablet: boolean
    isLandscapeOrientation: boolean
    isPortraitOrientation: boolean
}