import { MessageIds } from '../messages';
import { PlaceSearchByTextResult, PlaceInfoState, PlaceFilterState } from '../models/place-types';
import { UIConfiguration, PlaceSearchCondition, PlaceSearchResult, PlaceDetailInfo, DeletePlaceResponse, PlaceMapItem, PlaceListResult, PlaceCategory, UpdatePlaceResponse, CreatePlaceResponse } from '../models/mloca-bff-types';
import { ApiError } from './api-error';
import FileSaver from 'file-saver';
import {
    ApolloClient,
    InMemoryCache,
    gql,
    NormalizedCacheObject
  } from "@apollo/client";

export class MlocaBff {

    private apiBaseUrl: string;
    private graphqlUrl: string;
    private mock: boolean = false;
    private getAccessToken: () => Promise<string>;
    private translate: (key: MessageIds) => string;
    private apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(
        getAccessToken: () => Promise<string>, 
        translate: (key: MessageIds) => string,
        apiBaseUrl: string, 
        graphqlUrl: string,
        mock: boolean) {
        
        this.getAccessToken = getAccessToken;
        this.apiBaseUrl = apiBaseUrl;
        this.graphqlUrl = graphqlUrl;
        this.mock = mock;
        this.translate = translate;

        this.apolloClient = new ApolloClient({
            uri: graphqlUrl,     
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: "network-only"
                }
            }
        });
    }

    getUIConfiguation() : Promise<UIConfiguration> {
        const req = (token): Promise<UIConfiguration> => {
            return this.apolloClient
                .query({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    query: gql`
                    {
                        uiConfiguration {
                          place {
                            canView,
                            canEdit,
                            geofenceEnabled
                          }
                        }
                    }`
                })
                .then(res => {
                    if (res.error) {
                        throw new ApiError(res.error.message, null);
                    }
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    return res.data.uiConfiguration.place;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        };
        
        return this.getAccessToken().then(value => {
            return req(value); 
        });
    }

    searchPlaces(condition: PlaceSearchCondition) : Promise<PlaceSearchResult> {
        let queries: Array<string> = [];
        let filters: Array<string> = [];

        if (condition.name) {
            filters.push(`name:"${condition.name}"`)
        }
        if (condition.address) {
            filters.push(`address:"${condition.address}"`)
        }
        if (condition.categoryID) {
            filters.push(`categoryID:${condition.categoryID}`)
        }
        if (condition.iconID) {
            filters.push(`iconID:${condition.iconID}`)
        }
        let filterString = "";
        if(filters.length == 0){
            filterString = "{}";
        }else{
            filterString = "{" + filters.join(',') + "}";
        }

        if (condition.includePlacesOnMap) {
            // 最大20000件取得
            queries.push(`
                placesOnMap: place_list(filter: ${filterString}, limit: 20000) {
                    places {
                        id,
                        name,
                        latitude,
                        longitude,
                        iconID   
                    }
                }
            `);        
        }
        if (condition.includePlacesOnList) {
            let offset: number = 0;
            if (condition.page) {
                offset = (condition.page - 1) * condition.pageLimit;
            }
            queries.push(`
                placesOnList: place_list(filter: ${filterString}, sort:{key:"${condition.sortKey}", direction: "${condition.sortDirection}"}, limit: ${condition.pageLimit}, offset: ${offset}) {
                    places {
                        id,
                        name,
                        nameYomi,
                        nameShort,
                        latitude,
                        longitude,
                        address,
                        tel,
                        email,
                        iconID,
                        categoryID,
                        categoryName,
                        geofence {
                            centerLatitude,
                            centerLongitude,
                            distance,
                            unit
                        }
                    },
                    count
                }
            `);        
        }
        if (condition.includeCategories) {
            queries.push(`
                categories: place_category_list {
                    categories {
                        id,
                        name    
                    }
                }
            `);        
        }

        const queryString = queries.join(',');

        const req = (token): Promise<PlaceSearchResult> => {
            return this.apolloClient
                .query({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    query: gql`
                    {
                        ${queryString}
                    }`
                })
                .then(res => {
                    if (res.error) {
                        throw new ApiError(res.error.message, null);
                    }
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }

                    let placeMapItems: PlaceMapItem[];
                    let placeListResult: PlaceListResult;
                    let placeCategories: PlaceCategory[];
                    if (res.data.placesOnMap) {
                        placeMapItems = res.data.placesOnMap.places 
                    }
                    if (res.data.placesOnList) {
                        placeListResult = {
                            pageItems: res.data.placesOnList.places, 
                            page: condition.page, 
                            totalCount: res.data.placesOnList.count
                        };
                    }
                    if (res.data.categories) {
                        placeCategories = res.data.categories.categories;
                    }
                    return {placesOnMap: placeMapItems, placesOnList: placeListResult, categories: placeCategories};
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        };

        return this.getAccessToken().then(value => {
            return req(value);            
        });
    }

    uploadFile(file) : Promise<any> {
        console.log("mloca-bff file:",file);

        const req = (token):Promise<any> => {
            return this.apolloClient
                .query({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    query: gql`
                    {
                        mutation($file:Upload!){
                            uploadFile(file:${file}){
                                filename,
                                mimetype,
                                encoding
                            }
                        }
                    }`
                }).then(res => {
                    if (res.error) {
                        throw new ApiError(res.error.message, null);
                    }
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }

                    //TBD
                    return null;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        };

        return this.getAccessToken().then(value => {
            return req(value);
        })
    }

    /**
     * 指定されたテキストで地点を検索します
     * @param searchText 検索するテキスト
     * @returns 検索結果
     */
    searchPlacesByText(searchText: string, abortSignal: AbortSignal): Promise<PlaceSearchByTextResult[]> {
        const req = (token): Promise<PlaceSearchByTextResult[]> => {
           return this.apolloClient
                .query({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        fetchOptions: {
                            signal: abortSignal
                        }
                    },
                    query: gql`
                    {
                        place_list(filter:{name:"${searchText}"}, sort:[{key:"nameyomi",direction:"asc"}, {key:"name", direction:"asc"}, {key:"nameshort", direction:"asc"}], limit:100) {
                            places {
                                id,
                                name,
                                latitude,
                                longitude,
                                iconID      
                            }
                        }
                    }`
                })
                .then(res => {
                    if (res.error) {
                        throw new ApiError(res.error.message, null);
                    }
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    return res.data.place_list.places;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        }

        return this.getAccessToken().then(value => {
            return req(value);
        });
    }


    /**
     * 地点の詳細情報を取得します
     * @param placeId 地点ID
     * @returns 検索結果
     */
     getPlaceDetail(placeId: number): Promise<PlaceDetailInfo> {
        const req = (token): Promise<PlaceDetailInfo> => {
           return this.apolloClient
                .query({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    query: gql`
                    {
                        place_list(filter:{iD:${placeId}}) {
                            places {
                                id,
                                name,
                                email,
                                tel,
                                latitude,
                                longitude,
                                iconID,
                                categoryID,
                                nameShort,
                                address,
                                nameYomi,
                                remarks,
                                isVisibleOnMap,
                                geofence {
                                    centerLatitude,
                                    centerLongitude,
                                    distance,
                                    unit
                                }
                            }
                        }
                    }`
                })
                .then(res => {
                    if (res.error) {
                        throw new ApiError(res.error.message, null);
                    }
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    if (res.data.place_list.places.length > 0) {
                        return res.data.place_list.places[0];
                    }
                    return null;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        }

        return this.getAccessToken().then(value => {
            return req(value);
        });
    }


    /**
     * 指定された地点IDで、地点を削除します。
     * @param placeId 削除する地点ID
     * @returns 削除結果
     */
    deletePlace(placeId: number): Promise<DeletePlaceResponse>{
        const req = (token):Promise<DeletePlaceResponse> => {
            return this.apolloClient
                .mutate({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    mutation: gql`
                        mutation deletePlace($place_id:String!){
                            delete_place(place_id:$place_id){
                                status,
                                error{
                                    statusCode,
                                    errorCode,
                                    message
                                }
                            }
                        }`,
                    variables:{
                        place_id:placeId
                    }
                })
                .then(res => {
                    if (res.errors && res.data.error.errorCode != "DELETE_NOT_FOUND") {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    return res.data.delete_place;
                })
                .catch(err => { 
                    throw this.defaultError(err);
                });
        }

        return this.getAccessToken().then(value => {
            return req(value);
        });
    }

    /**
     * 地点詳細情報を更新します
     * @param placeId 地点ID
     * @param place_data 更新する地点情報
     * @param geofenceId ジオフェンスID
     * @param geofence_data 更新するジオフェンス情報
     */
    updatePlace(placeData:PlaceInfoState): Promise<UpdatePlaceResponse>{
        const req = (token):Promise<UpdatePlaceResponse> => {
            return this.apolloClient
                .mutate({
                    context: {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    },
                    mutation: gql`
                        mutation updatePlace($place_id:String!, $plase_data:UpdatePlace!, $geofence_data:UpdateGeofence){
                            update_place(place_id:$place_id plase_data:$plase_data geofence_data:$geofence_data){
                                place{
                                    id,
                                    name,
                                    nameYomi,
                                    nameShort,
                                    latitude,
                                    longitude,
                                    address,
                                    email,
                                    tel,
                                    remarks,
                                    isVisibleOnMap,
                                    iconID,
                                    categoryID,
                                    categoryName,
                                    geofence{
                                        centerLatitude,
                                        centerLongitude,
                                        distance,
                                        unit
                                    },
                                }
                                error{
                                    statusCode,
                                    errorCode,
                                    message
                                }
                            }
                        }`,
                    variables:{ 
                        place_id:placeData.id,
                        plase_data:{
                            name:placeData.name, 
                            nameYomi:placeData.nameYomi,
                            nameShort:placeData.nameShort,
                            latitude:placeData.latitude,
                            longitude:placeData.longitude,
                            address:placeData.address,
                            remarks:placeData.remarks,
                            tel:!(placeData.tel) ? null : placeData.tel,        // 空文字の時はnullで送信
                            email:!(placeData.email) ? null : placeData.email,  // 空文字の時はnullで送信
                            isVisibleOnMap:placeData.isVisibleOnMap,
                            iconID:placeData.iconID,
                            categoryID:placeData.categoryID ? placeData.categoryID : null
                        },
                        geofence_data:{
                            useGeofence:placeData.useGeofence ? placeData.useGeofence : false,
                            centerLatitude:placeData.useGeofence == true ? placeData.latitude : 0,
                            centerLongitude:placeData.useGeofence == true ? placeData.longitude : 0,
                            distance:placeData.useGeofence == true ? placeData.geofenceDistance : 0,
                            unit:placeData.useGeofence == true ? placeData.geofenceDistanceUnit : ""
                        }
                    }
                })
                .then(res => {
                    if (res.errors) {
                        throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                    }
                    
                    return res.data.update_place;
                })
                .catch(err => { 
                    
                    throw this.defaultError(err);
                });
        }

        return this.getAccessToken().then(value => {
            return req(value);
        }); 
    }

    /**
     * 地点情報を新規登録します
     * @param placeData 地点登録情報
     */
    createPlace(placeData:PlaceInfoState): Promise<CreatePlaceResponse>{

        const req = (token) : Promise<CreatePlaceResponse> => {
            return this.apolloClient
            .mutate({
                context: {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                },
                mutation: gql`
                    mutation createPlace($plase_data:UpdatePlace!, $geofence_data:UpdateGeofence){
                        create_place(plase_data:$plase_data, geofence_data:$geofence_data){
                            place{
                                id,
                                name,
                                nameYomi,
                                nameShort,
                                latitude,
                                longitude,
                                address,
                                email,
                                tel,
                                remarks,
                                isVisibleOnMap,
                                iconID,
                                categoryID,
                                geofence{
                                    centerLatitude,
                                    centerLongitude,
                                    distance,
                                    unit
                                }
                            },
                            error{
                                statusCode,
                                errorCode,
                                message
                            }
                        }
                    }`,
                variables:{
                    plase_data:{
                        name: placeData.name,
                        nameYomi: placeData.nameYomi,
                        nameShort: placeData.nameShort,
                        latitude: placeData.latitude,
                        longitude: placeData.longitude,
                        address: placeData.address,
                        remarks: placeData.remarks,
                        tel:!(placeData.tel) ? null : placeData.tel,        // 空文字の時はnullで送信
                        email:!(placeData.email) ? null : placeData.email,  // 空文字の時はnullで送信
                        isVisibleOnMap: placeData.isVisibleOnMap,
                        iconID: placeData.iconID,
                        categoryID: placeData.categoryID ? placeData.categoryID : null
                    },
                    geofence_data:{
                        useGeofence: placeData.useGeofence ? placeData.useGeofence : false,
                        centerLatitude: placeData.useGeofence == true ? placeData.latitude : 0,
                        centerLongitude: placeData.useGeofence == true ? placeData.longitude : 0,
                        distance: placeData.useGeofence == true ? placeData.geofenceDistance : 0,
                        unit: placeData.useGeofence == true ? placeData.geofenceDistanceUnit : ""
                    }
                }
                
            })
            .then(res => {
                if (res.errors) {
                    throw new ApiError(res.errors.map((e: {message: string})=> e.message).join('\n'), null);
                }
                if (res.errors) {
                    throw new ApiError(res.errors.map((e: {message: string}) => e.message).join('\n'), null);
                }
                
                return res.data.create_place;
            })
            .catch(err => { 
                throw this.defaultError(err);
            });
        }

        return this.getAccessToken().then(value => {
            return req(value);
        });
    }

    /**
     * 地点一覧をCSVファイルでダウンロードします。
     * @param condition フィルタ条件、ソート条件等
     * @returns CSVファイル
     */
    downloadCSV(condition: PlaceFilterState) : Promise<any> {
   
        const url = this.apiBaseUrl + `v1/Place/DownloadCSV`;
        const req = (token):Promise<any> => {
            return fetch(url, {
                method: 'post',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    //type: 'mloca',
                    filter: {
                        categoryID: condition.categoryID,
                        name: condition.name,
                        iconID: condition.iconID,
                        address: condition.address,
                    },
                    sort:[{
                        key: 'name',
                        direction: 'asc'
                    },{
                        key: 'nameyomi',
                        direction: 'asc'
                    },{
                        key: 'nameshort',
                        direction: 'asc'
                    }],
                    limit: 500
                })
            }).then(res => {
                if (res.status == 200) { 
                    const filename = res.headers.get('Content-Disposition').split('filename=')[1].split(';')[0];
                    return res.blob().then(function(blob) {      
                        FileSaver.saveAs(blob, filename);
                    })
                }
                else {
                    throw new ApiError(res.statusText, null);
                }
            })
            .catch(err => { 
                throw this.defaultError(err);
            });            
        };

        return this.getAccessToken().then(value => {
            return req(value);
        })
    }

    private defaultError(innerError: any) : ApiError {
        if (innerError instanceof ApiError) {
            return innerError;
        }

        if (innerError.networkError) {
            return new ApiError(this.translate(MessageIds.errorNetwork), innerError);
        }

        return new ApiError(this.translate(MessageIds.errorUnknown), innerError);
    }
}
