import {Bar, BarChart, Tooltip, XAxis, YAxis} from "recharts";
import {iLink} from "@/types/iLink";
import {CustomTooltip} from "@/components/CustomChartTooltip";

export const LinkVisitsChart = ({data = []}: { data: iLink[] }) => {
    return (
        <div className="bg-base-100 rounded-box shadow-md lg:fixed lg:top-30 lg:right-10 w-4/5 lg:w-auto mx-auto">
            <div className="text-center text-xl uppercase font-semibold text-white opacity-80 tracking-wid py-4">
                Most visited:
            </div>
            <BarChart
                width={250}
                height={250}
                data={data}
                className="mr-30 lg:mr-16 mb-4"
            >
                <XAxis dataKey="name"/>
                <YAxis dataKey="visits"/>
                <Tooltip content={<CustomTooltip active={false} payload={[]} label=""/>}/>
                <Bar dataKey="visits" name="Visits by link" fill="#570DF8"/>
            </BarChart>
        </div>
    );
}