import React, {useRef, useEffect, ReactNode} from 'react';

interface ClickAwayListenerProps {
    onClickAway: (event: MouseEvent | TouchEvent | FocusEvent) => void;
    children: ReactNode;
    mouseEvent?: 'mousedown' | 'mouseup' | 'click' | false;
    touchEvent?: 'touchstart' | 'touchend' | false;
    disableReactTree?: boolean;
}

function isTouchEvent(event: Event): event is TouchEvent {
    return 'touches' in event;
}

function ClickAwayListener({
                               onClickAway,
                               children,
                               mouseEvent = 'mousedown',
                               touchEvent = 'touchstart',
                               disableReactTree = false,
                           }: ClickAwayListenerProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    useEffect(() => {
        function handleClickAway(event: Event) {
            if (!(event instanceof MouseEvent || isTouchEvent(event))) {
                return;
            }

            if (!nodeRef.current || !event.target) {
                return;
            }

            if (nodeRef.current.contains(event.target as Node)) {
                return;
            }

            if (!disableReactTree) {
                const root = nodeRef.current.ownerDocument;
                const portal = root.getElementById('ant-design-root-portal');

                if (portal && portal.contains(event.target as Node)) {
                    return;
                }
            }

            onClickAway(event);
        };

        function handleFocusChange(event: FocusEvent) {
            if (!nodeRef.current || !event.target) {
                return;
            }

            if (nodeRef.current.contains(event.target as Node)) {
                previousActiveElement.current = event.target as Element;
                return;
            }

            if (!disableReactTree) {
                const root = nodeRef.current.ownerDocument;
                const portal = root.getElementById('ant-design-root-portal');
                if (portal && portal.contains(event.target as Node)) {
                    previousActiveElement.current = event.target as Element;
                    return;
                }
            }

            onClickAway(event);
            previousActiveElement.current = event.target as Element;
        }

        function handleWindowBlur() {
            const evt = new FocusEvent('blur', {relatedTarget: null});
            onClickAway(evt);
        }

        const eventListeners: Array<[string, EventListener]> = [];

        if (mouseEvent !== false) {
            eventListeners.push([mouseEvent, handleClickAway as EventListener]);
        }

        if (touchEvent !== false) {
            eventListeners.push([touchEvent, handleClickAway as EventListener]);
        }

        eventListeners.push(['focusin', handleFocusChange as EventListener]);

        window.addEventListener('blur', handleWindowBlur);

        eventListeners.forEach(([eventName, listener]) => {
            document.addEventListener(eventName, listener, {capture: true});
        });

        return () => {
            eventListeners.forEach(([eventName, listener]) => {
                document.removeEventListener(eventName, listener, {capture: true});
            });

            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [onClickAway, mouseEvent, touchEvent, disableReactTree]);

    return <div ref={nodeRef}>{children}</div>;
};

export default ClickAwayListener;