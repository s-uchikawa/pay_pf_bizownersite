import React from 'react';
import './App.css';
import { Button, DownloadIcon, FilterIcon, PlusIcon, Input, Menu, MenuItem, Select, Switch, Progress, Table, 
  TableHead, TableFooter, TableRow,TableCell,TableBody ,
  TableSortLabel, PaginationFooter ,SimpleTable, SimpleDialog,
  OptionButton } from 'paypf-bizowner-ui-elements'
import {TableColumn} from 'paypf-bizowner-ui-elements'
import { Link } from "react-router-dom";

function App() {
  const [menuOpened, setMenuOpened] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
  const [selectValue, setSelectValue] = React.useState("2");
  const [checked,setChecked]=React.useState(true);

  const onChange=(e: any)=>{
    console.log(e);
    setChecked(e);
  }

  const handleClickMenuItem　= (e:HTMLButtonElement) => {
    console.log(e.value);
  }

  const handleSelectChange = (value: any) => {
    console.log(value);
    setSelectValue(value);
  }  

  type Order = "asc" | "desc";

  const [sort, setSort] = React.useState("");
  const [direction, setDirection] = React.useState<Order>('desc');
  const [page, setPage] = React.useState(1);

  const handleItemClick = (event: React.MouseEvent<HTMLSpanElement,MouseEvent>) => {
    if (event.target instanceof HTMLTableCellElement || event.target instanceof HTMLSpanElement) {
      if (event.target.id){
        var id = event.target.id;
        setSort(() => id);
      }

      if (direction === 'desc') {
        setDirection(() => 'asc');
      }else{
        setDirection(() => 'desc');
      }
    }
  }

  const handlePagination = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any) => {
    setPage(value);
  }


　// デフォルトの表用
  var headerList:TableColumn[] =[
    {id: 'name', label:'名称'},
    {id: 'category', label:'カテゴリ'},
    {id: 'address', label:'住所'},
    {id: 'radius', label:'入場判定'},
    {id: 'mail', label:'メール'},
  ]

  var itemList=[
    ['モバイルクリエイト1','MC1','わ大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1001,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1002,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1003,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1003,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト3','MC','ら大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC1','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト2','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','あ大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト5','MC1','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト4','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC1','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト6','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
    ['モバイルクリエイト','MC','大分県大分市東大道2丁目.......',1000,'xxxxxx@xxx.xxx'],
  ];

  const [sortItem, setSortItem] = React.useState('');
  const [direction2, setDirection2] = React.useState<Order>("desc");
  const [itemSortList, setItemSortList] = React.useState<Array<Array<any>>>(itemList);

  const handleSort = (key: string) => {
      var i = headerList.findIndex((u) => u.id === key);
      console.log(key,i)

      if (sortItem == key){
        switch (direction2) {
          case 'asc':
            setDirection2(() => 'desc')
            break;
          case 'desc':
          default:
            setDirection2(() => 'asc');
            break;
        }
      } else {
        setDirection2(() => 'asc');
      }

      switch (direction2) {
        case 'desc':
          setItemSortList(() => itemSortList.sort((a, b) => {
            if (a[i] < b[i]) return 1;
            if (a[i] > b[i]) return -1;
            return 0;
          }))
          console.log(itemSortList)
          break;
        case 'asc':
        default:
          setItemSortList(() =>  itemSortList.sort((a, b) => {
            if (a[i] > b[i]) return 1;
            if (a[i] < b[i]) return -1;
            return 0;
          }))
          console.log(itemSortList)
          break;
      }
      setSortItem(() => key);
  }


  const [perPage, setRowsPerPage] = React.useState(10);
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
  }

  const [page2, setPage2] = React.useState(1);
  const handlePageChange = (value: number) => {
    setPage2(value);
  }
  
  let tm: NodeJS.Timeout;
  let cp: number = 0;
  const [currentPercent , setcurrentPercent ] = React.useState(0);  

  function increase() {
    const newPercent = cp + 1;
    if (newPercent > 100) {
      clearTimeout(tm);
      return;
    }
    cp = newPercent;
    setcurrentPercent(cp);
    tm = setTimeout(increase, 30);
  }

  function reStart() {
    clearTimeout(tm);  
    cp = 0;
    setcurrentPercent(cp);
    tm = setTimeout(increase, 30);
  }

  return (
    <div className="App">
      <p><Link to="/DataTable">DataTableサンプル</Link></p>
      <p>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
        <Button type="button">Button</Button>
      </p>
      <p>
        <Button icon={<DownloadIcon/>} wSize="auto">ダウンロード</Button>
        <Button icon={<FilterIcon/>} >フィルター</Button>
        <Button icon={<PlusIcon/>} >新規追加</Button>
      </p>
      <p>
        <Input id="name" name="name" label="名称" type="text" />
        <Input id="number" name="number" label="数値" type="number" />
        <Input id="email" name="email" label="Eメール" type="email" />
        <Input id="password" name="password" label="パスワード" type="password" />
        <Input id="date" name="date" label="日付" type="date" />
        <Input id="tel" name="tel" label="電話番号" type="tel" />
        <Input id="search" name="search" type="search" placeholder="Search..." />
      </p>
      <p>
        <Button wSize="auto" onClick={(event) => { setMenuOpened(!menuOpened); setAnchorEl(event.currentTarget) }}>メニューボタン</Button>

        <Menu id="menu1" open={menuOpened} anchorEl={anchorEl} >
          <li>a</li>
          <li>b</li>
          <MenuItem id="menuItem1" selected={false} value="c" onClick={(e) => handleClickMenuItem(e)　}>c</MenuItem>
          <MenuItem id="menuItem1" selected={true} value="d" onClick={(e) => handleClickMenuItem(e)　}>d</MenuItem>
        </Menu>
      </p>

      <p>
        <Select id="select" label="選択 : " defaultValue={selectValue} onChange={handleSelectChange}>
          <option value="1">One</option>
          <option value="2" >Two</option>
          <option value="3" >Three</option>
          <option value="4" >Four</option>
        </Select>
      </p>
      <p>
        <Switch id="switch1" onChange={onChange} checked={checked}> </Switch>
      </p>
      
      <Table maxHeight={400} maxWidth={1000} stickyHeader stickyFooter>
      <TableHead>
        <TableRow>
        <TableCell id="1" component='th' align='center' onClick={handleItemClick}>ヘッダー１<TableSortLabel sort={sort=="1"} direction={direction} /></TableCell>
        <TableCell id="2" variant='head' onClick={handleItemClick}>ヘッダー2<TableSortLabel sort={sort=="2"} direction={direction} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>データ１</TableCell>
          <TableCell>データ１－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ２</TableCell>
          <TableCell>データ２－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>データ３</TableCell>
          <TableCell>データ３－２</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter >
        <TableRow>
          <TableCell colSpan={2}>
          <PaginationFooter count={10} align={'right'} boundaryCount={2} page={page} onChange={handlePagination} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>

      <SimpleTable 
        maxHeight={400} stickyHeader stickyFooter
        headerList={headerList} 
        itemList={itemSortList}
        sortKey={sortItem}
        sortDirection={direction2}
        onSort={handleSort}
        pagination 
        paginationConf={{rowsPerPage:perPage,rowsPerPageOptions:[10,20,30],page:page2,onPageChange:handlePageChange, onRowsPerPageChange:handleRowsPerPageChange }}>
      </SimpleTable> 

      <p>
        <Progress percent={currentPercent} text='In Progress...' size='half' verticalTextLayout='bottom' horizontalTextLayout='center'/>
        <Button type="button" onClick={reStart}>
          Restart
        </Button>
      </p>

      <p>
        <OptionButton 
          iconSize={16}
          items={[
            {id: "item1", label: "ラベル1"},
            {id: "item2", label: "ラベル2", disable: true},
            {id: "item3", label: "ラベル3"}
          ]} 
          onMenuItemClick={(menuItemId) => { alert("Click " + menuItemId); }} />
      </p>


      <p>
        <SimpleDialog 
          title="テスト"
          onClose={() => {}}         
          buttons={[
            {id: "save", label:"保存", type: "submit"}
          ]}>
          内容
        </SimpleDialog>
      </p>
    </div>
  );
}

export default App;
