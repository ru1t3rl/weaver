import { useEffect, useMemo, useRef } from 'react';
import { ContextMenuState } from '../../providers/context-menu-provider';

interface ContextMenuProps {
    state: ContextMenuState;
    onClose: () => void;
}

export function ContextMenu({ state, onClose }: ContextMenuProps) {
    const { position, items } = state;
    const menuRef = useRef<HTMLDivElement>(null);

    const menuStyle = useMemo(() => {
        if (!position) return {};
        // const menuW = 200, menuH = 300;
        // const x = position.x + menuW > window.innerWidth ? position.x - menuW : position.x;
        // const y = position.y + menuH > window.innerHeight ? position.y - menuH : position.y;
        return { top: position.y, left: position.x };
    }, [position]);

    useEffect(() => {
        const handleClick = () => onClose();
        const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

        window.addEventListener('mousedown', handleClick);
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKey);
        };
    }, [onClose]);

    if (!position) return null;

    return (
        <div
            ref={menuRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                ...menuStyle,
                zIndex: 9999,
                minWidth: 180,
                background: '#1a1d23',
                border: '1px solid #2e3340',
                borderRadius: 8,
                padding: '4px 0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                fontSize: 13,
            }}
        >
            {items.map((item, idx) => (
                <button
                    key={item.label ?? idx}
                    disabled={item.disabled}
                    onClick={() => { item.onClick(); onClose(); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', padding: '7px 14px',
                        background: 'none', border: 'none',
                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                        color: item.disabled ? '#4b5263' : '#d1d5db',
                        textAlign: 'left', borderRadius: 4, transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = '#2a2d35'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                >
                    {item.icon && <span style={{ opacity: 0.7, fontSize: 14 }}>{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </div>
    );
}