declare module 'rmc-drawer' {
    import * as moment from "moment";
    import * as React from 'react';

    interface DrawerProps {
        className?: string;
        prefixCls?: string;
        children?: React.ReactNode | React.ReactNode[];
        style?: React.CSSProperties;
        sidebarStyle?: React.CSSProperties;
        contentStyle?: React.CSSProperties;
        overlayStyle?: React.CSSProperties;
        dragHandleStyle?: React.CSSProperties;
        sidebar?: React.ReactNode;
        onOpenChange?: (open: boolean, overlay?: { overlayClicked: boolean }) => void;
        open?: boolean;
        position?: 'left' | 'right' | 'top' | 'bottom';
        docked?: boolean;
        transitions?: boolean;
        touch?: boolean;
        enableDragHandle?: boolean;
        dragToggleDistance?: number;
    }

    export default class Drawer extends React.Component<Partial<DrawerProps>> {
    }
}