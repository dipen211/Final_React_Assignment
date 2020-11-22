const columns = [
    {
        title: 'Product Id',
        field: 'ProductID',
        show: true,
        filter: 'numeric',
        width:"50px",
        filterable:false
    },
    {
        title: 'Product Name',
        field: 'ProductName',
        show: true,
        filter: 'text',
        width:"150px"
    },
    {
        title: 'Quantity Per Unit',
        field: 'QuantityPerUnit',
        show: true,
        filter: 'numeric',
        width:"70px"
    },
    {
        title: 'Unit Price',
        field: 'UnitPrice',
        show: true,
        filter: 'numeric',
        width:"80px"
    },
    {
        title: 'Units In Stock',
        field: 'UnitsInStock',
        show: true,
        filter: 'numeric',
        width:"90px"
    },
    {
        title: 'Discontinued',
        field: 'Discontinued',
        show: true,
        filter: 'boolean',
        width:"100px"
    }
];

export default columns;
