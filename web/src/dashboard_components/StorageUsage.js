import { Pie, Bar } from '@ant-design/charts';


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatCount(count, decimals = 2) {
    return count.toExponential(decimals);
}


const StoragePie = (props) => {
    return <Pie
        data={props.data}
        angleField='value'
        colorField='subtype'
        style={{ width: 600, height: 600 }}
        meta={{value: {formatter:  props.units === 'bytes' ? formatBytes : formatCount}}}
    />;
};

const FileTypeDistribution = (props) => {
    var config = {
        data: props.data,
        xField: 'value',
        yField: 'subtype',
        seriesField: 'subtype',
        legend: { position: 'top-left' },
        style: { width: 1200, height: 600 },
        meta: {value: {formatter:  props.units === 'bytes' ? formatBytes : formatCount}},
    };
    return <Bar {...config} />;
};


export { StoragePie, FileTypeDistribution };
