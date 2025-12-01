import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

export const Backdrop = ({
    enableClose = true,
    onBackdropPress,
    ...rest
}: BottomSheetBackdropProps & {
    enableClose?: boolean;
    onBackdropPress?: () => void;
}) => (
    <BottomSheetBackdrop
        {...rest}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={enableClose ? 'close' : 'none'}
        onPress={onBackdropPress}
    />
);
