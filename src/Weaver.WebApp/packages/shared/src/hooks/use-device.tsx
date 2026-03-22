import { useCallback, useEffect, useState } from 'react'
import { DesktopOS, DeviceOS, DeviceState, MobileOS } from './use-device.types'

const userAgent: string =
    navigator.userAgent ||
    navigator.vendor ||
    (typeof window !== 'undefined' && 'opera' in window ? String(window.opera) : '')

const isMobileDevice = (): boolean => {
    const regexs = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i]
    return regexs.some((b) => userAgent.match(b))
}

const isTabletDevice = (): boolean => {
    const regex =
        /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/
    return regex.test(userAgent.toLowerCase())
}

const isDesktopDevice = (): boolean => !isMobileDevice() && !isTabletDevice()

const isDesktop = isDesktopDevice()
const isMobile = isMobileDevice()
const isTablet = isTabletDevice()

const getMobileOS = (): MobileOS | undefined => {
    if (!isMobileDevice()) return undefined

    if (/windows phone/i.test(userAgent)) return MobileOS.WindowsPhone
    if (/android/i.test(userAgent)) return MobileOS.Android
    if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) return MobileOS.iOS

    return MobileOS.Unknown
}

const getDesktopOS = (): DesktopOS | undefined => {
    if (!isDesktopDevice()) return undefined

    if (userAgent.indexOf('Win') !== -1) return DesktopOS.Windows
    if (userAgent.indexOf('Mac') !== -1) return DesktopOS.MacOS
    if (userAgent.indexOf('X11') !== -1) return DesktopOS.Unix
    if (userAgent.indexOf('Linux') !== -1) return DesktopOS.Linux

    return DesktopOS.Unknown
}


const deviceOS: DeviceOS | undefined = getMobileOS() ?? getDesktopOS()

const mobileOS = getMobileOS()
const desktopOS = getDesktopOS()
const isAndroidDevice = deviceOS === MobileOS.Android
const isAppleDevice = deviceOS === MobileOS.iOS || deviceOS === DesktopOS.MacOS
const isUnknownMobileDevice = deviceOS === MobileOS.Unknown
const isWindowsDesktop = deviceOS === DesktopOS.Windows
const isLinuxOrUnixDesktop = deviceOS === DesktopOS.Linux || deviceOS === DesktopOS.Unix

const getInitialOrientation = (): OrientationType => {
    if (screen?.orientation?.type) return screen.orientation.type
    return matchMedia('(orientation: portrait)').matches ? 'portrait-primary' : 'landscape-primary'
}

export const useDevice = (): DeviceState => {
    const [screenOrientation, setScreenOrientation] = useState<OrientationType>(getInitialOrientation)

    const isLandscapeOrientation = ['landscape-primary', 'landscape-secondary'].includes(screenOrientation)
    const isPortraitOrientation = ['portrait-primary', 'portrait-secondary'].includes(screenOrientation)

    const handleOrientationChange = useCallback((orientation: OrientationType) => {
        setScreenOrientation(orientation)
    }, [])

    useEffect(() => {
        if (screen?.orientation) {
            const handler = (ev: Event) => handleOrientationChange((ev.target as ScreenOrientation).type)
            screen.orientation.addEventListener('change', handler)
            return () => screen.orientation.removeEventListener('change', handler)
        }

        const portraitQuery = matchMedia('(orientation: portrait)')
        const handler = (ev: MediaQueryListEvent) =>
            handleOrientationChange(ev.matches ? 'portrait-primary' : 'landscape-primary')
        portraitQuery.addEventListener('change', handler)
        return () => portraitQuery.removeEventListener('change', handler)
    }, [handleOrientationChange])

    return {
        isDesktop,
        desktopOS,
        isWindowsDesktop,
        isLinuxOrUnixDesktop,
        isMobile,
        mobileOS,
        isAndroidDevice,
        isAppleDevice,
        isUnknownMobileDevice,
        isTablet,
        isLandscapeOrientation,
        isPortraitOrientation,
    }
}