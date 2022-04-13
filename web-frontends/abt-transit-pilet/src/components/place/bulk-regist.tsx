import * as React from 'react';
import { MessageIds } from '../../messages';
import { SimpleDialog, Progress, Button } from 'paypf-bizowner-ui-elements'
import { Region } from '../../models/types'
import { UploadIcon } from 'paypf-bizowner-ui-elements/dist/lib/components/Icons';


export interface PlaceBulkRegistProps {
    translate(key: MessageIds): string; 
    getRegion: () => Promise<Region>; 
    onClose(): void;
    uploadFile(file:any):void;  
}

export const PlaceBulkRegist:React.FC<PlaceBulkRegistProps> = ({
    translate,
    getRegion,
    onClose,
    uploadFile,
}) => {
    const [region, setRegion] = React.useState<Region>('none');
    const [loading, setLoading] = React.useState(false);
    const [currentPercent, setCurrentPercent] = React.useState(0);
    const [fileUploaded, setFileUploaded] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [sampleData,setSampleData] = React.useState(undefined);
    const [csvFile, setCsvFile] = React.useState(undefined);

    React.useEffect(() => {
        if(region == 'none'){
            getRegion().then(value => {
                setRegion(value);
                
                // サンプルCSV作成
                if(sampleData == undefined){
                    var data = "\"カテゴリ\",\"名称\",\"略称\",\"仮名\",\"地図上に表示\",\"アイコン\",\"住所\",\"備考\",\"電話\",\"メールアドレス\",\"入出場判定距離\"\r\n\"営業所\",\"大分営業所\",\"大営\",\"おおいたえいぎょうしょ\",1,1,\"大分県大分市\",\"テスト\",\"09022221234\",\"taro@mcinc.jp\",100";
                    if(value == "us"){
                        data = "\"Category\",\"Name\",\"Abbreviation\",\"Map\",\"Icon\",\"Address\",\"Remarks\",\"Tel\",\"Email\",\"Geofence\"\r\n\"SalesOffice\",\"Oita Sales Office\",\"OSO\",1,1,\"Oita-shi Oita 8700006 JAPAN\",\"Sample\",\"09022221212\",\"taro@mcinc.jp\",350";
                    }
                    const bom = new Uint8Array([0xef,0xbb,0xbf]);
                    const blob = new Blob([bom,data], {type: "text/csv"});
                    var object = (window.URL || window.webkitURL).createObjectURL(blob);
                    setSampleData(object)
                }
            })
        }
    })

    const handleButtonClick = (id:string) => {
        switch(id){
            case "import":
                // インポートのアクション呼ぶ
                uploadFile(csvFile)
                break;
            case "cancel":
                onClose();
                break;
        }
    }
    
    /**
     * ファイルを選択ボタンからファイルを選んだ時
     */
    const handleFileUpload = (event) => {
        if(event.target.files){
            var file = event.target.files[0];
            if(!file){
                return;
            }
            setFileName(file.name);
            setFileUploaded(true);

            setCsvFile(file);
        }
    }

    /**
     * ファイルドロップ時
     */
    const onDrop = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const item = event.dataTransfer.items[0];
        const entry = item.webkitGetAsEntry();

        if(entry.isFile){
            entry.file((file) => {
                if(file.type == "text/csv"){
                    setFileName(file.name);
                    setFileUploaded(true);

                    setCsvFile(file);
                }
            })
        }
    }

    /**
     * セットされたファイルをクリアしてアップロード前のダイアログに戻る
     */
    const onClearUpdatedFile = () => {
        setFileUploaded(false);
        setFileName('')
    }

    const onDragOver = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <SimpleDialog
            title={translate(MessageIds.labelCsvImport)}
            onClose={() => onClose()}
            buttons={[
                { id: "import", label: translate(MessageIds.labelImport), type:"submit", disabled:!fileUploaded},
                { id: "cancel", label: translate(MessageIds.labelCancel), type:"button"},
            ]}
            onClick={handleButtonClick}>
            {fileUploaded ? 
                <div className="mpp-text-center mpp-w-full mpp-h-full mpp-bg-gray-200 mpp-p-10">
                    <div>{translate(MessageIds.labelFileName)}{fileName}</div>
                    <button className="mpp-border-2 mpp-bg-white mpp-p-2 mpp-mt-2" onClick={onClearUpdatedFile}>{translate(MessageIds.labelClear)}</button>
                </div>
                :
                <div className="mpp-relative mpp-bg-gray-200 mpp-w-full mpp-h-full mpp-text-center mpp-p-10" onDrop={onDrop} onDragOver={onDragOver}>
                    <div className="mpp-table mpp-align-middle mpp-m-auto mpp-p-2">
                        <UploadIcon size={300} color={"#707070"}/>
                        <label>{translate(MessageIds.labelDragDiscription)}<br/>{translate(MessageIds.labelOr)}</label>
                    </div>
                    <label htmlFor="file-select-input" className="mpp-bg-blue-400 mpp-text-white mpp-w-12 mpp-h-12 mpp-p-2 mpp-cursor-pointer">{translate(MessageIds.labelSelectFile)}</label>
                    <input id="file-select-input" className="mpp-hidden" type="file" name="file" onChange={handleFileUpload} accept="text/csv"/>
                </div>
            }

            <a href={sampleData ? sampleData : ""} download={translate(MessageIds.labelSampleFileName)} className="mpp-text-blue-600 mpp-cursor-pointer"><u>{translate(MessageIds.labelDownloadSampleFile)}</u></a>
            
        </SimpleDialog>
    )
}