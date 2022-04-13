import * as React from 'react';
import { MessageIds } from '../../messages';
import { ConfirmDialog } from 'paypf-bizowner-ui-elements';
import { DeletePlace } from '../../actions';

export interface PlaceDeleteConfirmDialogProps {
    // 多言語変換
    translate(key:MessageIds): string;
    // 閉じる要求を親コンポーネントに伝えるためのイベント
    onClose():void;
    // 成功や失敗時の通知
    showNotification(type: "info" | "success" | "warning" | "error", title: string, content: any): void,
    // 地点削除アクション
    deletePlace: DeletePlace;
    // 地点ID
    placeId: number;
}

export const PlaceDeleteConfirmDialog: React.FC<PlaceDeleteConfirmDialogProps>= ({translate, onClose, deletePlace, placeId, showNotification}) => {
    // 削除処理中の場合true
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    /**
     * Yesクリックイベント
     */
    const handleYes = () => {
        if(deletePlace && placeId){
            setIsDeleting(true);
            deletePlace(placeId, handleDeleteSuccess, handleDeleteFail);
        }
    }

    /**
     * Noクリックイベント
     */
    const handleNo = () => {
        onClose();
    }

    /**
     * 削除成功時
     */
    const handleDeleteSuccess = () => {
        setIsDeleting(false);
        showNotification("success", null, translate(MessageIds.labelSuccessDeletePlaceNotification))
        onClose();
    }

    /**
     * 削除失敗時
     */
    const handleDeleteFail = () => {
        setIsDeleting(false);
    }

    return (
        <ConfirmDialog
            title={translate(MessageIds.labelDeletePlaceConfirmTitle)}
            onYes={handleYes}
            onNo={handleNo}
            onClose={onClose}
            isLoading={isDeleting}
            label={{yes: translate(MessageIds.labelYes), no: translate(MessageIds.labelNo)}}>

            {translate(MessageIds.labelDeletePlaceConfirm)}

        </ConfirmDialog>
    )
}