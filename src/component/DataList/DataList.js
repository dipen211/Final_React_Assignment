import React from "react";
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import './DataList.css';
import { Window } from '@progress/kendo-react-dialogs';
import { sampleProducts } from '../../Data/sample-products.jsx';
import { filterBy } from '@progress/kendo-data-query';
import { orderBy } from '@progress/kendo-data-query';
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import { CRUD } from "../CRUD/CRUD";
import { insertItem, getItems, updateItem, deleteItem } from "../CRUD/services.js";
import { ColumnMenu } from '../ColumnHide/ShowHideColumn';
import columns from '../../Data/Column';

class DataList extends React.Component {
    editField = "inEdit";
    _exporter;
    export = () => {
        this._exporter.save();
    };

    state = {
        selectedData: sampleProducts.map(dataItem => Object.assign({ selected: false }, dataItem)),
        data: [],
        filter: {
            logic: "and",
            filters: [
                { field: "ProductName", operator: "contains", value: "" }
            ]
        },
        skip: 0,
        take: 10,
        sort: [],
        allowUnsort: true,
        windowVisible: false,
        gridClickedRow: {},
        columns: columns
    };

    //Show Hide Column
    createDataState(dataState) {
        return {
            result: process(sampleProducts.slice(0), dataState),
            dataState: dataState
        };
    }

    dataStateChange = (event) => {
        this.setState(this.createDataState(event.dataState));
    }

    onColumnsSubmit = (columnsState) => {
        this.setState({
            columns: columnsState
        });
    }
    //Row Details
    handleGridRowClick = (e) => {
        this.setState({
            windowVisible: true,
            gridClickedRow: e.dataItem
        });
    }
    closeWindow = (e) => {
        this.setState({
            windowVisible: false
        });
    };

    //CheckBox
    selectionChange = (event) => {
        const data = this.state.selectedData.map(item => {
            if (item.ProductID === event.dataItem.ProductID) {
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ data });
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.data.map(item => {
            item.selected = checked;
            return item;
        });
        this.setState({ data });
    };

    //Short
    sortChange = (event) => {
        this.setState({
            data: this.getProducts(event.sort),
            sort: event.sort
        });
    }

    getProducts = (sort) => {
        return orderBy(sampleProducts, sort);
    }

    //Pagination
    pageChange = (event) => {
        this.setState({
            skip: event.page.skip,
            take: event.page.take
        });
    }

    //CRUD
    componentDidMount() {
        this.setState({
            data: getItems()
        });
    }

    CommandCell = props => (
        <CRUD
            {...props}
            edit={this.enterEdit}
            remove={this.remove}
            add={this.add}
            discard={this.discard}
            update={this.update}
            cancel={this.cancel}
            editField={this.editField}
        />
    );

    // modify the data in the store, db etc
    remove = dataItem => {
        const data = deleteItem(dataItem);
        this.setState({ data });
    };

    add = dataItem => {
        dataItem.inEdit = true;

        const data = insertItem(dataItem);
        this.setState({
            data: data
        });
    };

    update = dataItem => {
        dataItem.inEdit = false;
        const data = updateItem(dataItem);
        this.setState({ data });
    };

    // Local state operations
    discard = dataItem => {
        const data = [...this.state.data];
        data.splice(0, 1)
        this.setState({ data });
    };

    cancel = dataItem => {
        const originalItem = getItems().find(
            p => p.ProductID === dataItem.ProductID
        );
        const data = this.state.data.map(item =>
            item.ProductID === originalItem.ProductID ? originalItem : item
        );

        this.setState({ data });
    };

    enterEdit = dataItem => {
        this.setState({
            data: this.state.data.map(item =>
                item.ProductID === dataItem.ProductID ? { ...item, inEdit: true } : item
            )
        });
    };

    itemChange = (event) => {
        const inEditID = event.dataItem.ProductID;
        const data = this.state.data.map(item =>
            item.ProductID === inEditID ? { ...item, [event.field]: event.value } : item

        );
        this.setState({ data });
    };


    addNew = () => {
        const newDataItem = { inEdit: true, Discontinued: false };

        this.setState({
            data: [newDataItem, ...this.state.data]
        });
    };

    render() {
        return (
            <>
                <ExcelExport
                    data={sampleProducts}
                    fileName="Products.xlsx"
                    ref={(exporter) => { this._exporter = exporter; }}
                    filterable={true}
                >
                    <ExcelExportColumn field="ProductID" title="Product ID" />
                    <ExcelExportColumn field="ProductName" title="Product Name" />
                    <ExcelExportColumn field="QuantityPerUnit" title="Quantity Per Unit" />
                    <ExcelExportColumn field="UnitPrice" title="Unit Price" />
                    <ExcelExportColumn field="UnitsInStock" title="Units In Stock" />
                    <ExcelExportColumn field="Discontinued" title="Discontinued" />
                </ExcelExport>
                <Grid
                    style={{ height: "420px"}}

                    data={(filterBy(this.state.data, this.state.filter)).slice(this.state.skip, this.state.take + this.state.skip)}

                    onItemChange={this.itemChange}
                    editField={this.editField}

                    reorderable
                    resizable

                    filterable
                    filter={this.state.filter}
                    onFilterChange={(e) => {
                        this.setState({
                            filter: e.filter
                        });
                    }}

                    skip={this.state.skip}
                    take={this.state.take}
                    total={sampleProducts.length}
                    pageable={true}
                    onPageChange={this.pageChange}

                    sortable={{
                        allowUnsort: this.state.allowUnsort
                    }}
                    sort={this.state.sort}
                    onSortChange={this.sortChange}

                    selectedField="selected"
                    onSelectionChange={this.selectionChange}
                    onHeaderSelectionChange={this.headerSelectionChange}

                    onRowDoubleClick={this.handleGridRowClick}
                >
                    <GridToolbar>
                        <button title="Add new" className="k-button k-primary" onClick={this.addNew}>
                            Add new
                            </button>
                        <button title="Export Excel" className="k-button k-primary" onClick={this.export} >
                            Export to Excel
                            </button>
                    </GridToolbar>
                    <Column field="selected" width="50px" filterable={false} headerSelectionValue={
                        this.state.data.findIndex(dataItem => dataItem.selected === false) === -1
                    } />
                    {
                        this.state.columns.map((column, idx) =>
                            column.show && (<Column
                                key={idx}
                                field={column.field}
                                title={column.title}
                                filter={column.filter}
                                width="150px"
                                columnMenu={
                                    props =>
                                        <ColumnMenu
                                            {...props}
                                            columns={this.state.columns}
                                            onColumnsSubmit={this.onColumnsSubmit}
                                        />
                                }
                            />)
                        )
                    }
                    <Column cell={this.CommandCell} width="200px" filterable={false} />
                </Grid>
                {this.state.windowVisible &&
                    <Window
                        title="Product Details"
                        onClose={this.closeWindow}
                        height={250}>
                        <dl style={{ textAlign: "left" }}>
                            <dt>Product Name</dt>
                            <dd>{this.state.gridClickedRow.ProductName}</dd>
                            <dt>Product ID</dt>
                            <dd>{this.state.gridClickedRow.ProductID}</dd>
                            <dt>Quantity per Unit</dt>
                            <dd>{this.state.gridClickedRow.QuantityPerUnit}</dd>
                        </dl>
                    </Window>
                }
            </>
        );
    }
}
export default DataList;