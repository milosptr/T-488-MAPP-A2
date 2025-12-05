import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import ReanimatedSwipeable, {
    type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { borderRadius } from '@/src/constants/DesignTokens';

const DEFAULT_ACTION_WIDTH = 80;

export interface SwipeAction {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    backgroundColor: string;
    onAction: () => void;
}

export interface SwipeableRowProps {
    children: React.ReactNode;
    leftAction?: SwipeAction;
    rightAction?: SwipeAction;
    actionWidth?: number;
    onSwipeComplete?: () => void;
}

interface ActionButtonProps {
    action: SwipeAction;
    progress: SharedValue<number>;
    width: number;
}

const ActionButton = ({ action, progress, width }: ActionButtonProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(progress.value, [0, 1], [0.8, 1]) }],
        opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
    }));

    return (
        <Animated.View
            style={[
                styles.actionButton,
                { width, backgroundColor: action.backgroundColor },
                animatedStyle,
            ]}
        >
            <Ionicons name={action.icon} size={24} color="white" />
            <Animated.Text style={styles.actionText}>{action.label}</Animated.Text>
        </Animated.View>
    );
};

export const SwipeableRow = ({
    children,
    leftAction,
    rightAction,
    actionWidth = DEFAULT_ACTION_WIDTH,
    onSwipeComplete,
}: SwipeableRowProps) => {
    const swipeableRef = useRef<SwipeableMethods>(null);

    const handleSwipeOpen = useCallback(
        (direction: 'left' | 'right') => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (direction === 'right' && leftAction) {
                leftAction.onAction();
            } else if (direction === 'left' && rightAction) {
                rightAction.onAction();
            }
            swipeableRef.current?.close();
            onSwipeComplete?.();
        },
        [leftAction, rightAction, onSwipeComplete]
    );

    const renderSwipeLeft = useCallback(
        (progress: SharedValue<number>) =>
            leftAction ? (
                <ActionButton action={leftAction} progress={progress} width={actionWidth} />
            ) : null,
        [leftAction, actionWidth]
    );

    const renderSwipeRight = useCallback(
        (progress: SharedValue<number>) =>
            rightAction ? (
                <ActionButton action={rightAction} progress={progress} width={actionWidth} />
            ) : null,
        [rightAction, actionWidth]
    );

    return (
        <ReanimatedSwipeable
            ref={swipeableRef}
            friction={2}
            leftThreshold={40}
            rightThreshold={40}
            overshootLeft={false}
            overshootRight={false}
            onSwipeableOpen={handleSwipeOpen}
            renderLeftActions={rightAction ? renderSwipeLeft : undefined}
            renderRightActions={leftAction ? renderSwipeRight : undefined}
        >
            {children}
        </ReanimatedSwipeable>
    );
};

const styles = StyleSheet.create({
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});
