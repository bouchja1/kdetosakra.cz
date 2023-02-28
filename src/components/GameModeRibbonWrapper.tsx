import { Badge } from 'antd';
import React, { ReactNode } from 'react';

export interface GameModeRibbonWrapperProps {
    condition: boolean;
    message: string;
    color?: string;
    children: ReactNode;
}

export const GameModeRibbonWrapper = ({ condition, message, color, children }: GameModeRibbonWrapperProps) =>
    condition ? (
        <Badge.Ribbon text={message} placement="start">
            {children}
        </Badge.Ribbon>
    ) : (
        <>{children}</>
    );
