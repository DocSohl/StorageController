import { Pie, Bar } from '@ant-design/charts';


const StoragePie = (props) => {
    const data = [
        {
            country: 'Asia',
            year: '1750',
            value: 502,
        },
        {
            country: 'Asia',
            year: '1800',
            value: 635,
        },
        {
            country: 'Europe',
            year: '1750',
            value: 163,
        },
        {
            country: 'Europe',
            year: '1800',
            value: 203,
        },
    ];
    return <Pie
        data={data}
        meta={{
            country: {
                alias: '国家',
                range: [0, 1],
            },
            value: {
                alias: '数量',
                formatter: (v) => {
                    return `${v}个`;
                },
            },
        }}
        angleField='value'
        colorField='country'
        style={{ width: 600, height: 600 }}
    />;
};

const FileTypeDistribution = (props) => {
    var data = [
        {
            year: '1951 年',
            value: 38,
        },
        {
            year: '1952 年',
            value: 52,
        },
        {
            year: '1956 年',
            value: 61,
        },
        {
            year: '1957 年',
            value: 145,
        },
        {
            year: '1958 年',
            value: 48,
        },
    ];
    var config = {
        data: data,
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: { position: 'top-left' },
        style: { width: 1200, height: 600 }
    };
    return <Bar {...config} />;
};


export { StoragePie, FileTypeDistribution };
