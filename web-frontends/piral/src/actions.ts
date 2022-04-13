import jwtDecode, { JwtPayload } from 'jwt-decode';
import { GlobalStateContext } from 'piral';

/*
 * サイドバーのオープン状態を設定します。
 */
export function setSidebarOpen(ctx: GlobalStateContext, open: boolean) {
  ctx.dispatch(state => ({
    ...state,
    sidebarOpen: open
  }));
}

/**
 * トークンの有効期限切れをチェックします。
 */
export function checkAccessTokenExpired(ctx: GlobalStateContext){
  ctx.apis.root.getAccessToken().then(value => {
    const jwt = jwtDecode<JwtPayload>(value);
    const expired: number = jwt["exp"];
    const now = new Date();

    // 桁数が合わないため調整
    let expiredStr = expired.toString();
    let expiredDigit = expiredStr.length;
    let nowStr = now.getTime().toString();
    let nowDigit = nowStr.length;

    if(expiredDigit < nowDigit){
      let count = nowDigit - expiredDigit;
      if(count != 0){
        for(var i=0;i < count; i++){
          expiredStr = expiredStr + "0";
        }
      }
    }else if(expiredDigit > nowDigit){
      let count = expiredDigit - nowDigit;
      if(count != 0){
        for(var i=0;i < count; i++){
          nowStr = nowStr + "0";
        }
      }
    }

    const expiredDate = new Date(Number(expiredStr));
    const nowDate = new Date(Number(nowStr));

    let isExpired = true;
    //期限切れチェック
    if(expiredDate.getTime() >= nowDate.getTime()){
      isExpired = false;
    }

    ctx.dispatch(state => ({
      ...state,
      tokenExpired: isExpired
    }))
  });
}
